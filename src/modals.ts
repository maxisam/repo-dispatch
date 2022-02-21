export enum INPUTS {
  authToken = 'authToken',
  owner = 'owner',
  repository = 'repository',
  //   description = 'description',
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
