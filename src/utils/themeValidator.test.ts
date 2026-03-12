import { describe, it, expect } from 'vitest';
import { validateUserPrompt, validateThemeContent } from './themeValidator';
import type { PuzzleTheme } from '../data/puzzleThemes';

function makeTheme(overrides: Partial<PuzzleTheme> = {}): PuzzleTheme {
  return {
    name: 'Test Theme',
    description: 'A test theme description.',
    categories: [
      {
        name: 'People',
        items: ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry'],
        singularVerb: 'is',
        pluralVerb: 'are'
      },
      {
        name: 'Jobs',
        items: ['Doctor', 'Teacher', 'Engineer', 'Chef', 'Pilot', 'Nurse', 'Artist', 'Lawyer'],
        singularVerb: 'works as',
        pluralVerb: 'work as'
      },
      {
        name: 'Cities',
        items: ['Paris', 'Tokyo', 'London', 'Rome', 'Sydney', 'Dubai', 'Oslo', 'Lima'],
        singularVerb: 'visited',
        pluralVerb: 'visit'
      }
    ],
    ...overrides
  };
}

describe('validateUserPrompt', () => {
  it('accepts valid prompts', () => {
    expect(validateUserPrompt('A theme about space exploration').ok).toBe(true);
    expect(validateUserPrompt('Coffee shop regulars').ok).toBe(true);
    expect(validateUserPrompt("Scientists and their discoveries").ok).toBe(true);
    expect(validateUserPrompt('Jungle animals, habitats, and diets').ok).toBe(true);
  });

  it('rejects empty prompts', () => {
    const result = validateUserPrompt('');
    expect(result.ok).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('rejects whitespace-only prompts', () => {
    expect(validateUserPrompt('   ').ok).toBe(false);
  });

  it('rejects prompts over 200 characters', () => {
    const result = validateUserPrompt('a'.repeat(201));
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('200');
  });

  it('accepts prompts of exactly 200 characters', () => {
    expect(validateUserPrompt('a'.repeat(200)).ok).toBe(true);
  });

  it('rejects prompts with unsupported characters', () => {
    expect(validateUserPrompt('Theme <script>alert("xss")</script>').ok).toBe(false);
    expect(validateUserPrompt('Theme & more').ok).toBe(false);
    expect(validateUserPrompt('Theme @user').ok).toBe(false);
  });

  it('rejects prompts with blocked terms', () => {
    const result = validateUserPrompt('a violent theme');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('inappropriate');
  });
});

describe('validateThemeContent', () => {
  it('accepts a valid theme', () => {
    const result = validateThemeContent(makeTheme());
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects an empty theme name', () => {
    const result = validateThemeContent(makeTheme({ name: '' }));
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('name'))).toBe(true);
  });

  it('rejects an empty theme description', () => {
    const result = validateThemeContent(makeTheme({ description: '' }));
    expect(result.ok).toBe(false);
  });

  it('rejects fewer than 3 categories', () => {
    const theme = makeTheme({ categories: [makeTheme().categories[0]] });
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('3 categories'))).toBe(true);
  });

  it('rejects a category with too few items', () => {
    const theme = makeTheme();
    theme.categories[0].items = ['Alice', 'Bob', 'Carol'];
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('People'))).toBe(true);
  });

  it('rejects duplicate items within a category', () => {
    const theme = makeTheme();
    theme.categories[0].items = ['Alice', 'Bob', 'Alice', 'David', 'Emma', 'Frank', 'Grace', 'Henry'];
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('duplicate'))).toBe(true);
  });

  it('rejects items that appear in multiple categories', () => {
    const theme = makeTheme();
    // Put 'Alice' from People also in Jobs
    theme.categories[1].items = ['Alice', 'Teacher', 'Engineer', 'Chef', 'Pilot', 'Nurse', 'Artist', 'Lawyer'];
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('Alice') && e.includes('People') && e.includes('Jobs'))).toBe(true);
  });

  it('rejects items exceeding the max character length', () => {
    const theme = makeTheme();
    theme.categories[0].items[0] = 'A'.repeat(26);
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('exceeds'))).toBe(true);
  });

  it('rejects a category with a missing singularVerb', () => {
    const theme = makeTheme();
    theme.categories[0].singularVerb = '';
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('singularVerb'))).toBe(true);
  });

  it('rejects empty item strings', () => {
    const theme = makeTheme();
    theme.categories[0].items[0] = '';
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('empty item'))).toBe(true);
  });

  it('is case-insensitive for cross-category duplicate detection', () => {
    const theme = makeTheme();
    // 'paris' in Cities, 'Paris' would also appear if we add it to Jobs
    theme.categories[1].items = ['paris', 'Teacher', 'Engineer', 'Chef', 'Pilot', 'Nurse', 'Artist', 'Lawyer'];
    const result = validateThemeContent(theme);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.toLowerCase().includes('paris'))).toBe(true);
  });
});
