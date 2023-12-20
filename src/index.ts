import builder from 'xmlbuilder'
import fs from 'fs'

const baseKey = 24;

const ignoredFiles = ['.ds_store', "samplemaps"]
let originalFolder = "/Users/arminhupka/Desktop/samples_test"
const sampleMapsFolder = `${originalFolder}/SAMPLEMAPS`

const generateSampleMaps = (files: string[]) => {
    for (const folder of files) {
        const filePath = `${originalFolder}/${folder}`
        const filesInFolder = fs.readdirSync(filePath)

        filesInFolder.sort((a, b) => {
            const formatA = +a.split("_").slice(-1)[0].replaceAll(".wav", "")
            const formatB = +b.split("_").slice(-1)[0].replaceAll(".wav", "")

            return formatA - formatB
        })

        const ID = folder.toUpperCase()

        const xml = builder.create('samplemap', {encoding: "UTF-8"})
        xml.att('ID', ID);
        xml.att('RRGroupAmount', 1)
        xml.att('MicPositions', ';')

        for (let i = 0; i < filesInFolder.length; i++) {
            const rootKey = baseKey + i * 5
            const loKey = rootKey
            const hiKey = loKey + 4
            const filePath = `${originalFolder}/${folder}/${filesInFolder[i]}`


            const item = xml.ele('sample')
            item.att('Root', rootKey)
            item.att('LoKey', loKey)
            item.att('HiKey', hiKey)
            item.att('LoVel', 0)
            item.att('HiVel', 128)
            item.att('RRGroup', 1)
            item.att('FileName', filePath)
            item.att('Duplicate', 0)
        }

        const file = xml.end({pretty: true})
        fs.writeFileSync(`${sampleMapsFolder}/${ID}.xml`, file, {flag: "a+", encoding: "utf-8"})
    }
}


const run = async () => {
    try {
        const path = fs.readdirSync(originalFolder)
        const allowedFiles = path.filter(p => !ignoredFiles.includes(p.toLowerCase()))

        fs.rmSync(sampleMapsFolder, {force: true, recursive: true})
        fs.mkdirSync(sampleMapsFolder);
        generateSampleMaps(allowedFiles)

    } catch (err) {
        console.error(err)
    }

    process.exit(0)
}


void run()