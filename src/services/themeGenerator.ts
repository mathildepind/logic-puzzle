import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { PUZZLE_THEMES, type PuzzleTheme } from '../data/puzzleThemes';
import { validateThemeContent } from '../utils/themeValidator';

const ThemeCategorySchema = z.object({
  name: z.string().describe('Category name (e.g. "People", "Jobs", "Cities")'),
  items: z.array(z.string()).describe('Exactly 8 unique items for this category'),
  singularVerb: z.string().describe('Verb for "Person X [verb] Item Y" (e.g. "works in", "ordered", "visited")'),
  pluralVerb: z.string().describe('Base form of verb for "does not [verb]" sentences (e.g. "work in", "order", "visit")')
});

const ThemeSchema = z.object({
  name: z.string().describe('A short, catchy name for the puzzle theme'),
  description: z.string().describe('A one-sentence description shown to the player'),
  categories: z.array(ThemeCategorySchema).describe('Exactly 3 interconnected categories with 8 items each')
});

const MAX_RETRIES = 2;

const SYSTEM_PROMPT = `You are a logic grid puzzle designer.
Generate creative, family-friendly puzzle themes with exactly 3 categories and 8 unique items per category.
No item may appear in more than one category. Keep items short (under 20 characters) and distinct.
The singularVerb should work in the sentence "[Subject] [singularVerb] [Item]" (e.g. "Alice ordered Steak").
The pluralVerb must be the BASE form for "does not [pluralVerb]" sentences (e.g. "Alice does not order Steak").`;

export interface ThemeGenerationResult {
  theme: PuzzleTheme;
  fromAI: boolean;
}

export async function generateThemeFromPrompt(userPrompt: string): Promise<ThemeGenerationResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  if (!apiKey) {
    console.warn('VITE_ANTHROPIC_API_KEY is not set — using a random built-in theme');
    return { theme: getRandomFallbackTheme(), fromAI: false };
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.parse({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Create a logic grid puzzle theme based on this idea: "${userPrompt}"`
          }
        ],
        output_config: {
          format: zodOutputFormat(ThemeSchema, 'puzzle_theme')
        }
      });

      const theme = response.parsed_output as PuzzleTheme;
      const validation = validateThemeContent(theme);

      if (!validation.ok) {
        console.warn(`Theme attempt ${attempt + 1} failed content validation:`, validation.errors);
        continue;
      }

      return { theme, fromAI: true };
    } catch (error) {
      console.warn(`Theme generation attempt ${attempt + 1} failed:`, error);
    }
  }

  console.warn('AI theme generation failed after all retries — using a random built-in theme');
  return { theme: getRandomFallbackTheme(), fromAI: false };
}

function getRandomFallbackTheme(): PuzzleTheme {
  return PUZZLE_THEMES[Math.floor(Math.random() * PUZZLE_THEMES.length)];
}
