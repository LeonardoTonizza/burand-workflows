import { ofFirestore } from '@burand/functions/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { FirestoreCollecionName } from '../config/FirestoreCollecionName.js';
import { dispatchWorkersToQueue } from '../utils/dispatchWorkersToQueue.js';
const { WORKFLOW_EXECUTIONS } = FirestoreCollecionName;
export const startWorkflowExecutionStep = onDocumentCreated(`${WORKFLOW_EXECUTIONS}/{executionId}`, async (event) => {
    if (!event.data) {
        return;
    }
    const data = ofFirestore(event.data);
    const step = data.steps[0];
    await event.data.ref.update({
        status: 'running',
        startedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
    });
    await dispatchWorkersToQueue(data, step);
});
