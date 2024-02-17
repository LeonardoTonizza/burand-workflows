export function mapWorkflowTemplateStepsToExecutionSteps(steps) {
    return steps.map(({ step, name, nextStep, parallelSteps, call }) => {
        return {
            step,
            name,
            nextStep,
            parallelSteps,
            call,
            completedAt: null,
            executionId: null,
            trace: [],
            startedAt: null,
            status: 'idle',
            logs: []
        };
    });
}
