export function mapWorkflowTemplateStepsToExecutionSteps(steps) {
    return steps.map(({ step, name, next, parallel, call }) => {
        return {
            step,
            name,
            next,
            parallel,
            call,
            completedAt: null,
            trace: [],
            startedAt: null,
            status: 'idle',
            logs: [],
            maxAttempts: 0,
            retries: 0
        };
    });
}
