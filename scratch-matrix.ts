import fs from 'fs';
import path from 'path';

const walkSync = (dir: string, filelist: string[] = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.git') && !dirFile.includes('.next')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('page.tsx') || dirFile.endsWith('route.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync('./src/app');
const routes = files.map(f => {
  let route = f.replace('./src/app', '').replace('/page.tsx', '').replace('/route.ts', '');
  if (route === '') route = '/';
  
  // Clean up route groups like (storefront)
  route = route.replace(/\/\([^)]+\)/g, '');
  if (route === '') route = '/';
  
  return { file: f, route };
});

const content = `# MVP_ROUTE_MATRIX.md

| Filesystem Route | Web Route | Type | Note |
|---|---|---|---|
${routes.map(r => `| \`${r.file}\` | \`${r.route}\` | ${r.file.endsWith('route.ts') ? 'API' : 'Page'} | |`).join('\n')}
`;

fs.writeFileSync('MVP_ROUTE_MATRIX.md', content);
console.log('Created MVP_ROUTE_MATRIX.md');
