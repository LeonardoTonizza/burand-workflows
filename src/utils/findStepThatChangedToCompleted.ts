import { WorkflowExecutionStep } from '../interfaces/WorkflowExecutionStep.js';

export function findStepThatChangedToCompleted(
  previousSteps: WorkflowExecutionStep[],
  currentSteps: WorkflowExecutionStep[]
): WorkflowExecutionStep | null {
  const previousStepsMap = new Map(previousSteps.map(step => [step.step, step]));

  for (const currentStep of currentSteps) {
    if (currentStep.status !== 'completed') {
      continue;
    }

    const previousStep = previousStepsMap.get(currentStep.step);
    if (previousStep && previousStep.status === 'running') {
      return currentStep;
    }
  }

  return null;
}
