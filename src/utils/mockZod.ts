// Mock implementation of common zod functionality
// This provides a minimal subset of zod's API to prevent build errors

// Basic type definitions
const string = () => ({
  optional: () => string(),
  nullable: () => string(),
  default: (val: string) => string(),
});

const number = () => ({
  optional: () => number(),
  nullable: () => number(),
  default: (val: number) => number(),
  min: (min: number) => number(),
  max: (max: number) => number(),
});

const boolean = () => ({
  optional: () => boolean(),
  nullable: () => boolean(),
  default: (val: boolean) => boolean(),
});

const array = (type: any) => ({
  optional: () => array(type),
  nullable: () => array(type),
  default: (val: any[]) => array(type),
});

// Simple object builder
const object = (schema: Record<string, any>) => {
  return {
    safeParse: (data: any) => {
      // Very basic validation - just checks if data is an object
      if (data && typeof data === 'object') {
        return { success: true, data };
      }
      return { success: false, error: new Error('Invalid data') };
    },
    parse: (data: any) => {
      if (data && typeof data === 'object') {
        return data;
      }
      throw new Error('Invalid data');
    },
    optional: () => object(schema),
    nullable: () => object(schema),
  };
};

// Export the mock functions
export const z = {
  string,
  number,
  boolean,
  array,
  object,
};

export default z; 