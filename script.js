const shell = require('shelljs')

const instrumentsTSV = `Alto_Saxophone	4
Baritone_Horn	5
Bass_Guitar	1
Clarinet	5
Electric_Guitar	1
Euphonium	1
Flute	6
Guitar	1
Mellophone	5
Piccolo	3
Sousaphone	2
Tenor_Saxophone	1
Trombone_1	4
Trombone_2	3
Trumpet	11
Cymbals	1
Bass	3
Snare	2
Tenor_Drum	1
Wood_Blocks	1`

const numberForEachInstrument = tsvToObject(instrumentsTSV)

const inputFiles = gatherInputFiles()
const inputFilesWithDuplicates = duplicateFilesAppropriately(inputFiles)
const inputFilesWithDuplicatesString = joinFilenames(inputFilesWithDuplicates)
mergePDFs(inputFilesWithDuplicatesString)

function duplicateFilesAppropriately (inputFiles) {
  return inputFiles.reduce((collection, file) => {
    const instrument = getInstrument(file)

    console.log(`going to print ${instrument.numberOfCopies} for ${instrument.name}`)
    doXTimes(instrument.numberOfCopies, function () {
      collection.push(file)
    })
    return collection
  }, [])
}

function getInstrument (file) {
  function whichInstrument (file) {
    const foundInstrumentName = Object.keys(numberForEachInstrument).find((instrument) => {
      return file.includes(instrument)
    })
    if (foundInstrumentName) {
      return foundInstrumentName
    } else {
      console.log(`no instrument name match for ${file}`)
    }
  }
  function numberForInstrument (instrumentName) {
    if (numberForEachInstrument[instrumentName]) {
      return numberForEachInstrument[instrumentName]
    } else {
      console.log(`how many for ${instrumentName}?`)
      return 1
    }
  }

  const instrumentName = whichInstrument(file)
  const instrumentNumberOfCopies = numberForInstrument(instrumentName)
  return {
    name: instrumentName,
    numberOfCopies: instrumentNumberOfCopies
  }
}

function gatherInputFiles () {
  return shell.find('.').filter(function (file) {
    return file.match(/\.pdf$/) && !file.match(/.*Score.*/) && !file.match(/.*output.*/)
  })
}

function joinFilenames (files) {
  return files.map((f) => `"${f}"`).join(' ')
}

function mergePDFs (pdfs) {
  const command = `gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE=output.pdf -dBATCH ${pdfs}`
  console.log(`======\n======\n======\n======\n======\n======\n======\n======\n======`)
  console.log(command)
  shell.exec(command)
}

function doXTimes (xTimes, f) {
  Array.from(Array(xTimes)).forEach(() => {
    f()
  })
};

function tsvToObject (tsv) {
  var lines = tsv.split('\n')
  var obj = {}

  lines.forEach((line) => {
    [name, number] = line.split('\t')
    console.log(`name: ${name}`)
    console.log(`number: ${number}`)
    obj[name] = number
  })

  return obj // JSON
}
