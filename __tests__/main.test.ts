// import * as process from 'process'
// import * as cp from 'child_process'
// import * as path from 'path'
import {expect, test} from '@jest/globals';
import {createDispatchEventRequest, parseClientPayload} from '../src/create-dispatch';

const mockInputs = {
  owner: 'owner',
  repository: 'repository',
  eventType: 'eventType',
  clientPayload: `
  key1: value1
  key2: value2
  `
};

test('create dispatch request', async () => {
  await expect(createDispatchEventRequest(mockInputs.owner, mockInputs.repository, mockInputs.eventType, mockInputs.clientPayload)).toStrictEqual({
    owner: mockInputs.owner,
    repo: mockInputs.repository,
    event_type: mockInputs.eventType,
    client_payload: parseClientPayload(mockInputs.clientPayload)
  });
});
test('parse client payload', async () => {
  await expect(parseClientPayload(mockInputs.clientPayload)).toStrictEqual({
    key1: 'value1',
    key2: 'value2'
  });
});
// // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = '500'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })
