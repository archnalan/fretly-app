import { z } from 'zod';

// Defining theme schema
const themeSchema = z.enum(['autumn', 'dark']);

export type theme = z.infer<typeof themeSchema>;

// Function to get and validate theme from local storage
export const getValidatedTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  const result = themeSchema.safeParse(storedTheme);
  if (result.success) {
    return result.data;
  } else {
    // Handle invalid data
    console.error('Invalid theme in local storage:', result.error);
    return 'autumn'; // Default theme
  }
};

