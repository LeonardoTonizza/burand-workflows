import { WorkflowExecutionStatus } from '../types/WorkflowExecutionStatus.js';
import { WorkflowExecutionStepLog } from './WorkflowExecutionStepLog.js';
export interface WorkflowExecutionStep {
    call: string;
    completedAt: Date | null;
    logs: WorkflowExecutionStepLog[];
    maxAttempts: number;
    name: string;
    nextStep: string | null;
    parallelSteps: string[];
    retryCount: number;
    startedAt: Date | null;
    status: WorkflowExecutionStatus;
    step: string;
    trace: string[];
}
