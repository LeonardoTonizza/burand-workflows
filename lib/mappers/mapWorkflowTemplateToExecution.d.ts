import { AddDocument } from '@burand/functions/typings';
import { WorkflowExecution } from '../models/WorkflowExecution.js';
import { WorkflowTemplate } from '../models/WorkflowTemplate.js';
import { WorkflowTemplateVersion } from '../models/WorkflowTemplateVersion.js';
export declare function mapWorkflowTemplateToExecution(template: WorkflowTemplate, version: WorkflowTemplateVersion): AddDocument<WorkflowExecution>;
