import {RequestParameters} from '@octokit/types';

export interface IClinetPayload {
  [key: string]: unknown;
}

export type DispatchEventRequest = RequestParameters &
  Omit<
    {
      owner: string;
      repo: string;
    } & {
      event_type: string;
      client_payload?:
        | {
            [key: string]: unknown;
          }
        | undefined;
    },
    'baseUrl' | 'headers' | 'mediaType'
  >;

export function createDispatchEventRequest(owner: string, repo: string, eventType: string, clientPayloadString: string): DispatchEventRequest {
  const clientPayload: IClinetPayload = JSON.parse(clientPayloadString);
  return {
    owner,
    repo,
    event_type: eventType,
    client_payload: clientPayload
  };
}
