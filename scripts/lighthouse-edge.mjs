import { spawn } from 'child_process';
import { existsSync } from 'fs';

const edgePaths = [
  process.env.CHROME_PATH,
  process.platform === 'win32' && process.env['ProgramFiles(x86)'] && `${process.env['ProgramFiles(x86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
  process.platform === 'win32' && `${process.env.PROGRAMFILES || 'C:\\Program Files'}\\Microsoft\\Edge\\Application\\msedge.exe`,
  process.platform === 'darwin' && '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean);

let edgePath = edgePaths.find(existsSync);
if (!edgePath && process.platform === 'win32') {
  edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (!existsSync(edgePath)) edgePath = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
}
if (!edgePath || !existsSync(edgePath)) {
  console.error('Edge not found. Install Microsoft Edge or set CHROME_PATH.');
  process.exit(1);
}

const args = process.argv.slice(2);
const child = spawn('npx', ['lighthouse', ...args], {
  stdio: 'inherit',
  env: { ...process.env, CHROME_PATH: edgePath },
});
child.on('exit', (code) => process.exit(code ?? 0));
