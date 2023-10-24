// import * as process from 'process'
// import * as cp from 'child_process'
// import * as path from 'path'
import {expect, test} from '@jest/globals';
import {parseClientPayload} from '../src/utils';

const mockInputs = {
  owner: 'owner',
  repository: 'repository',
  eventType: 'eventType',
  clientPayload: `
  key1: value1
  key2: value2
  `
};

test('parse client payload', async () => {
  await expect(parseClientPayload(mockInputs.clientPayload)).toStrictEqual({
    key1: 'value1',
    key2: 'value2'
  });
});
