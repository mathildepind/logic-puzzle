import type { PuzzleTheme } from '../data/puzzleThemes';

const BLOCKED_TERMS = [
  'explicit', 'adult', 'nsfw', 'violent', 'weapon', 'drug',
  'racist', 'offensive', 'hate', 'illegal', 'porn'
];

const MAX_PROMPT_LENGTH = 200;
const MAX_ITEM_LENGTH = 25;
const MIN_ITEMS_PER_CATEGORY = 5;

export function validateUserPrompt(prompt: string): { ok: boolean; reason?: string } {
  const trimmed = prompt.trim();

  if (!trimmed) {
    return { ok: false, reason: 'Prompt cannot be empty' };
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return { ok: false, reason: `Prompt must be ${MAX_PROMPT_LENGTH} characters or less` };
  }

  if (!/^[\w\s\-',.()?!]+$/.test(trimmed)) {
    return { ok: false, reason: 'Prompt contains unsupported characters' };
  }

  const lower = trimmed.toLowerCase();
  for (const term of BLOCKED_TERMS) {
    if (lower.includes(term)) {
      return { ok: false, reason: 'Prompt contains inappropriate content' };
    }
  }

  return { ok: true };
}

export function validateThemeContent(theme: PuzzleTheme): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!theme.name?.trim()) {
    errors.push('Theme name cannot be empty');
  }

  if (!theme.description?.trim()) {
    errors.push('Theme description cannot be empty');
  }

  if (!theme.categories || theme.categories.length < 3) {
    errors.push(`Theme must have at least 3 categories, got ${theme.categories?.length ?? 0}`);
    return { ok: false, errors };
  }

  // Track all items across all categories to catch cross-category duplicates
  const seenItems = new Map<string, string>(); // normalised item -> category name

  for (const cat of theme.categories) {
    if (!cat.name?.trim()) {
      errors.push('A category has an empty name');
      continue;
    }

    if (!cat.singularVerb?.trim()) {
      errors.push(`Category "${cat.name}" is missing singularVerb`);
    }

    if (!cat.items || cat.items.length < MIN_ITEMS_PER_CATEGORY) {
      errors.push(
        `Category "${cat.name}" needs at least ${MIN_ITEMS_PER_CATEGORY} items, got ${cat.items?.length ?? 0}`
      );
      continue;
    }

    const withinCategory = new Set<string>();

    for (const item of cat.items) {
      if (!item?.trim()) {
        errors.push(`Category "${cat.name}" has an empty item`);
        continue;
      }

      if (item.length > MAX_ITEM_LENGTH) {
        errors.push(`Item "${item}" in "${cat.name}" exceeds ${MAX_ITEM_LENGTH} characters`);
      }

      const normalised = item.toLowerCase().trim();

      if (withinCategory.has(normalised)) {
        errors.push(`Category "${cat.name}" has a duplicate item "${item}"`);
      }
      withinCategory.add(normalised);

      if (seenItems.has(normalised)) {
        errors.push(
          `Item "${item}" appears in both "${seenItems.get(normalised)}" and "${cat.name}"`
        );
      } else {
        seenItems.set(normalised, cat.name);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
