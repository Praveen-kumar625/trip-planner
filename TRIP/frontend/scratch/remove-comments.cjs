const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src');

function removeCommentsFromFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Very simplistic and safe comment removal:
  // We only remove single-line comments that start at the beginning of a line or after spaces
  // This avoids deleting // inside strings like http://
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    // Keep JSDoc or special markers if any, else remove if it's just a comment
    if (trimmed.startsWith('//') && !trimmed.startsWith('///')) {
      return false;
    }
    return true;
  });

  const cleanedContent = cleanedLines.join('\n');
  if (content !== cleanedContent) {
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    console.log(`Cleaned: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      removeCommentsFromFile(fullPath);
    }
  }
}

walkDir(targetDir);
console.log("Comment removal complete.");
