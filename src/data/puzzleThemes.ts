import type { Category } from '../types/puzzle';

export interface PuzzleTheme {
  name: string;
  description: string;
  categories: {
    name: string;
    items: string[];
    // Verb templates for clue generation
    singularVerb: string;  // e.g., "works in", "owns", "ordered"
    pluralVerb?: string;    // e.g., "work in", "own", "ordered" (defaults to singularVerb)
  }[];
}

export const PUZZLE_THEMES: PuzzleTheme[] = [
  {
    name: 'Office Workers',
    description: 'Figure out which person works in which department and prefers which beverage.',
    categories: [
      {
        name: 'People',
        items: ['Anna', 'Ben', 'Carlos', 'Diana', 'Eric', 'Frank', 'Grace', 'Henry'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Departments',
        items: ['Sales', 'Marketing', 'IT', 'Finance', 'HR', 'Legal', 'Operations', 'Research'],
        singularVerb: 'works in',
        pluralVerb: 'work in'
      },
      {
        name: 'Beverages',
        items: ['Coffee', 'Tea', 'Water', 'Soda', 'Juice', 'Lemonade', 'Milk', 'Smoothie'],
        singularVerb: 'drinks',
        pluralVerb: 'drink'
      }
    ]
  },
  {
    name: 'Pet Adoption Day',
    description: 'Match each person with their adopted pet and chosen accessory.',
    categories: [
      {
        name: 'People',
        items: ['Alice', 'Bob', 'Charlie', 'Diana', 'Emma', 'Frank', 'Grace', 'Henry'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Pets',
        items: ['Cat', 'Dog', 'Rabbit', 'Hamster', 'Parrot', 'Lizard', 'Turtle', 'Guinea Pig'],
        singularVerb: 'adopted',
        pluralVerb: 'adopted'
      },
      {
        name: 'Accessories',
        items: ['Red Collar', 'Blue Leash', 'Yellow Toy', 'Green Bowl', 'Purple Bed', 'Orange Cage', 'Pink Brush', 'White Blanket'],
        singularVerb: 'chose',
        pluralVerb: 'chose'
      }
    ]
  },
  {
    name: 'Restaurant Night',
    description: 'Figure out which person ordered which meal and drink at the restaurant.',
    categories: [
      {
        name: 'People',
        items: ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Meals',
        items: ['Steak', 'Pasta', 'Fish', 'Burger', 'Salad', 'Pizza', 'Soup', 'Tacos'],
        singularVerb: 'ordered',
        pluralVerb: 'ordered'
      },
      {
        name: 'Drinks',
        items: ['Wine', 'Beer', 'Juice', 'Soda', 'Water', 'Lemonade', 'Iced Tea', 'Smoothie'],
        singularVerb: 'drinks',
        pluralVerb: 'drink'
      }
    ]
  },
  {
    name: 'Sports Tournament',
    description: 'Determine which athlete plays which sport and uses which equipment.',
    categories: [
      {
        name: 'Athletes',
        items: ['Alex', 'Bailey', 'Cameron', 'Drew', 'Ellis', 'Finley', 'Gray', 'Harper'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Sports',
        items: ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Golf', 'Swimming', 'Volleyball', 'Hockey'],
        singularVerb: 'plays',
        pluralVerb: 'play'
      },
      {
        name: 'Equipment',
        items: ['Red Jersey', 'Blue Sneakers', 'Yellow Racket', 'Green Glove', 'Purple Cap', 'Orange Ball', 'Pink Towel', 'White Helmet'],
        singularVerb: 'uses',
        pluralVerb: 'use'
      }
    ]
  },
  {
    name: 'Concert Night',
    description: 'Match each musician with their instrument and preferred music genre.',
    categories: [
      {
        name: 'Musicians',
        items: ['Aria', 'Blake', 'Casey', 'Dakota', 'Eden', 'Finch', 'Gray', 'Haven'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Instruments',
        items: ['Guitar', 'Piano', 'Drums', 'Violin', 'Saxophone', 'Flute', 'Bass', 'Trumpet'],
        singularVerb: 'plays',
        pluralVerb: 'play'
      },
      {
        name: 'Genres',
        items: ['Jazz', 'Rock', 'Classical', 'Blues', 'Pop', 'Folk', 'Funk', 'Country'],
        singularVerb: 'prefers',
        pluralVerb: 'prefer'
      }
    ]
  },
  {
    name: 'Book Club',
    description: 'Figure out which reader prefers which genre and which author.',
    categories: [
      {
        name: 'Readers',
        items: ['Avery', 'Blake', 'Cameron', 'Devon', 'Ellis', 'Finley', 'Gray', 'Hayden'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Genres',
        items: ['Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Thriller', 'Horror', 'Biography', 'History'],
        singularVerb: 'reads',
        pluralVerb: 'read'
      },
      {
        name: 'Authors',
        items: ['Christie', 'Austen', 'Asimov', 'Tolkien', 'King', 'Atwood', 'Shelley', 'Orwell'],
        singularVerb: 'favors',
        pluralVerb: 'favor'
      }
    ]
  },
  {
    name: 'Travel Destinations',
    description: 'Discover which traveler visited which city and stayed in which hotel.',
    categories: [
      {
        name: 'Travelers',
        items: ['Ava', 'Ben', 'Clara', 'Dante', 'Eva', 'Felix', 'Gina', 'Hugo'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Cities',
        items: ['Paris', 'Tokyo', 'London', 'Rome', 'Sydney', 'Dubai', 'Barcelona', 'Bangkok'],
        singularVerb: 'visited',
        pluralVerb: 'visited'
      },
      {
        name: 'Hotels',
        items: ['Grand Plaza', 'Ocean View', 'Mountain Lodge', 'City Center', 'Harbor Inn', 'Garden Suites', 'Skyline Tower', 'Riverside Manor'],
        singularVerb: 'stayed at',
        pluralVerb: 'stayed at'
      }
    ]
  },
  {
    name: 'Art Gallery',
    description: 'Match each artist with their preferred medium and favorite color.',
    categories: [
      {
        name: 'Artists',
        items: ['Aiden', 'Brooke', 'Cole', 'Dana', 'Eli', 'Faye', 'Gage', 'Hope'],
        singularVerb: 'is',
        pluralVerb: 'is'
      },
      {
        name: 'Mediums',
        items: ['Oil Paint', 'Watercolor', 'Sculpture', 'Charcoal', 'Digital', 'Photography', 'Pastel', 'Acrylic'],
        singularVerb: 'uses',
        pluralVerb: 'use'
      },
      {
        name: 'Colors',
        items: ['Crimson', 'Azure', 'Emerald', 'Gold', 'Violet', 'Coral', 'Indigo', 'Silver'],
        singularVerb: 'prefers',
        pluralVerb: 'prefer'
      }
    ]
  }
];

/**
 * Utility to shuffle an array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Select a random theme and sample items for a puzzle
 */
export function selectRandomTheme(itemCount: number): {
  theme: PuzzleTheme;
  categories: Category[];
} {
  // Select random theme
  const theme = PUZZLE_THEMES[Math.floor(Math.random() * PUZZLE_THEMES.length)];

  // Sample items from each category
  const categories: Category[] = theme.categories.map((cat, idx) => {
    if (cat.items.length < itemCount) {
      throw new Error(
        `Theme "${theme.name}" category "${cat.name}" has only ${cat.items.length} items, need ${itemCount}`
      );
    }

    return {
      id: `cat${idx}`,
      name: cat.name,
      items: shuffle(cat.items).slice(0, itemCount)
    };
  });

  return { theme, categories };
}
