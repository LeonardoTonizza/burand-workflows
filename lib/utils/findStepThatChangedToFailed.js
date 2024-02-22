export function findStepThatChangedToFailed(previousSteps, currentSteps) {
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
