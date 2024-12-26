const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to log messages with timestamps
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Function to update the push.ts file
function updatePushFile() {
  const filePath = path.join(__dirname, 'lib', 'push.ts');
  const content = `// This file is automatically updated every hour

console.log(${Date.now()});`;

  try {
    fs.writeFileSync(filePath, content);
    log('Updated push.ts file');
  } catch (error) {
    log(`Error updating push.ts file: ${error.message}`);
    throw error;
  }
}

// Function to execute a command and return its output
function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    log(`Error executing command '${command}': ${error.message}`);
    throw error;
  }
}

// Function to check if there are changes to commit
function hasChanges() {
  const status = execCommand('git status --porcelain');
  return status.length > 0;
}

// Function to commit and push changes
function commitAndPush() {
  try {
    if (!hasChanges()) {
      log('No changes to commit');
      return;
    }

    execCommand('git add lib/push.ts');
    execCommand('git commit -m "Automated hourly update"');
    execCommand('git push origin main'); // Adjust 'main' to your default branch name if different
    log('Successfully committed and pushed changes');
  } catch (error) {
    log(`Error committing and pushing changes: ${error.message}`);
    throw error;
  }
}

// Function to run the update process
function runUpdate() {
  log('Running update');
  try {
    updatePushFile();
    commitAndPush();
  } catch (error) {
    log(`Update process failed: ${error.message}`);
  }
}

// Run the update process every hour
setInterval(runUpdate, 60 * 60 * 1000);

// Run once immediately on script start
runUpdate();

log('Automated update script is running. This script will continue to run until manually stopped.');

