import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to run a command
const runCommand = (command, args, name) => {
  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  console.log(`Started ${name} process with PID: ${process.pid}`);

  process.on('error', (error) => {
    console.error(`${name} process error:`, error);
  });

  process.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });

  return process;
};

// Start the server
console.log('Starting server...');
const serverProcess = runCommand('node', ['server.js'], 'Server');

// Start the React app
console.log('Starting React app...');
const reactProcess = runCommand('npm', ['run', 'dev'], 'React');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping all processes...');
  
  if (serverProcess) {
    serverProcess.kill();
  }
  
  if (reactProcess) {
    reactProcess.kill();
  }
  
  process.exit(0);
}); 