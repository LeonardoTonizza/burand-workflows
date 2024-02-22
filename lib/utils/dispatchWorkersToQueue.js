import { logger } from 'firebase-functions/v2';
import { dispatchWorkerToQueue } from './dispatchWorkerToQueue.js';
export async function dispatchWorkersToQueue({ id, payload, steps }, step) {
    await dispatchWorkerToQueue({
        workerId: id,
        call: step.call,
        payload,
        step: step.step
    });
    const promises = [];
    for (const parallel of step.parallel) {
        const parallelStep = steps.find(s => s.step === parallel);
        if (parallelStep) {
            promises.push(dispatchWorkerToQueue({
                workerId: id,
                call: parallelStep.call,
                payload,
                step: parallelStep.step
            }));
        }
        else {
            logger.warn(`Parallel Step "${parallel}" not found.`);
        }
    }
    await Promise.all(promises);
}
