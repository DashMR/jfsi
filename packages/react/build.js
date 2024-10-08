// Reference: https://github.com/souporserious/bundling-typescript-with-esbuild-for-npm

import { build } from 'esbuild';
import fs from 'fs';
import fsPromises from 'fs/promises';
import packageConfig from './package.json' assert { type: 'json' };
const { dependencies } = packageConfig;

const entryFile = 'src/index.tsx';
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  external: Object.keys(dependencies),
  logLevel: 'info',
  minify: true,
  sourcemap: true,
};

await build({
  ...shared,
  format: 'esm',
  outfile: './dist/index.js',
  target: ['esnext', 'node16'],
  loader: {
    '.png': 'dataurl',
  },
});

// Get list of modules with an index.ts file in the src directory
const modules = (await fsPromises.readdir('./src', { withFileTypes: true }))
  .map((val) => {
    if (val.isDirectory()) {
      // Check if directory has an index.ts file
      const indexFile = `./src/${val.name}/index.ts`;
      if (fs.existsSync(indexFile)) {
        return val.name;
      }
    }
    return null;
  })
  .filter(Boolean)
  .map((val) => `${val}/index.ts`);

// Get list of modules that are just files in the src directory
const fileModules = (await fsPromises.readdir('./src', { withFileTypes: true }))
  .map((val) => {
    if (val.isDirectory()) return null;
    return val.name;
  })
  // Filter out any files that are not .ts or .tsx and the index file
  .filter(
    (val) => Boolean(val) && !['globals.d.ts', 'index.tsx'].includes(val)
  );

// Build each module entrypoint
[...fileModules, ...modules].forEach(async (entryFile) => {
  // Replace .ts or .tsx with .js
  const outfile = entryFile.replace(/\.tsx?$/, '.js');

  await build({
    ...shared,
    entryPoints: [`src/${entryFile}`],
    format: 'esm',
    outfile: `./dist/${outfile}`,
    target: ['esnext', 'node16'],
    loader: {
      '.png': 'dataurl',
    },
  });
});
