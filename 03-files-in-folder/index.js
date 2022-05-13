const fs = require('fs');
const path = require('node:path');

const folderPath = path.join(__dirname,'secret-folder');

fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      const pathToFile = `${folderPath}/${file.name}`;
      const {name, ext} = path.parse(pathToFile);
      fs.stat(pathToFile, (err, stats) => {
        if (stats.isFile()) console.log(`${name} - ${ext.slice(1)} - ${stats.size}b`);
      });
    });
  }
});
