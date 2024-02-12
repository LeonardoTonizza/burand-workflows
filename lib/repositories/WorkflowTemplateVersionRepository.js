var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DocumentNotFoundError } from '@burand/functions/exceptions';
import { FirebaseAbstract } from '@burand/functions/firestore';
import { singleton } from 'tsyringe';
import { FirestoreCollecionName } from '../config/FirestoreCollecionName.js';
let WorkflowTemplateVersionRepository = class WorkflowTemplateVersionRepository extends FirebaseAbstract {
    constructor() {
        super(FirestoreCollecionName.WORKFLOW_TEMPLATE_VERSIONS);
    }
    async getByVersion(templateId, version) {
        const find = await this.getOneWhereMany([
            ['templateId', '==', templateId],
            ['version', '==', version]
        ]);
        if (!find) {
            throw new DocumentNotFoundError();
        }
        return find;
    }
};
WorkflowTemplateVersionRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], WorkflowTemplateVersionRepository);
export { WorkflowTemplateVersionRepository };
