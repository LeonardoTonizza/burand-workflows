import { AddDocument } from '@burand/functions/typings';

import { WorkflowExecution } from '../models/WorkflowExecution.js';
import { WorkflowTemplate } from '../models/WorkflowTemplate.js';
import { WorkflowTemplateVersion } from '../models/WorkflowTemplateVersion.js';
import { mapWorkflowTemplateStepsToExecutionSteps } from './mapWorkflowTemplateStepsToExecutionSteps.js';

export function mapWorkflowTemplateToExecution(
  template: WorkflowTemplate,
  version: WorkflowTemplateVersion
): AddDocument<WorkflowExecution> {
  const steps = mapWorkflowTemplateStepsToExecutionSteps(version.steps);

  return {
    steps,
    payload: null,
    completedAt: null,
    startedAt: null,
    status: 'idle',
    version: template.activeVersion,
    templateId: template.id
  } satisfies AddDocument<WorkflowExecution>;
}
