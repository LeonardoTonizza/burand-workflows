import { FirebaseAbstract } from '@burand/functions/firestore';
import { WorkflowTemplateVersion } from '../models/WorkflowTemplateVersion.js';
export declare class WorkflowTemplateVersionRepository extends FirebaseAbstract<WorkflowTemplateVersion> {
    constructor();
    getByVersion(templateId: string, version: string): Promise<WorkflowTemplateVersion>;
}
