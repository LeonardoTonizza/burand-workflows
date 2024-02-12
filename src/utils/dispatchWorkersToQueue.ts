import { logger } from 'firebase-functions/v2';

import { WorkflowExecutionStep } from '../interfaces/WorkflowExecutionStep.js';
import { WorkflowExecution } from '../models/WorkflowExecution.js';
import { dispatchWorkerToQueue } from './dispatchWorkerToQueue.js';

export async function dispatchWorkersToQueue(
  { id, payload, steps }: WorkflowExecution,
  step: WorkflowExecutionStep
): Promise<void> {
  await dispatchWorkerToQueue({
    workerId: id,
    call: step.call,
    payload,
    step: step.step
  });

  const promises: Promise<void>[] = [];

  for (const parallel of step.parallelSteps) {
    const parallelStep = steps.find(s => s.step === parallel);
    if (parallelStep) {
      promises.push(
        dispatchWorkerToQueue({
          workerId: id,
          call: parallelStep.call,
          payload,
          step: parallelStep.step
        })
      );
    } else {
      logger.warn(`Parallel Step "${parallel}" not found.`);
    }
  }

  await Promise.all(promises);
}
