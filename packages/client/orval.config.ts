import { defineConfig } from 'orval';
 
export default defineConfig({
 api: {
    output: {
      mode: 'tags-split',
      target: 'src/api/__generated/client.ts',
      schemas: 'src/api/__generated/models',
      client: 'react-query',
      mock: true,
    },
    input: {
      target: 'http://localhost:7001/api/docs-json',
    },
  },
});
