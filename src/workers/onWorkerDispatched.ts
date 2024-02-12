import { ofFirestore } from '@burand/functions/firestore';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { Request, TaskQueueFunction, TaskQueueOptions, onTaskDispatched } from 'firebase-functions/v2/tasks';

import { FirestoreCollecionName } from '../config/FirestoreCollecionName.js';
import { WorkflowExecution } from '../models/WorkflowExecution.js';

const { WORKFLOW_EXECUTIONS } = FirestoreCollecionName;

export interface WorkerDispatched<T> {
  payload: T;
  workerId: string;
  step: string;
}

export function onWorkerDispatched<T>(
  options: TaskQueueOptions,
  handler: (request: Request<WorkerDispatched<T>>) => void | Promise<void>
): TaskQueueFunction<WorkerDispatched<T>> {
  return onTaskDispatched<WorkerDispatched<T>>(options, async event => {
    await getFirestore().runTransaction(async t => {
      const workerExecutionRef = getFirestore().collection(WORKFLOW_EXECUTIONS).doc(event.data.workerId);
      const doc = await t.get(workerExecutionRef);
      const data = ofFirestore<WorkflowExecution>(doc);

      const step = data.steps.find(s => s.step === event.data.step);
      if (!step) {
        return;
      }

      step.executionId = event.id;
      step.trace = event.headers ? event.headers['x-cloud-trace-context'] : null;
      step.startedAt = new Date();
      step.status = 'running';
      step.logs.push({
        createdAt: new Date(),
        status: 'running'
      });

      t.update(workerExecutionRef, {
        steps: data.steps,
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    try {
      await handler(event);

      await getFirestore().runTransaction(async t => {
        const sfDocRef = getFirestore().collection(WORKFLOW_EXECUTIONS).doc(event.data.workerId);
        const doc = await t.get(sfDocRef);
        const data: WorkflowExecution = ofFirestore(doc);

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
          updatedAt: FieldValue.serverTimestamp()
        });
      });
    } catch (error) {
      await getFirestore().runTransaction(async t => {
        const sfDocRef = getFirestore().collection(WORKFLOW_EXECUTIONS).doc(event.data.workerId);
        const doc = await t.get(sfDocRef);
        const data: WorkflowExecution = ofFirestore(doc);

        const step = data.steps.find(s => s.step === event.data.step);
        if (!step) {
          return;
        }

        step.completedAt = new Date();
        step.status = 'failed';
        step.logs.push({
          createdAt: new Date(),
          status: 'failed'
        });

        t.update(sfDocRef, {
          status: 'failed',
          steps: data.steps,
          updatedAt: FieldValue.serverTimestamp()
        });
      });

      throw error;
    }
  });
}
