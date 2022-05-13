const fs = require('fs');
const path = require('node:path');

const textPath = path.resolve('01-read-file/text.txt');
const stream = new fs.ReadStream(textPath);

stream.on('readable', () => {
  const data = stream.read();
  if(data != null) console.log(data.toString());
});
