import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';

export default {
  ...createCjsPreset(),
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
} satisfies Config;
