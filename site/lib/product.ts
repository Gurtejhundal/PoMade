export const VERSION = '1.0.1';
export const REPOSITORY = 'https://github.com/Gurtejhundal/Pomade';
export const RELEASE = `${REPOSITORY}/releases/tag/v${VERSION}`;
export const INSTALL_COMMAND = `npm install -g ${REPOSITORY}/releases/download/v${VERSION}/pomade-${VERSION}.tgz`;
export const FEATURES = [
  {
    id: 'inspect',
    title: 'Start with the actual project',
    text: 'The presentation agent reads the project, relevant implementation, existing media, and release history. It suggests three factual About pitches, asks for your pitch and style, and derives topics from the project.',
    command: 'pomade scan\npomade audit',
    detail:
      'Read-only inspection. A score describes presentation checks; it does not certify product quality.',
  },
  {
    id: 'readme',
    title: 'One project. Three first impressions.',
    text: 'Simple gets to the command. Signature gives your project an identity. Motion adds an animated cover and real demo media. The CLI and Studio share one renderer.',
    command: 'pomade diff --preset signature',
    detail:
      'An installed dependency is not treated as proof of a feature. Review your product claims.',
  },
  {
    id: 'review',
    title: 'See the change before it lands',
    text: 'Save a plan, review the unified diff, then apply that exact artifact. Target hashes catch stale files; malformed markers stop the update.',
    command:
      'pomade plan --output /tmp/pomade-plan.json\npomade apply --plan /tmp/pomade-plan.json --approved',
    detail:
      'Text outside managed sections is preserved. Back up and review the first adoption of an existing README.',
  },
  {
    id: 'media',
    title: 'Show something real',
    text: 'Plan screenshots and recordings, organize existing media, or generate an SVG architecture diagram and social card. Motion includes a static cover alternative.',
    command:
      'pomade media plan\npomade media generate-diagram\npomade media generate-card',
    detail:
      'Capture planning does not run your app or record a demo automatically. Screenshots and GIFs must come from your product.',
  },
  {
    id: 'hooks',
    title: 'Remember before. Maintain after.',
    text: 'Bundled agent hooks add presentation context at session start and before a shell git push. An optional Git hook checks generated files before a push. A GitHub Action maintains them afterward.',
    command: 'pomade hooks install --approved\npomade hooks check',
    detail:
      'Local Git hooks are opt-in per clone. Existing hooks and custom hook managers are preserved.',
  },
  {
    id: 'github',
    title: 'Finish the front door',
    text: 'Keep About, homepage, and topics aligned with your project. Generate missing community files, inspect documentation drift, and draft a release plan.',
    command: 'pomade github plan\npomade drift\npomade release plan',
    detail:
      'Remote metadata needs a scoped token. Community initialization preserves existing files. Release planning does not publish a release.',
  },
];
