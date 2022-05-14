const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('node:path');

const pathToStyles = path.join(__dirname,'styles');
const pathToAssets = path.join(__dirname,'assets');
const pathToProjectDist = path.join(__dirname,'project-dist');
const pathToTemplate = path.join(__dirname,'template.html');
const pathToComponents = path.join(__dirname,'components');
const pathToBundle = path.join(pathToProjectDist,'style.css');
const pathToCopyAssets = path.join(pathToProjectDist,'assets');
const pathToExtHtml = path.join(pathToProjectDist,'index.html');


const unlink = async (pathToFile) => {
  await fs.unlink(pathToFile, (err) => {
    if (err) throw err;
  });
};

const rm = async (path) => {
  await fs.readdir(path, {withFileTypes: true}, async (err, files) => {
    if (!err) {
      for (const file of files) {
        const pathToFile = `${path}/${file.name}`;
        await fs.stat(pathToFile, async (err, stats) => {
          if (stats.isFile()) {
            await unlink(pathToFile);
          } else {
            await rm(pathToFile);
          }
        });
      }
    }
  });
};

const copyFile = async (pathToFile, newPathToFile) => {
  await fs.copyFile(pathToFile, newPathToFile, (err) => {
    if (err) throw err;
  });
};

const mkdir = async (folderPath) => {
  await fs.mkdir(folderPath, {recursive: true}, (err) => {
    if (err) throw err;
  });
};

const copyDirectory = async (folderPath, copyFolderPath) => {
  await mkdir(copyFolderPath);

  await fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(async (file) => {
        const pathToFile = `${folderPath}/${file.name}`;
        const newPathToFile = `${copyFolderPath}/${file.name}`;
        await fs.stat(pathToFile, async (err, stats) => {
          if (stats.isFile()) {
            await copyFile(pathToFile, newPathToFile);
          } else {
            await copyDirectory(pathToFile, newPathToFile);
          }
        });
      });
    }
  });
};

const generateBundle = async (folderPath, bundlePath) => {
  const writeableStream = fs.createWriteStream(bundlePath);
  await fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
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
                if (data != null) writeableStream.write(`${data}\n`);
              });
            }
          });
        }
      });
    }
  });
};

const generateHtml = async (extPath, pathToTemplate, pathToComponents) => {
  const writeableStream = fs.createWriteStream(extPath);

  let extHtml = await fsPromises.readFile(pathToTemplate, 'utf-8');

  const files =  await fsPromises.readdir(pathToComponents);
  for (const file of files) {
    const pathToFile = `${pathToComponents}/${file}`;
    const {name, ext} = path.parse(pathToFile);
    if (ext === '.html') {
      const stats = await fsPromises.stat(pathToFile);
      if (stats.isFile()) {
        const data = await fsPromises.readFile(pathToFile, 'utf-8');
        extHtml = extHtml.replace(`{{${name}}}`, data);
      }
    }
  }
  writeableStream.write(`${extHtml}`);
};

(async () => {
  await mkdir(pathToProjectDist);
  await rm(pathToCopyAssets);
  await copyDirectory(pathToAssets, pathToCopyAssets);
  await generateBundle(pathToStyles, pathToBundle);
  await generateHtml(pathToExtHtml, pathToTemplate, pathToComponents);
})();
