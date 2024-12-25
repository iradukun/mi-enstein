const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to update the push.ts file
function updatePushFile() {
  const filePath = path.join(__dirname, 'src/lib', 'push.ts');
  const content = `// This file is automatically updated every hour

console.log(${Date.now()});`;

  fs.writeFileSync(filePath, content);
  console.log('Updated push.ts file');
}

// Function to commit and push changes
function commitAndPush() {
  try {
    execSync('git add lib/push.ts');
    execSync('git commit -m "Automated hourly update"');
    execSync('git push origin main'); // Adjust 'main' to your default branch name if different
    console.log('Successfully committed and pushed changes');
  } catch (error) {
    console.error('Error committing and pushing changes:', error.message);
  }
}

// Function to run the update process
function runUpdate() {
  console.log('Running update at:', new Date().toISOString());
  updatePushFile();
  commitAndPush();
}

// Run the update process every hour
setInterval(runUpdate, 60 * 60 * 1000);

// Run once immediately on script start
runUpdate();

console.log('Automated update script is running. This script will continue to run until manually stopped.');

