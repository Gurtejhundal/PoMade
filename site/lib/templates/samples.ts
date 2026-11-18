import type { PresentationFacts } from '../../../src/core/content/templates';
export const POMADE_SAMPLE: PresentationFacts = {
  name: 'PoMade',
  tagline: 'Code pushed. First impression handled.',
  description:
    'Your agent writes the code. PoMade handles the README, media, About, and topics. Every push looks finished.',
  repositoryUrl: 'https://github.com/Gurtejhundal/PoMade',
  installCommand:
    'git clone https://github.com/Gurtejhundal/PoMade.git\ncd PoMade\nnpm ci\nnpm run build\nnpm link',
  runCommand:
    'pomade init --preset signature --approved\npomade diff\npomade apply --approved',
  testCommand: 'npm test',
  license: 'MIT',
  licensePath: 'LICENSE',
  version: '1.0.0',
  workflowPath: '.github/workflows/ci.yml',
  logoUrl: 'docs/media/pomade-mascot.png',
  screenshotUrl: 'docs/media/site-preview.png',
  demoGifUrl: 'docs/media/cli-demo.gif',
  demoPosterUrl: 'docs/media/cli-demo-static.png',
  features: [
    {
      title: 'Three styles, one engine',
      description:
        'Simple, Signature, and Motion use the same renderer in the CLI and Studio.',
    },
    {
      title: 'Polish after a push',
      description:
        'Refresh managed README sections and covers with a GitHub Action.',
    },
    {
      title: 'The whole front door',
      description:
        'Sync About and topics with an administration-scoped token. Include real screenshots and recordings.',
    },
  ],
  bannerUrl: 'docs/media/pomade-motion.svg',
  staticBannerUrl: 'docs/media/pomade-static.svg',
};
