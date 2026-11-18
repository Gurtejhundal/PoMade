export const PUSH_WORKFLOW = `name: PoMade presentation
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: write
concurrency:
  group: pomade-presentation
  cancel-in-progress: false
jobs:
  polish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main
      # Pin the action to a reviewed commit SHA for your repository.
      - uses: Gurtejhundal/Pomade@v1.0.0
        with:
          metadata-token: \${{ secrets.POMADE_TOKEN }}
`;
