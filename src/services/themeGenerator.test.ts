import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PUZZLE_THEMES } from '../data/puzzleThemes';

// Hoist mock handles so they're available inside vi.mock factory closures
const { mockParse } = vi.hoisted(() => ({ mockParse: vi.fn() }));

vi.mock('@anthropic-ai/sdk', () => ({
  // Must be a regular function — arrow functions cannot be called with `new`
  default: vi.fn(function () { return { messages: { parse: mockParse } }; })
}));

vi.mock('@anthropic-ai/sdk/helpers/zod', () => ({
  zodOutputFormat: vi.fn().mockReturnValue({})
}));

// Import after mocks are registered
import { generateThemeFromPrompt } from './themeGenerator';

const validTheme = {
  name: 'Space Explorers',
  description: 'Astronauts and their missions.',
  categories: [
    {
      name: 'Astronauts',
      items: ['Alice', 'Bob', 'Carol', 'David', 'Emma'],
      singularVerb: 'piloted',
      pluralVerb: 'pilot'
    },
    {
      name: 'Planets',
      items: ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury'],
      singularVerb: 'visited',
      pluralVerb: 'visit'
    },
    {
      name: 'Spacecraft',
      items: ['Apollo', 'Soyuz', 'Dragon', 'Orion', 'Falcon'],
      singularVerb: 'flew',
      pluralVerb: 'fly'
    }
  ]
};

describe('generateThemeFromPrompt', () => {
  beforeEach(() => {
    mockParse.mockReset();
    vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('falls back to a built-in theme when no API key is configured', async () => {
    vi.stubEnv('VITE_ANTHROPIC_API_KEY', '');

    const result = await generateThemeFromPrompt('space exploration');

    expect(result.fromAI).toBe(false);
    expect(PUZZLE_THEMES).toContainEqual(result.theme);
    expect(mockParse).not.toHaveBeenCalled();
  });

  it('returns the AI-generated theme on a valid response', async () => {
    mockParse.mockResolvedValueOnce({ parsed_output: validTheme });

    const result = await generateThemeFromPrompt('space exploration');

    expect(result.fromAI).toBe(true);
    expect(result.theme).toEqual(validTheme);
    expect(mockParse).toHaveBeenCalledTimes(1);
  });

  it('includes the user prompt in the API request', async () => {
    mockParse.mockResolvedValueOnce({ parsed_output: validTheme });

    await generateThemeFromPrompt('coffee shop regulars');

    expect(mockParse).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining('coffee shop regulars')
          })
        ])
      })
    );
  });

  it('retries when content validation fails and succeeds on the next attempt', async () => {
    const invalidTheme = { ...validTheme, name: '' }; // fails validateThemeContent
    mockParse
      .mockResolvedValueOnce({ parsed_output: invalidTheme })
      .mockResolvedValueOnce({ parsed_output: validTheme });

    const result = await generateThemeFromPrompt('space exploration');

    expect(result.fromAI).toBe(true);
    expect(result.theme).toEqual(validTheme);
    expect(mockParse).toHaveBeenCalledTimes(2);
  });

  it('retries when the API throws and succeeds on the next attempt', async () => {
    mockParse
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ parsed_output: validTheme });

    const result = await generateThemeFromPrompt('space exploration');

    expect(result.fromAI).toBe(true);
    expect(result.theme).toEqual(validTheme);
    expect(mockParse).toHaveBeenCalledTimes(2);
  });

  it('falls back after exhausting all retries due to invalid content', async () => {
    const invalidTheme = { ...validTheme, name: '' };
    mockParse.mockResolvedValue({ parsed_output: invalidTheme });

    const result = await generateThemeFromPrompt('space exploration');

    expect(result.fromAI).toBe(false);
    expect(PUZZLE_THEMES).toContainEqual(result.theme);
    expect(mockParse).toHaveBeenCalledTimes(3); // initial attempt + 2 retries
  });

  it('falls back after exhausting all retries due to API errors', async () => {
    mockParse.mockRejectedValue(new Error('API unavailable'));

    const result = await generateThemeFromPrompt('space exploration');

    expect(result.fromAI).toBe(false);
    expect(PUZZLE_THEMES).toContainEqual(result.theme);
    expect(mockParse).toHaveBeenCalledTimes(3); // initial attempt + 2 retries
  });
});
