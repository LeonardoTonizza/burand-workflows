export function mapWorkflowTemplateStepsToExecutionSteps(steps) {
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
        };
    });
}
