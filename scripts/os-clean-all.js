// eslint-disable-next-line @typescript-eslint/no-var-requires
const spawn = require('child_process').spawn;

const isWin = process.platform === 'win32';

const shellCmd = isWin ? '.\\scripts\\os-clean-all.cmd' : 'bash ./scripts/os-clean-all.sh';

const shellExec = spawn(shellCmd, [], {
   shell: true,
   stdio: 'inherit',
});

shellExec.on('exit', (code) => {
   process.exit(code);
});
