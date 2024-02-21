import { WorkflowExecutionStatus } from '../types/WorkflowExecutionStatus.js';
import { WorkflowExecutionStepLog } from './WorkflowExecutionStepLog.js';

export interface WorkflowExecutionStep {
  call: string;
  completedAt: Date | null;
  logs: WorkflowExecutionStepLog[];
  name: string;
  nextStep: string | null;
  parallelSteps: string[];
  startedAt: Date | null;
  status: WorkflowExecutionStatus;
  step: string;
  trace: string[];
}
