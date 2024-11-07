const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const jsQR = require('jsqr');
const crypto = require('crypto');
require('colors');

const log = (message, type = 'info') => {
    const typeMap = {
        info: '[i]'.blue,
        success: '[✔]'.green,
        error: '[✘]'.red
    };
    console.log(`${typeMap[type]} ${message.grey}`);
};

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

async function loadQRCodesOwO(directory, useBase64) {
    try {
        log(`Loading QR codes from directory: ${directory}`, 'info');
        const qrFiles = fs.readdirSync(directory).filter(file => file.endsWith('.png'));
        qrFiles.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0])); 

        if (qrFiles.length === 0) {
            log('No QR codes found in the specified directory.', 'error');
            throw new Error('No QR codes found in the specified directory.');
        }

        const firstQRPath = path.join(directory, qrFiles[0]);
        const { content: firstQRContent } = await readQRCodeOwO(firstQRPath);
        const metadata = JSON.parse(firstQRContent);
        const { fileName, totalChunks, useBase64, note } = metadata;

        if (!fileName || totalChunks === undefined) {
            log('Metadata is missing required fields.', 'error');
            throw new Error('Metadata is missing required fields.');
        }

        let fileContent = '';
        let missingChunks = [];

        for (let i = 1; i < qrFiles.length; i++) {
            const file = qrFiles[i];
            const qrPath = path.join(directory, file);
            const { content: qrContent } = await readQRCodeOwO(qrPath);
            
            try {
                const { chunkData, chunkHash } = JSON.parse(qrContent);
                const { index, data } = chunkData;
                const calculatedHash = crypto.createHash('sha256').update(data).digest('hex');

                if (chunkHash !== calculatedHash) {
                    log(`Chunk ${index} hash mismatch.`, 'error');
                    missingChunks.push(index);
                    continue;
                }

                fileContent += data;
            } catch (err) {
                log(`Error parsing QR code content: ${err.message}`, 'error');
                continue;
            }
        }

        if (missingChunks.length > 0 || qrFiles.length - 1 !== totalChunks) {
            log('Some QR codes are missing or corrupted. Aborting reconstruction.', 'error');
            throw new Error('Some QR codes are missing or corrupted.');
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

module.exports = { loadQRCodesOwO };
