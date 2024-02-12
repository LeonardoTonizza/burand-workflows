import { WorkflowExecutionRepository } from '../repositories/WorkflowExecutionRepository.js';
import { WorkflowTemplateRepository } from '../repositories/WorkflowTemplateRepository.js';
import { WorkflowTemplateVersionRepository } from '../repositories/WorkflowTemplateVersionRepository.js';
export declare class WorkflowExecutionService {
    private workflowTemplateRepository;
    private workflowTemplateVersionRepository;
    private workflowExecutionRepository;
    constructor(workflowTemplateRepository: WorkflowTemplateRepository, workflowTemplateVersionRepository: WorkflowTemplateVersionRepository, workflowExecutionRepository: WorkflowExecutionRepository);
    create(templateWorkflowId: string, payload: unknown): Promise<string>;
    clone(workflowExecutionId: string): Promise<string>;
    retry(workflowExecutionId: string): Promise<void>;
    generateGoogleLoggingURL(projectId: string, workflowExecutionId: string): Promise<string>;
}
