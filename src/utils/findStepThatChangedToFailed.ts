import { WorkflowExecutionStep } from '../interfaces/WorkflowExecutionStep.js';

export function findStepThatChangedToFailed(
  previousSteps: WorkflowExecutionStep[],
  currentSteps: WorkflowExecutionStep[]
): WorkflowExecutionStep | null {
  const previousStepsMap = new Map(previousSteps.map(step => [step.step, step]));

  for (const currentStep of currentSteps) {
    if (currentStep.status !== 'failed') {
      continue;
    }

    const previousStep = previousStepsMap.get(currentStep.step);
    if (previousStep && previousStep.status === 'running') {
      return currentStep;
    }
  }

  return null;
}
