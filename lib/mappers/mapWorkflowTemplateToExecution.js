import { mapWorkflowTemplateStepsToExecutionSteps } from './mapWorkflowTemplateStepsToExecutionSteps.js';
export function mapWorkflowTemplateToExecution(template, version) {
    const steps = mapWorkflowTemplateStepsToExecutionSteps(version.steps);
    return {
        steps,
        payload: null,
        completedAt: null,
        startedAt: null,
        status: 'idle',
        version: template.activeVersion,
        templateId: template.id
    };
}
