const shell = require('shelljs');


const inputFiles = gatherInputFiles();
const inputFilesWithDuplicates = duplicateFilesAppropriately(inputFiles)
const duplicatedFilenamesString = joinFilenames(inputFilesWithDuplicates)
mergePDFs(duplicatedFilenamesString)


function duplicateFilesAppropriately(inputFiles) {
  return inputFiles.reduce((collection, file) => {
    doXTimes(4, function() {
      collection.push(file)
    })
    return collection;
  }, [])
}

function gatherInputFiles() {
  return shell.find('.').filter(function(file) {
    return file.match(/\.pdf$/) && !file.match(/.*Score.*/)&& !file.match(/.*output.*/);
  });
}

function joinFilenames(files) {
  return files.map((f) => `"${f}"`).join(' ');
}

function mergePDFs(pdfs) {
  const command = `gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE=output.pdf -dBATCH ${pdfs}`;
  console.log(command)
  shell.exec(command)
}

function doXTimes(xTimes, f) {
  Array.from(Array(xTimes)).forEach(() => {
    f();
  })
};
