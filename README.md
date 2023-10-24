[![🌞 CI](https://github.com/maxisam/repo-dispatch/actions/workflows/CI.yml/badge.svg)](https://github.com/maxisam/repo-dispatch/actions/workflows/CI.yml)

# Yet Another Repo Dispatch Github Action

There are lots of Github action to do repo dispatch, however, none of them (or I didn't look hard enough) handle the clientPayload the way I want.

So here it is. It allows you to compose your payload as yaml format (powered by [js-yaml](https://github.com/nodeca/js-yaml)) and take care the line break nicely.

## Features

- Compose clientPayload as yaml format
- Provide notice for triggered workflow

<img width="403" alt="image" src="https://github.com/maxisam/repo-dispatch/assets/456807/53e07171-e7c7-419d-826f-4eb8678ce282">

## Example

Check [Action tab](https://github.com/maxisam/repo-dispatch/actions/workflows/CI.yml) to see how it looks like in action.

```yml
# https://github.com/maxisam/repo-dispatch/blob/main/.github/workflows/CI.yml
- uses: maxisam/repo-dispatch@v1
  with:
    authToken: ${{secrets.GH_AUTH_TOKEN}}
    eventType: 'test-repo-dispatch'
    clientPayload: |
      message: |
        🚀 Works
        - test 1
        - test 2
      subject: 💥Title
```

```yml
# https://github.com/maxisam/repo-dispatch/blob/main/.github/workflows/repo-dispatch.yml

name: ci-test

on:
  workflow_dispatch:
  repository_dispatch:
    types: [test-repo-dispatch]

jobs:
  ci-test:
    name: ci test
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ github.event.client_payload.message }}"
```

## Action inputs

See https://github.com/maxisam/repo-dispatch/blob/main/action.yml

## Note

### Token

The default ${{ secrets.GITHUB_TOKEN }} doesn't work with repo-dispatch. You have to [create your own token](https://github.com/settings/tokens) with `repo` scope.

### Client payload

The GitHub API allows a maximum of 10 top-level properties in the `client-payload` JSON.
If you use more than that you will see an error message like the following.

```sh
No more than 10 properties are allowed; 14 were supplied.
```

Additionally, there is a limitation on the total data size of the `client-payload`. A very large payload may result in a `client_payload is too large` error.
