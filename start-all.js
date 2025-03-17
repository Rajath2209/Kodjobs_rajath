import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to user.json file
const userFilePath = path.join(__dirname, 'src', 'user.json');

// Ensure user.json exists and is properly initialized
function ensureUserJsonExists() {
  try {
    if (!fs.existsSync(userFilePath)) {
      fs.writeFileSync(userFilePath, '[]', 'utf8');
      console.log('Created empty user.json file');
    } else {
      const content = fs.readFileSync(userFilePath, 'utf8');
      if (!content.trim()) {
        fs.writeFileSync(userFilePath, '[]', 'utf8');
        console.log('Initialized empty user.json file with []');
      } else {
        try {
          JSON.parse(content);
          console.log('user.json is valid JSON');
        } catch (e) {
          console.log('user.json contains invalid JSON, resetting to []');
          fs.writeFileSync(userFilePath, '[]', 'utf8');
        }
      }
    }
  } catch (error) {
    console.error('Error ensuring user.json exists:', error);
  }
}

// Function to run a command
function runCommand(command, args, label) {
  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });
  
  console.log(`Started ${label} (PID: ${process.pid})`);
  
  process.on('error', (error) => {
    console.error(`${label} error:`, error);
  });
  
  process.on('close', (code) => {
    console.log(`${label} exited with code ${code}`);
  });
  
  return process;
}

// Ensure user.json is properly set up
ensureUserJsonExists();

// Start the server
console.log('Starting server...');
const server = runCommand('node', ['server.js'], 'Server');

// Wait a moment for the server to start
setTimeout(() => {
  // Start the React app
  console.log('Starting React app...');
  const reactApp = runCommand('npm', ['run', 'dev'], 'React');
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Stopping all processes...');
    server.kill();
    reactApp.kill();
    process.exit();
  });
}, 2000);

console.log('Both server and React app should be starting...');
console.log('Press Ctrl+C to stop all processes'); 