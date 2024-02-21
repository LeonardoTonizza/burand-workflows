import { mapWorkflowTemplateStepsToExecutionSteps } from './mapWorkflowTemplateStepsToExecutionSteps.js';
export function mapWorkflowTemplateToExecution(template, version) {
    const steps = mapWorkflowTemplateStepsToExecutionSteps(version.steps);
    return {
        completedAt: null,
        payload: null,
        startedAt: null,
        status: 'idle',
        steps,
        templateId: template.id,
        userId: null,
        version: template.activeVersion
    };
}
