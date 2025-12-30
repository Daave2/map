import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/map/',
  plugins: [react(), saveLayoutPlugin()],
})

import fs from 'fs';
import path from 'path';

import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

function saveLayoutPlugin() {
  return {
    name: 'save-layout-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/save-layout', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const layout = JSON.parse(body);
              const filePath = path.resolve(__dirname, 'src/constants/referenceLayout.ts');
              let content = fs.readFileSync(filePath, 'utf-8');

              // Find the start of the layout definition
              const startMarker = 'export const PDF_ACCURATE_LAYOUT: MapLayout =';
              const startIndex = content.indexOf(startMarker);

              if (startIndex !== -1) {
                // Keep everything before the marker
                const prefix = content.substring(0, startIndex);

                // Generate new content
                const newLayoutString = JSON.stringify(layout, null, 4);
                const newContent = `${prefix}${startMarker} ${newLayoutString};\n`;

                fs.writeFileSync(filePath, newContent);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Layout definition not found in file' }));
              }
            } catch (err) {
              console.error(err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to write file' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}
