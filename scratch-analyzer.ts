import fs from 'fs';
import path from 'path';

const walkSync = (dir: string, filelist: string[] = []) => {
  if (!fs.existsSync(dir)) return filelist;
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

const appFiles = walkSync('./src/app');
const compFiles = walkSync('./src/components');
const allFiles = [...appFiles, ...compFiles];

let routes = [];
let interactions = [];
let apiRoutes = [];

// API Analysis
for (const file of appFiles) {
    if (file.endsWith('route.ts')) {
        const content = fs.readFileSync(file, 'utf8');
        const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(m => content.includes(`export async function ${m}`));
        apiRoutes.push({ file, methods });
    }
}

// UI Analysis
let idCounter = 1;
for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Find Buttons
    const btnRegex = /<Button[^>]*>([\s\S]*?)<\/Button>/g;
    let match;
    while ((match = btnRegex.exec(content)) !== null) {
        let label = match[1].replace(/<[^>]+>/g, '').trim();
        if (!label) label = 'Icon/Dynamic';
        interactions.push({
            id: `BTN-${idCounter++}`,
            file,
            type: 'Button',
            label: label.substring(0, 50).replace(/\n/g, ' '),
            raw: match[0].substring(0, 100)
        });
    }

    // Find Links
    const linkRegex = /<Link[^>]*href=["'{]([^"'}]+)["'}][^>]*>([\s\S]*?)<\/Link>/g;
    while ((match = linkRegex.exec(content)) !== null) {
        let href = match[1];
        let label = match[2].replace(/<[^>]+>/g, '').trim();
        if (!label) label = 'Icon/Dynamic';
        interactions.push({
            id: `LNK-${idCounter++}`,
            file,
            type: 'Link',
            destination: href,
            label: label.substring(0, 50).replace(/\n/g, ' '),
        });
    }
    
    // Find a tags
    const aRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/g;
    while ((match = aRegex.exec(content)) !== null) {
        let href = match[1];
        let label = match[2].replace(/<[^>]+>/g, '').trim();
        if (!label) label = 'Icon/Dynamic';
        interactions.push({
            id: `ATAG-${idCounter++}`,
            file,
            type: 'a',
            destination: href,
            label: label.substring(0, 50).replace(/\n/g, ' '),
        });
    }
}

// Generate INTERACTION_INVENTORY.csv
let csv = "ID,PAGE/COMPONENT,ELEMENT TYPE,VISIBLE LABEL,DESTINATION,STATUS,SEVERITY,NOTES\n";
for (const i of interactions) {
    csv += `${i.id},"${i.file}","${i.type}","${i.label}","${i.destination || ''}","UNVERIFIED (No Browser)","P1","Needs manual/runtime verify"\n`;
}
fs.writeFileSync('INTERACTION_INVENTORY.csv', csv);

// Generate MVP_ROUTE_MATRIX.md
let rMatrix = "# MVP_ROUTE_MATRIX\n\n";
rMatrix += "## API Routes\n";
for (const api of apiRoutes) {
    rMatrix += `- \`${api.file}\`: ${api.methods.join(', ')}\n`;
}
rMatrix += "\n## Frontend Routes\n";
for (const file of appFiles) {
    if (file.endsWith('page.tsx')) {
        rMatrix += `- \`${file}\`\n`;
    }
}
fs.writeFileSync('MVP_ROUTE_MATRIX.md', rMatrix);

console.log('Static analysis complete. Generated CSV and Matrix.');
console.log(`Found ${interactions.length} interactions.`);
