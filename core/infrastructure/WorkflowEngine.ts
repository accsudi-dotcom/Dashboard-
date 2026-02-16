/**
 * Workflow Engine
 * Orchestrates complex business processes with steps, conditions, retries, and delays
 */
export type TriggerType = 'event' | 'manual' | 'scheduled'

export interface WorkflowStep {
  id: string
  name: string
  type: 'action' | 'condition' | 'delay'
  action?: string
  condition?: (context: any) => boolean
  delayMs?: number
  retryPolicy?: {
    maxAttempts: number
    backoffMs: number
  }
  onSuccess?: string // next step ID
  onFailure?: string // next step ID
}

export interface Workflow {
  id: string
  name: string
  enabled: boolean
  triggers: TriggerType[]
  steps: WorkflowStep[]
  startStepId: string
  description?: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'success' | 'failure' | 'paused'
  startTime: Date
  endTime?: Date
  currentStepId: string
  executedSteps: string[]
  context: Record<string, any>
  error?: string
}

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map()
  private executions: Map<string, WorkflowExecution> = new Map()
  private handlers: Map<string, (context: any) => Promise<void>> = new Map()

  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow)
  }

  registerHandler(actionName: string, handler: (context: any) => Promise<void>): void {
    this.handlers.set(actionName, handler)
  }

  async execute(workflowId: string, context: Record<string, any> = {}): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`)
    }

    if (!workflow.enabled) {
      throw new Error(`Workflow is disabled: ${workflowId}`)
    }

    const execution: WorkflowExecution = {
      id: this.generateId(),
      workflowId,
      status: 'running',
      startTime: new Date(),
      currentStepId: workflow.startStepId,
      executedSteps: [],
      context,
    }

    this.executions.set(execution.id, execution)

    try {
      await this.executeStep(workflow, execution, workflow.startStepId)
      execution.status = 'success'
    } catch (error) {
      execution.status = 'failure'
      execution.error = error instanceof Error ? error.message : String(error)
    }

    execution.endTime = new Date()
    return execution
  }

  private async executeStep(
    workflow: Workflow,
    execution: WorkflowExecution,
    stepId: string
  ): Promise<void> {
    const step = workflow.steps.find((s) => s.id === stepId)
    if (!step) {
      throw new Error(`Step not found: ${stepId}`)
    }

    execution.currentStepId = stepId
    execution.executedSteps.push(stepId)

    try {
      // Execute the step based on type
      if (step.type === 'action') {
        await this.executeAction(step, execution)
      } else if (step.type === 'condition') {
        const conditionMet = step.condition?.(execution.context) ?? false
        if (!conditionMet && step.onFailure) {
          return this.executeStep(workflow, execution, step.onFailure)
        }
      } else if (step.type === 'delay') {
        await new Promise((resolve) => setTimeout(resolve, step.delayMs || 0))
      }

      // Move to next step
      if (step.onSuccess) {
        await this.executeStep(workflow, execution, step.onSuccess)
      }
    } catch (error) {
      // Handle failure
      if (step.retryPolicy && step.retryPolicy.maxAttempts > 1) {
        // Retry logic
        await new Promise((resolve) => setTimeout(resolve, step.retryPolicy!.backoffMs))
        return this.executeStep(workflow, execution, stepId)
      }

      if (step.onFailure) {
        await this.executeStep(workflow, execution, step.onFailure)
      } else {
        throw error
      }
    }
  }

  private async executeAction(step: WorkflowStep, execution: WorkflowExecution): Promise<void> {
    if (!step.action) {
      throw new Error(`Action not specified for step: ${step.id}`)
    }

    const handler = this.handlers.get(step.action)
    if (!handler) {
      throw new Error(`Handler not registered for action: ${step.action}`)
    }

    await handler(execution.context)
  }

  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId)
  }

  getExecutionsByWorkflow(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values()).filter((e) => e.workflowId === workflowId)
  }

  private generateId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}

export const workflowEngine = new WorkflowEngine()
