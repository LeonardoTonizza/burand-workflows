import { getFunctions } from 'firebase-admin/functions';
export async function dispatchWorkerToQueue({ workerId, call, payload, step }) {
    await getFunctions()
        .taskQueue(call)
        .enqueue({
        payload,
        workerId,
        step
    });
}
