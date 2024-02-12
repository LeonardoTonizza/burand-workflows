import { Model } from '@burand/functions/firestore';

import { WorkflowTemplateStep } from '../interfaces/WorkflowTemplateStep.js';

export interface WorkflowTemplateVersion extends Model {
  steps: WorkflowTemplateStep[];
  version: string;
  templateId: string;
}
