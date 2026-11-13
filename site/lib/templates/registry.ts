import type { TemplateDefinition, ProjectFacts } from './types';
import { CharacterTemplate } from './character';
import { TerminalNoirTemplate } from './terminal-noir';
import { ProductShowcaseTemplate } from './product-showcase';
import { EditorialTemplate } from './editorial';
import { TechnicalPrecisionTemplate } from './technical-precision';
import { ResearchLabTemplate } from './research-lab';

export const TEMPLATES: TemplateDefinition[] = [
  CharacterTemplate,
  TerminalNoirTemplate,
  ProductShowcaseTemplate,
  EditorialTemplate,
  TechnicalPrecisionTemplate,
  ResearchLabTemplate,
];

export function getTemplate(id: string): TemplateDefinition {
  const found = TEMPLATES.find((t) => t.id === id);
  return found || CharacterTemplate;
}

export function renderTemplate(templateId: string, facts: ProjectFacts): string {
  const tpl = getTemplate(templateId);
  return tpl.render(facts);
}
