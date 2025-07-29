#!/usr/bin/env node

// Check whether font declarations are consistent across files.

import { readFileSync } from 'fs';

const files = ['src/pages/index.astro', 'src/styles/base.scss'];
const fontDeclRegex = /^\s*(primary|weights):/;

// Return font declaration lines from a file as string array.
function getFontDecls(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    return lines.filter((line) => fontDeclRegex.test(line));
  } catch (error) {
    console.error(`❌ Cannot read ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

// Check whether font declarations are consistent across files.
function main() {
  const decls = files.map((file) => getFontDecls(file));

  const mismatch =
    decls[0].length !== decls[1].length ||
    decls[0].some((decl, index) => decl !== decls[1][index]);

  if (mismatch) {
    console.log('❌ Font declarations are inconsistent\n');
    files.forEach((file, i) => {
      console.log(`${file}:`);
      console.log(decls[i].join('\n'), '\n');
    });
    process.exit(1);
  } else {
    console.log('✅ Font declarations are consistent across SCSS and TS');
  }
}

main();
