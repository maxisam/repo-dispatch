import * as core from '@actions/core';
import {Octokit} from '@octokit/rest';
import {inspect} from 'util';
import {getGithubClient, getInputs, getOwnerRepo} from './common';
import {IInputs} from './modals';
import {parseClientPayload} from './utils';

async function dispatch(repo: string, inputs: IInputs, githubClient: InstanceType<typeof Octokit>): Promise<void> {
  const request = {
    owner: inputs.owner,
    repo,
    event_type: inputs.eventType,
    client_payload: parseClientPayload(inputs.clientPayload)
  };
  core.debug(`dispatch event request: ${inspect(request)}`);
  core.notice(`Dispatching event: ${inputs.eventType}`, {title: '🚀Dispatching event'});
  await githubClient.rest.repos.createDispatchEvent(request);
}

async function showNotice(githubClient: InstanceType<typeof Octokit>, repo: string, inputs: IInputs): Promise<void> {
  for (let i = 0; i < inputs.trackTriggertedWorkflowMaxRetries; i++) {
    await new Promise(resolve => setTimeout(resolve, inputs.trackTriggertedWorkflowRetryInterval * 1000));
    const response = await githubClient.rest.actions.listWorkflowRuns({
      owner: inputs.owner,
      repo,
      workflow_id: inputs.targetWorkflowId,
      per_page: inputs.trackTriggertedWorkflowPageSize
    });
    const workflow = response.data.workflow_runs.find(
      w => w.event === 'repository_dispatch' && w.display_title.includes(inputs.triggeredWorkflowTitleKeyword)
    );
    if (workflow) {
      core.info(`Workflow: ${workflow.html_url}`);
      core.notice(`${workflow.html_url}`, {title: `💥Triggered Workflow: ${workflow.display_title}`});
      break;
    }
  }
}

async function run(): Promise<void> {
  const inputs = getInputs();
  const [, repo] = getOwnerRepo(inputs.owner, inputs.repository);
  const githubClient = getGithubClient(inputs.authToken, 'github-action-repo-dispatch');

  try {
    await dispatch(repo, inputs, githubClient);
    if (inputs.triggeredWorkflowTitleKeyword && inputs.targetWorkflowId) {
      await showNotice(githubClient, repo, inputs);
    }
  } catch (error) {
    core.debug(inspect(error));
    if (error instanceof Error) {
      core.setFailed(`Error setting status:\n${error.message}`);
    }
  }
}

run();
