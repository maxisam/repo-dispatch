import * as core from '@actions/core';
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
