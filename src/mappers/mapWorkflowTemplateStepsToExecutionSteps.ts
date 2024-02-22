import { WorkflowExecutionStep } from '../interfaces/WorkflowExecutionStep.js';
import { WorkflowTemplateStep } from '../interfaces/WorkflowTemplateStep.js';

export function mapWorkflowTemplateStepsToExecutionSteps(steps: WorkflowTemplateStep[]): WorkflowExecutionStep[] {
  return steps.map(({ step, name, nextStep, parallelSteps, call }) => {
    return {
      step,
      name,
      nextStep,
      parallelSteps,
      call,
      completedAt: null,
      trace: [],
      startedAt: null,
      status: 'idle',
      logs: [],
      maxAttempts: 0,
      retryCount: 0
    } satisfies WorkflowExecutionStep;
  });
}
