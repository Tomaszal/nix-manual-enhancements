import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey from 'vite-plugin-monkey';

const nixManualBaseUrl = 'https://nixos.org/manual';
const nixManualChannels = ['stable', 'unstable'];
const nixManuals = ['nixpkgs', 'nixos'];

const nixManualUrls: string[] = [];

nixManualChannels.forEach((channel) => {
  nixManuals.forEach((manual) => {
    nixManualUrls.push(`${nixManualBaseUrl}/${manual}/${channel}/`);
  });
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        icon: 'https://nixos.org/favicon.png',
        match: nixManualUrls,
      },
    }),
  ],
  server: {
    watch: { ignored: ['**/.direnv/**'] },
    port: 3000,
  },
});
