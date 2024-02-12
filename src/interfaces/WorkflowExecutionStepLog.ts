import { WorkflowExecutionStatus } from '../types/WorkflowExecutionStatus.js';

export interface WorkflowExecutionStepLog {
  status: WorkflowExecutionStatus;
  createdAt: Date;
}
