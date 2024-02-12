export interface WorkflowTemplateStep {
  description: string;
  name: string;
  step: string;
  nextStep: string | null;
  parallelSteps: string[];
  call: string;
}
