
import { defineConfig } from 'vite';

export default defineConfig({
  // Konfigurasi untuk testing dengan Vitest
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});