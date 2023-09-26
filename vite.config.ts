import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey from 'vite-plugin-monkey';
import packageJson from './package.json';

const nixManualBaseUrl = 'https://nixos.org/manual';
const nixManualChannels = ['stable', 'unstable'];
const nixManuals = ['nixpkgs', 'nixos'];

const nixManualUrls: string[] = [];

nixManualChannels.forEach((channel) => {
  nixManuals.forEach((manual) => {
    nixManualUrls.push(`${nixManualBaseUrl}/${manual}/${channel}/`);
  });
});

const assetUrl = 'https://github.com/Tomaszal/nix-manual-enhancements/releases/latest/download';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.tsx',
      build: {
        metaFileName: true,
        // GM_addStyle breaks Dark Reader for some reason, so insert CSS manually instead
        cssSideEffects: () => (css: string) => {
          const style = document.createElement('style');
          style.textContent = css;
          document.head.append(style);
        },
      },
      userscript: {
        icon: 'https://nixos.org/favicon.png',
        match: nixManualUrls,
        version: packageJson.version,
        updateURL: `${assetUrl}/${packageJson.name}.meta.js`,
        downloadURL: `${assetUrl}/${packageJson.name}.user.js`,
      },
    }),
  ],
  server: {
    watch: { ignored: ['**/.direnv/**'] },
    port: 3000,
  },
});
