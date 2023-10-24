import * as core from '@actions/core';
import * as jsYaml from 'js-yaml';
export interface IClinetPayload {
  [key: string]: unknown;
}

export function parseClientPayload(clientPayloadString: string): IClinetPayload {
  try {
    const clientPayload = jsYaml.load(clientPayloadString, {json: true}) as IClinetPayload;
    return clientPayload;
  } catch (error) {
    if (error instanceof jsYaml.YAMLException) {
      core.setFailed(`Error parsing client payload:\n${error.message}`);
    }
    throw error;
  }
}

export function getNumberInput(input: string): number {
  const value = core.getInput(input);
  const numberValue = parseInt(value);
  if (isNaN(numberValue)) {
    core.setFailed(`Input ${input} is not a number`);
    throw new Error(`Input ${input} is not a number`);
  }
  return numberValue;
}
