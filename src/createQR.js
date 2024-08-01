const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');
require('colors');

const CHUNK_SIZE = 1650;
const ERROR_CORRECTION_LEVEL = 'L';

const log = (message, type = 'info') => {
    const typeMap = {
        info: '[i]'.blue,
        success: '[✔]'.green,
        error: '[✘]'.red
    };
    console.log(`${typeMap[type]} ${message.grey}`);
};

const createQrDirectory = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
};

const createMetadataQR = async (qrFolder, info) => {
    const infoQR = JSON.stringify(info);
    const infoQRPath = path.join(qrFolder, 'qr-1.png');
    await QRCode.toFile(infoQRPath, infoQR, { errorCorrectionLevel: ERROR_CORRECTION_LEVEL });
    log(`Metadata QR code created at ${infoQRPath}`, 'success');
};

const createChunkQR = async (qrFolder, chunk, chunkIndex) => {
    const chunkData = { index: chunkIndex, data: chunk };
    const chunkHash = crypto.createHash('sha256').update(chunk).digest('hex');
    const chunkContent = JSON.stringify({ chunkData, chunkHash });
    const qrPath = path.join(qrFolder, `qr-${chunkIndex}.png`);
    await QRCode.toFile(qrPath, chunkContent, { errorCorrectionLevel: ERROR_CORRECTION_LEVEL });
    log(`QR code for chunk ${chunkIndex} created at ${qrPath}`, 'success');
};

async function generateQRCodes(filePath, note, useBase64) {
    try {
        log(`Starting QR code generation for file: ${filePath}`, 'info');
        const fileContent = fs.readFileSync(filePath);
        const fileBase64 = useBase64 ? fileContent.toString('base64') : fileContent.toString('utf-8');
        const fileName = path.basename(filePath);
        const qrFolder = `${fileName}-qr`;

        log(`Using base64: ${useBase64}`, 'info');
        createQrDirectory(qrFolder);

        const totalChunks = Math.ceil(fileBase64.length / CHUNK_SIZE);
        const info = { fileName, note, totalChunks, useBase64 };
        await createMetadataQR(qrFolder, info);

        for (let i = 0; i < totalChunks; i++) {
            const chunk = fileBase64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            await createChunkQR(qrFolder, chunk, i + 2); // Metadata QR is at index 1
        }

        log(`All QR codes created successfully in ${qrFolder}.`, 'success');
    } catch (err) {
        log('Error creating QR codes: ' + err.message, 'error');
    }
}

module.exports = { generateQRCodes };
