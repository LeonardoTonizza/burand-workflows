import { WorkerDispatched } from '../workers/onWorkerDispatched.js';
interface Params extends WorkerDispatched<unknown> {
    call: string;
}
export declare function dispatchWorkerToQueue({ workerId, call, payload, step }: Params): Promise<void>;
export {};
