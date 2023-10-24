import * as core from '@actions/core';
import {Octokit} from '@octokit/rest';
import {inspect} from 'util';
import {IInputs, INPUTS} from './modals';
import {getNumberInput} from './utils';

export function getInputs(): IInputs {
  const inputs: IInputs = {
    authToken: core.getInput(INPUTS.authToken),
    owner: core.getInput(INPUTS.owner),
    repository: core.getInput(INPUTS.repository),
    eventType: core.getInput(INPUTS.eventType),
    clientPayload: core.getInput(INPUTS.clientPayload),
    targetWorkflowId: core.getInput(INPUTS.targetWorkflowId),
    triggeredWorkflowTitleKeyword: core.getInput(INPUTS.triggeredWorkflowTitleKeyword),
    trackTriggertedWorkflowMaxRetries: getNumberInput(INPUTS.trackTriggertedWorkflowMaxRetries),
    trackTriggertedWorkflowRetryInterval: getNumberInput(INPUTS.trackTriggertedWorkflowRetryInterval),
    trackTriggertedWorkflowPageSize: getNumberInput(INPUTS.trackTriggertedWorkflowPageSize)
  };
  core.debug(`Inputs: ${inspect(inputs)}`);
  return inputs;
}

export function getOwnerRepo(owner: string, repository: string): [string, string] {
  if (repository.startsWith(`${owner}/`)) {
    const [repoOwner, repo] = repository.split('/');
    return [repoOwner, repo];
  }
  return [owner, repository];
}

export function getGithubClient(authToken: string, userAgent = 'github-action'): Octokit {
  try {
    const octokit = new Octokit({
      auth: authToken,
      userAgent,
      baseUrl: 'https://api.github.com',
      log: {
        debug: () => {},
        info: () => {},
        warn: console.warn,
        error: console.error
      },
      request: {
        agent: undefined,
        fetch
      }
    });
    return octokit;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating octokit:\n${error.message}`);
    }
    throw error;
  }
}
