const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..');
const destDir = path.resolve(srcDir, 'Operation-Deadlight');

if (!fs.existsSync(destDir)) {
  console.error('Destination directory Operation-Deadlight not found. Make sure it was cloned first.');
  process.exit(1);
}

// Helper to recursively copy directories with exclude filters
function copyFolderSync(from, to, excludeList = []) {
  const normalizedFrom = from.replace(/\\/g, '/');
  if (excludeList.some(ex => normalizedFrom.endsWith(ex))) {
    return;
  }
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  const fsItems = fs.readdirSync(from);
  for (const item of fsItems) {
    const fromPath = path.join(from, item);
    const toPath = path.join(to, item);
    
    // Skip target directory itself or node_modules / .git / .next / env files
    if (
      item === 'Operation-Deadlight' ||
      item === 'node_modules' ||
      item === '.git' ||
      item === '.next' ||
      item === 'artifacts' ||
      item.startsWith('.env')
    ) {
      continue;
    }

    const normalizedFromPath = fromPath.replace(/\\/g, '/');
    if (excludeList.some(ex => normalizedFromPath.endsWith(ex))) {
      continue;
    }

    const stat = fs.statSync(fromPath);
    if (stat.isDirectory()) {
      copyFolderSync(fromPath, toPath, excludeList);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

const excludeList = [
  // Skip other cases
  'app/hunt/case-01',
  'app/hunt/case-02',
  'app/hunt/case-03',
  'app/hunt/case-04',
  'app/hunt/case-05',
  'app/hunt/case-06',
  'app/hunt/case-08',
  'app/hunt/case-09',
  'components/case-file-01',
  'components/case-file-02',
  'components/case-file-03',
  'components/case-file-04',
  'components/case-file-05',
  'components/case-file-06',
  'components/case-file-08',
  'components/case-file-09',
];

console.log('Copying files from project-mayhem to Operation-Deadlight...');
copyFolderSync(srcDir, destDir, excludeList);

// Modify app/page.tsx in Operation-Deadlight
const pagePath = path.join(destDir, 'app', 'page.tsx');
if (fs.existsSync(pagePath)) {
  console.log('Modifying app/page.tsx to directly mount Case 07 (Operation Deadlight)...');
  let content = fs.readFileSync(pagePath, 'utf8');

  // Replace SlideScroller import with OperationDeadlightPage import
  content = content.replace(
    'import SlideScroller from "@/components/SlideScroller";',
    'import OperationDeadlightPage from "./hunt/case-07/page";'
  );

  // Replace <SlideScroller /> with <OperationDeadlightPage />
  content = content.replace(
    '<SlideScroller />',
    '<OperationDeadlightPage />'
  );

  fs.writeFileSync(pagePath, content, 'utf8');
}

console.log('Case 07 extraction complete successfully!');
