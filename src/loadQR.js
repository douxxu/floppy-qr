const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const jsQR = require('jsqr');
require('colors');

const log = (message, type = 'info') => {
    const typeMap = {
        info: '[i]'.blue,
        success: '[✔]'.green,
        error: '[✘]'.red
    };
    console.log(`${typeMap[type]} ${message.grey}`);
};

async function loadQRCodesOwO(directory) {
    try {
        log(`Loading QR codes from directory: ${directory}`, 'info');
        const qrFiles = fs.readdirSync(directory).filter(file => file.endsWith('.png'));
        qrFiles.sort();

        if (qrFiles.length === 0) {
            log('No QR codes found in the specified directory.', 'error');
            throw new Error('No QR codes found in the specified directory.');
        }


        const firstQRPath = path.join(directory, qrFiles[0]);
        const { content: firstQRContent } = await readQRCodeOwO(firstQRPath);

        let metadata;
        try {
            metadata = JSON.parse(firstQRContent);
        } catch (err) {
            log('Invalid JSON format in metadata: ' + err.message, 'error');
            throw new Error('Invalid JSON format in metadata.');
        }

        const { fileName, note, totalChunks, useBase64 } = metadata;
        if (!fileName || totalChunks === undefined) {
            log('Metadata is missing required fields.', 'error');
            throw new Error('Metadata is missing required fields.');
        }

        let fileContent = '';
        const foundChunks = new Set();

        for (let i = 1; i < qrFiles.length; i++) {
            const file = qrFiles[i];
            const qrPath = path.join(directory, file);
            const { content: qrContent } = await readQRCodeOwO(qrPath);
            fileContent += qrContent;
            foundChunks.add(i);
        }

        if (foundChunks.size !== totalChunks) {
            log('Some QR codes are missing. Aborting reconstruction.', 'error');
            throw new Error('Some QR codes are missing. Aborting reconstruction.');
        }

        const fileBuffer = Buffer.from(fileContent, useBase64 ? 'base64' : 'utf-8');
        const outputFilePath = path.resolve(process.cwd(), fileName);
        fs.writeFileSync(outputFilePath, fileBuffer);
        log(`File successfully reconstructed as ${outputFilePath}`, 'success');

        if (note) {
            console.log('[i]'.blue, `${note}`.cyan);
        }

    } catch (err) {
        log('Error loading QR codes: ' + err.message, 'error');
    }
}

async function readQRCodeOwO(imagePath) {
    try {
        const data = fs.readFileSync(imagePath);
        const png = PNG.sync.read(data);
        const { width, height, data: imageData } = png;

        const qrImageData = new Uint8ClampedArray(imageData.buffer);
        const code = jsQR(qrImageData, width, height);

        if (code) {
            return { content: code.data };
        } else {
            throw new Error('QR code not found in image.');
        }
    } catch (err) {
        log(`Error reading QR code from ${imagePath}: ${err.message}`, 'error');
        throw err;
    }
}

module.exports = { loadQRCodesOwO };
