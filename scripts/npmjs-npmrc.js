const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const ngPackageJsonFilePath = path.join(__dirname, '../projects/core/ng-package.json');
const libraryPackageFilePath = path.join(__dirname, '../projects/core/package.json');

if (!fs.existsSync(ngPackageJsonFilePath)) {
  console.error(`${ngPackageJsonFilePath} does not exist.`);
}

if (!fs.existsSync(libraryPackageFilePath)) {
  console.error(`${libraryPackageFilePath} does not exist.`);
}

console.log(`${ngPackageJsonFilePath} found !`);
console.log(`${libraryPackageFilePath} found !`);

// Get the directory.
const ngPackageJsonDirectory = path.dirname(ngPackageJsonFilePath);

// Read the content.
const ngPackageContent = require(ngPackageJsonFilePath);
const libraryPackageContent = require(libraryPackageFilePath);

const outputPath = path.join(ngPackageJsonDirectory, ngPackageContent.dest);

if (!fs.existsSync(outputPath)) {
  console.error(`${outputPath} does not exist`);
}

console.log(`${outputPath} exists.`);

// Read the environment variable.
dotenv.config();

// Write npm file content.
const npmrc = path.join(outputPath, '.npmrc');
fs.writeFileSync(npmrc, `${libraryPackageContent.name}:registry=https://npmjs.com/${libraryPackageContent.name}
//registry.npmjs.org/:_authToken=${process.env.ACCESS_TOKEN}`);
