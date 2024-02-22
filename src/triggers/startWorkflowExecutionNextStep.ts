import { ofFirestore } from '@burand/functions/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

import { FirestoreCollecionName } from '../config/FirestoreCollecionName.js';
import { WorkflowExecution } from '../models/WorkflowExecution.js';
import { dispatchWorkersToQueue } from '../utils/dispatchWorkersToQueue.js';
import { findStepThatChangedToCompleted } from '../utils/findStepThatChangedToCompleted.js';

const { WORKFLOW_EXECUTIONS } = FirestoreCollecionName;

export const startWorkflowExecutionNextStep = onDocumentUpdated(`${WORKFLOW_EXECUTIONS}/{executionId}`, async event => {
  if (!event.data) {
    return;
  }

  const oldData = ofFirestore<WorkflowExecution>(event.data.before);
  const newData = ofFirestore<WorkflowExecution>(event.data.after);

  const oldEveryCompleted = oldData.steps.every(s => s.status === 'completed');
  const newEveryCompleted = newData.steps.every(s => s.status === 'completed');

  if (oldEveryCompleted && newEveryCompleted) {
    return;
  }

  if (!oldEveryCompleted && newEveryCompleted) {
    await event.data.after.ref.update({
      status: 'completed',
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    return;
  }

  const completedStep = findStepThatChangedToCompleted(oldData.steps, newData.steps);
  if (!completedStep) {
    return;
  }

  if (!completedStep.next) {
    return;
  }

  const nextStep = newData.steps.find(s => s.step === completedStep.next);
  if (!nextStep) {
    return;
  }

  await dispatchWorkersToQueue(newData, nextStep);
});
