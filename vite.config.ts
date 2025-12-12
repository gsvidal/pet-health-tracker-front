import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Render.com despliega en la raíz, no necesita subdirectorio
  base: '/',
});
