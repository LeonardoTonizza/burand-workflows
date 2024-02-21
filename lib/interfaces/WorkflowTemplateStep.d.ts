export interface WorkflowTemplateStep {
    call: string;
    description: string;
    name: string;
    nextStep: string | null;
    parallelSteps: string[];
    step: string;
}
