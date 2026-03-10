import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.js', '**/*.test.jsx', '**/__tests__/**/*.js'],
    globals: true,
  },
});
