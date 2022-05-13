const fs = require('fs');
const path = require('node:path');

const folderPath = path.resolve('05-merge-styles/styles');
const bundlePath = path.resolve('05-merge-styles/project-dist/bundle.css');
const writeableStream = fs.createWriteStream(bundlePath);

fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      const pathToFile = `${folderPath}/${file.name}`;
      const {ext} = path.parse(pathToFile);
      if (ext === '.css') {
        fs.stat(pathToFile, (err, stats) => {
          if (stats.isFile()) {
            const stream = new fs.ReadStream(pathToFile);
            stream.on('readable', () => {
              const data = stream.read();
              if(data != null) writeableStream.write(`${data}\n`);
            });
          }
        });
      }
    });
  }
});
