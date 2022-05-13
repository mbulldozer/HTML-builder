const fs = require('fs');
const path = require('node:path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const writeablePath = path.resolve('02-write-file/out.txt');
const writeableStream = fs.createWriteStream(writeablePath);
const readStream = readline.createInterface({ input, output });
const startMessage = '\nPlease, enter a message to write in a file:\n';
const endMessage = 'Thanks, the message was written in the file out.txt.';

readStream.write(startMessage);
readStream.on('line', (input) => {
  const data = input.toString();
  data === 'exit'?
    readStream.close():
    writeableStream.write(`${data}\n`);
});

readStream.on('SIGINT', () => {
  readStream.close();
});

readStream.on('close', () => {
  writeableStream.end();
  console.log(endMessage);
});


