import * as core from '@actions/core';
import {inspect} from 'util';
import {getInputs, getOctokit, getOwnerRepo} from './common';
import {createDispatchEventRequest, DispatchEventRequest} from './create-dispatch';

async function run(): Promise<void> {
  const inputs = getInputs();
  const [owner, repo] = getOwnerRepo(inputs.owner, inputs.repository);
  const octokit = getOctokit(inputs.authToken, 'github-action-repo-dispatch');
  let request: DispatchEventRequest;

  try {
    request = createDispatchEventRequest(owner, repo, inputs.eventType, inputs.clientPayload);
    core.debug(`dispatch event request: ${inspect(request)}`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating status request object: ${error.message}`);
    }
    return;
  }

  if (octokit === null) {
    core.setFailed('Error creating octokit:\noctokit was null');
  } else {
    try {
      await octokit.rest.repos.createDispatchEvent(request);
    } catch (error) {
      core.debug(inspect(error));
      if (error instanceof Error) {
        core.setFailed(`Error setting status:\n${error.message}\nRequest object:\n${JSON.stringify(request, null, 2)}`);
      }
    }
  }
}

run();
