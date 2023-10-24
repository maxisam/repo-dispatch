import * as core from '@actions/core';
import {Octokit} from '@octokit/rest';
import {inspect} from 'util';
import {getInputs, getOctokit, getOwnerRepo} from './common';
import {IInputs} from './modals';
import {parseClientPayload} from './utils';

async function showNotice(githubClient: InstanceType<typeof Octokit>, repo: string, inputs: IInputs): Promise<void> {
  for (let i = 0; i <= 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await githubClient.rest.actions.listWorkflowRuns({
      owner: inputs.owner,
      repo,
      workflow_id: inputs.targetWorkflowId,
      per_page: 5
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
  const [owner, repo] = getOwnerRepo(inputs.owner, inputs.repository);
  const githubClient = getOctokit(inputs.authToken, 'github-action-repo-dispatch');

  try {
    const request = {
      owner,
      repo,
      event_type: inputs.eventType,
      client_payload: parseClientPayload(inputs.clientPayload)
    };
    core.debug(`dispatch event request: ${inspect(request)}`);
    core.notice(`Dispatching event: ${inputs.eventType}`, {title: '🚀Dispatching event'});
    await githubClient.rest.repos.createDispatchEvent(request);
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
