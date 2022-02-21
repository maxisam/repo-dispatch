import * as core from '@actions/core';
import {Octokit} from '@octokit/rest';
import {inspect} from 'util';
import {IInputs, INPUTS} from './modals';

export function getInputs(): IInputs {
  const inputs: IInputs = {
    authToken: core.getInput(INPUTS.authToken),
    owner: core.getInput(INPUTS.owner),
    repository: core.getInput(INPUTS.repository),
    eventType: core.getInput(INPUTS.eventType),
    clientPayload: core.getInput(INPUTS.clientPayload)
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

export function getOctokit(authToken: string, userAgent: string = 'github-action'): Octokit | null {
  let octokit: Octokit | null = null;

  try {
    octokit = new Octokit({
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
        fetch: undefined,
        timeout: 0
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating octokit:\n${error.message}`);
    }
  }
  return octokit;
}
