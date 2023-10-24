export enum INPUTS {
  authToken = 'authToken',
  owner = 'owner',
  repository = 'repository',
  eventType = 'eventType',
  clientPayload = 'clientPayload',
  targetWorkflowId = 'targetWorkflowId',
  triggeredWorkflowTitleKeyword = 'triggeredWorkflowTitleKeyword'
}

export interface IInputs {
  authToken: string;
  owner: string;
  repository: string;
  eventType: string;
  clientPayload: string;
  targetWorkflowId: string;
  triggeredWorkflowTitleKeyword: string;
}
