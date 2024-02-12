import { getFunctions } from 'firebase-admin/functions';

import { WorkerDispatched } from '../workers/onWorkerDispatched.js';

interface Params extends WorkerDispatched<unknown> {
  call: string;
}

export async function dispatchWorkerToQueue({ workerId, call, payload, step }: Params): Promise<void> {
  await getFunctions()
    .taskQueue(call)
    .enqueue({
      payload,
      workerId,
      step
    } satisfies WorkerDispatched<unknown>);
}
