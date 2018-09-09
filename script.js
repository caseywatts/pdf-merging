const shell = require('shelljs');


const inputFiles = gatherInputFiles();
const inputFilesWithDuplicates = duplicateFilesAppropriately(inputFiles)
const duplicatedFilenamesString = joinFilenames(inputFilesWithDuplicates)
mergePDFs(duplicatedFilenamesString)

function duplicateFilesAppropriately(inputFiles, numberForEachInstrument) {
  return inputFiles.reduce((collection, file) => {
    const instrument = getInstrument(file, numberForEachInstrument)

    console.log(`going to print ${instrument.numberOfCopies} for ${instrument.name}`)
    doXTimes(instrument.numberOfCopies, function() {
      collection.push(file)
    })
    return collection;
  }, [])
}

function getInstrument(file) {
  const numberForEachInstrument = {
    'Alto_Saxophone': 1,
    'Baritone_Horn': 2,
    'Bass_Guitar': 2,
    'Bass': 2, // has to come after Bass_Guitar because of specificity - I should get this renamed
    'Clarinet': 2,
    'Trumpet': 2,
    'Cymbals': 2,
    'Electric_Guitar': 2,
    'Flute': 8,
    'Mellophone': 2,
    'Snare': 2,
    'Sousaphone': 2,
    'Tenor_Drum': 2,
    'Tenor_Saxophone': 2,
    'Trombone 2': 2,
    'Trombone': 2, // has to come after Trombone 2 because of specificity
    'Wood_Blocks': 2
  }

  const instrumentName = whichInstrument(file)
  const instrumentNumberOfCopies = numberForInstrument(instrumentName)
  return {
    name: instrumentName,
    numberOfCopies: instrumentNumberOfCopies
  }

  function whichInstrument (file) {
    return Object.keys(numberForEachInstrument).find((instrument) => {
      return file.includes(instrument)
    })
  }
  function numberForInstrument(instrumentName) {
    return numberForEachInstrument[instrumentName] || console.log(`how many for:\n${instrument}`)
  }
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
  console.log(`======\n======\n======\n======\n======\n======\n======\n======\n======`)
  console.log(command)
  shell.exec(command)
}

function doXTimes(xTimes, f) {
  Array.from(Array(xTimes)).forEach(() => {
    f();
  })
};
