const shell = require('shelljs');
const inputFiles = shell.find('.').filter(function(file) {
  return file.match(/\.pdf$/) && !file.match(/.*Score.*/);
});

inputFilesWithDuplicates = inputFiles.reduce((collection, file) => {
  doXTimes(4, function() {
    collection.push(file)
  })
  return collection;
}, [])

console.log(inputFilesWithDuplicates)
const listOfFiles = inputFiles.map((f) => `"${f}"`).join(' ');

shell.exec(`gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE=combine.pdf -dBATCH ${listOfFiles}`)

function doXTimes(xTimes, f) {
  Array.from(Array(xTimes)).forEach(() => {
    f();
  })
};
