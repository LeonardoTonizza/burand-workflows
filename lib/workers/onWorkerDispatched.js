import { ofFirestore } from '@burand/functions/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { error, log } from 'firebase-functions/logger';
import { onTaskDispatched } from 'firebase-functions/v2/tasks';
import { FirestoreCollecionName } from '../config/FirestoreCollecionName.js';
const { WORKFLOW_EXECUTIONS } = FirestoreCollecionName;
export function onWorkerDispatched(options, handler) {
    const mergeOptions = {
        retryConfig: {
            maxAttempts: 3
        },
        ...options
    };
    return onTaskDispatched(mergeOptions, async (event) => {
        log('onWorkerDispatched triggered', event);
        await getFirestore().runTransaction(async (t) => {
            const workerExecutionRef = getFirestore().collection(WORKFLOW_EXECUTIONS).doc(event.data.workerId);
            const doc = await t.get(workerExecutionRef);
            const data = ofFirestore(doc);
            const step = data.steps.find(s => s.step === event.data.step);
            if (!step) {
                return;
            }
            step.retries = event.retryCount;
            step.maxAttempts = mergeOptions.retryConfig.maxAttempts;
            step.startedAt = new Date();
            step.status = 'running';
            step.logs.push({
                createdAt: new Date(),
                status: 'running'
            });
            if (event.headers?.['x-cloud-trace-context']) {
                step.trace.push(event.headers['x-cloud-trace-context']);
            }
            t.update(workerExecutionRef, {
                steps: data.steps,
                updatedAt: new Date()
            });
        });
        try {
            log('Handler execution started');
            await handler(event);
            log('Handler execution completed');
            await getFirestore().runTransaction(async (t) => {
                const sfDocRef = getFirestore().collection(WORKFLOW_EXECUTIONS).doc(event.data.workerId);
                const doc = await t.get(sfDocRef);
                const data = ofFirestore(doc);
                const step = data.steps.find(s => s.step === event.data.step);
                if (!step) {
                    return;
                }
                step.completedAt = new Date();
                step.status = 'completed';
                step.logs.push({
                    createdAt: new Date(),
                    status: 'completed'
                });
                t.update(sfDocRef, {
                    steps: data.steps,
                    updatedAt: new Date()
                });
            });
        }
        catch (err) {
            error('Error caught in onWorkerDispatched', err);
            await getFirestore().runTransaction(async (t) => {
                const sfDocRef = getFirestore().collection(WORKFLOW_EXECUTIONS).doc(event.data.workerId);
                const doc = await t.get(sfDocRef);
                const data = ofFirestore(doc);
                const step = data.steps.find(s => s.step === event.data.step);
                if (!step) {
                    return;
                }
                step.status = 'failed';
                step.logs.push({
                    createdAt: new Date(),
                    status: 'failed'
                });
                t.update(sfDocRef, {
                    steps: data.steps,
                    updatedAt: new Date()
                });
            });
            throw err;
        }
    });
}
