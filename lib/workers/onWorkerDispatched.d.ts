import { Request, TaskQueueFunction, TaskQueueOptions } from 'firebase-functions/v2/tasks';
export interface WorkerDispatched<T> {
    payload: T;
    workerId: string;
    step: string;
}
export declare function onWorkerDispatched<T>(options: TaskQueueOptions, handler: (request: Request<WorkerDispatched<T>>) => void | Promise<void>): TaskQueueFunction<WorkerDispatched<T>>;
