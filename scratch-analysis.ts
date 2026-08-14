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
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync('./src/app');
let routes = [];
let buttons = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (file.endsWith('page.tsx')) {
    routes.push(file);
  }
  
  const buttonMatches = content.match(/<Button[\s\S]*?>/g);
  if (buttonMatches) {
    buttons.push({ file, count: buttonMatches.length });
  }
}

console.log('Total routes:', routes.length);
console.log('Files with buttons:', buttons.length);
