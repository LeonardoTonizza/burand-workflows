import { WorkflowExecutionStep } from '../interfaces/WorkflowExecutionStep.js';
export declare function findStepThatChangedToFailed(previousSteps: WorkflowExecutionStep[], currentSteps: WorkflowExecutionStep[]): WorkflowExecutionStep | null;
