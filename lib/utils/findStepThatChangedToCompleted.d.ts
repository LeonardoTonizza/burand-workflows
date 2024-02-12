import { WorkflowExecutionStep } from '../interfaces/WorkflowExecutionStep.js';
export declare function findStepThatChangedToCompleted(previousSteps: WorkflowExecutionStep[], currentSteps: WorkflowExecutionStep[]): WorkflowExecutionStep | null;
