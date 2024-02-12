import { WorkflowExecutionStep } from '../interfaces/WorkflowExecutionStep.js';
import { WorkflowExecution } from '../models/WorkflowExecution.js';
export declare function dispatchWorkersToQueue({ id, payload, steps }: WorkflowExecution, step: WorkflowExecutionStep): Promise<void>;
