import { WorkflowExecutionStatus } from '../types/WorkflowExecutionStatus.js';
import { WorkflowExecutionStepLog } from './WorkflowExecutionStepLog.js';

export interface WorkflowExecutionStep {
  completedAt: Date | null;
  executionId: string | null;
  trace: string | null;
  logs: WorkflowExecutionStepLog[];
  name: string;
  nextStep: string | null;
  parallelSteps: string[];
  startedAt: Date | null;
  status: WorkflowExecutionStatus;
  step: string;
  call: string;
}
