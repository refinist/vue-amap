import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    minify: true,
    entry: ['./src/index.ts'],
    platform: 'neutral',
    fromVite: true,
    dts: {
      vue: true
    }
  }
]);
