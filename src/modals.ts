export enum INPUTS {
  authToken = 'authToken',
  owner = 'owner',
  repository = 'repository',
  eventType = 'eventType',
  clientPayload = 'clientPayload'
}

export interface IInputs {
  authToken: string;
  owner: string;
  repository: string;
  eventType: string;
  clientPayload: string;
}
