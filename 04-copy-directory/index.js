const fs = require('fs');
const path = require('node:path');

const folderPath = path.resolve('04-copy-directory/files');
const copyFolderPath = `${folderPath}-copy`;

fs.mkdir(copyFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(copyFolderPath, {withFileTypes: true}, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      const pathToFile = `${copyFolderPath}/${file.name}`;
      fs.unlink(pathToFile, (err) => {
        if (err) throw err;
      });
    });
  }
});

fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      const pathToFile = `${folderPath}/${file.name}`;
      const newPathToFile = `${copyFolderPath}/${file.name}`;
      fs.stat(pathToFile, (err, stats) => {
        if (stats.isFile()) {
          fs.copyFile(pathToFile, newPathToFile, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  }
});
