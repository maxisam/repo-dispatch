import * as core from '@actions/core';
import {RequestParameters} from '@octokit/types';
import * as jsYaml from 'js-yaml';
export interface IClinetPayload {
  [key: string]: unknown;
}

export function parseClientPayload(clientPayloadString: string): IClinetPayload {
  let clientPayload: IClinetPayload = {};
  try {
    clientPayload = jsYaml.load(clientPayloadString, {json: true}) as IClinetPayload;
  } catch (error) {
    if (error instanceof jsYaml.YAMLException) {
      core.setFailed(`Error parsing client payload:\n${error.message}`);
    }
  }
  return clientPayload;
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
  return {
    owner,
    repo,
    event_type: eventType,
    client_payload: parseClientPayload(clientPayloadString)
  };
}
