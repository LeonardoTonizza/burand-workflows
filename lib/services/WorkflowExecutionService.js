var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { singleton } from 'tsyringe';
import { mapWorkflowTemplateToExecution } from '../mappers/mapWorkflowTemplateToExecution.js';
import { WorkflowExecutionRepository } from '../repositories/WorkflowExecutionRepository.js';
import { WorkflowTemplateRepository } from '../repositories/WorkflowTemplateRepository.js';
import { WorkflowTemplateVersionRepository } from '../repositories/WorkflowTemplateVersionRepository.js';
import { dispatchWorkerToQueue } from '../utils/dispatchWorkerToQueue.js';
import { generateGoogleLoggingURL } from '../utils/generateGoogleLoggingURL.js';
let WorkflowExecutionService = class WorkflowExecutionService {
    workflowTemplateRepository;
    workflowTemplateVersionRepository;
    workflowExecutionRepository;
    constructor(workflowTemplateRepository, workflowTemplateVersionRepository, workflowExecutionRepository) {
        this.workflowTemplateRepository = workflowTemplateRepository;
        this.workflowTemplateVersionRepository = workflowTemplateVersionRepository;
        this.workflowExecutionRepository = workflowExecutionRepository;
    }
    async create({ payload, templateId, userId }) {
        const template = await this.workflowTemplateRepository.getById(templateId);
        const templateVersion = await this.workflowTemplateVersionRepository.getByVersion(templateId, template.activeVersion);
        const execution = mapWorkflowTemplateToExecution(template, templateVersion);
        const id = await this.workflowExecutionRepository.add({
            ...execution,
            payload,
            userId
        });
        return id;
    }
    async clone(workflowExecutionId) {
        const { templateId, payload } = await this.workflowExecutionRepository.getById(workflowExecutionId);
        const template = await this.workflowTemplateRepository.getById(templateId);
        const templateVersion = await this.workflowTemplateVersionRepository.getByVersion(templateId, template.activeVersion);
        const execution = mapWorkflowTemplateToExecution(template, templateVersion);
        const id = await this.workflowExecutionRepository.add({
            ...execution,
            payload
        });
        return id;
    }
    async retry(workflowExecutionId) {
        const workflow = await this.workflowExecutionRepository.getById(workflowExecutionId);
        const stepsFailed = workflow.steps.filter(step => step.status === 'failed');
        if (stepsFailed.length) {
            await this.workflowExecutionRepository.update({
                id: workflowExecutionId,
                status: 'running'
            });
            const promises = [];
            for (const step of stepsFailed) {
                promises.push(dispatchWorkerToQueue({
                    payload: workflow.payload,
                    step: step.step,
                    workerId: workflow.id,
                    call: step.call
                }));
            }
            await Promise.all(promises);
        }
    }
    async generateGoogleLoggingURL(projectId, workflowExecutionId) {
        const worker = await this.workflowExecutionRepository.getById(workflowExecutionId);
        const link = generateGoogleLoggingURL(projectId, worker.steps.flatMap(s => s.trace));
        return link;
    }
};
WorkflowExecutionService = __decorate([
    singleton(),
    __metadata("design:paramtypes", [WorkflowTemplateRepository,
        WorkflowTemplateVersionRepository,
        WorkflowExecutionRepository])
], WorkflowExecutionService);
export { WorkflowExecutionService };
