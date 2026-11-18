import { z } from 'zod';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';
import { safeMediaUrl } from './templates.js';

const media = z
  .string()
  .refine(
    (v) =>
      Boolean(safeMediaUrl(v)) &&
      !v.startsWith('https:') &&
      /\.(png|jpe?g|webp|gif|svg)$/i.test(v),
    'Use a relative path to an existing repository asset'
  );
export const PresentationConfigSchema = z
  .object({
    preset: z.enum(['minimal', 'signature', 'animated']).default('signature'),
    name: z.string().trim().min(1).max(80).optional(),
    tagline: z.string().trim().min(1).max(160).optional(),
    description: z.string().trim().min(1).max(350).optional(),
    topics: z
      .array(z.string().regex(/^[a-z0-9][a-z0-9-]{0,49}$/))
      .max(20)
      .optional(),
    homepage: z
      .string()
      .url()
      .refine(
        (v) => Boolean(safeMediaUrl(v)) && v.startsWith('https://'),
        'Use an HTTPS homepage'
      )
      .optional(),
    installCommand: z.string().max(4000).optional(),
    runCommand: z.string().max(4000).optional(),
    testCommand: z.string().max(4000).optional(),
    features: z
      .array(
        z.object({
          title: z.string().min(1).max(100),
          description: z.string().min(1).max(500),
        })
      )
      .max(12)
      .optional(),
    screenshot: media.optional(),
    demo: media.optional(),
    demoPoster: media.optional(),
    logo: media.optional(),
  })
  .strict();
export type PresentationConfig = z.infer<typeof PresentationConfigSchema>;

export async function readPresentationConfig(
  fs: SafeFileSystem
): Promise<PresentationConfig | undefined> {
  if (!(await fs.fileExists('.pomade.json'))) return undefined;
  const config = PresentationConfigSchema.parse(
    JSON.parse(await fs.readFile('.pomade.json'))
  );
  for (const asset of [
    config.screenshot,
    config.demo,
    config.demoPoster,
    config.logo,
  ].filter((v): v is string => Boolean(v))) {
    if (!(await fs.fileExists(asset)))
      throw new Error(`Configured media asset does not exist: ${asset}`);
    await fs.assertRealPathWithinRoot(asset);
  }
  return config;
}
