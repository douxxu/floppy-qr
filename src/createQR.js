const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');
require('colors');

const DEFAULT_CHUNK_SIZE = 1250;
const DEFAULT_ERROR_CORRECTION_LEVEL = 'L';

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

const createMetadataQR = async (qrFolder, info, errorCorrectionLevel) => {
    const infoQR = JSON.stringify(info);
    const infoQRPath = path.join(qrFolder, 'qr-1.png');
    await QRCode.toFile(infoQRPath, infoQR, { errorCorrectionLevel });
    log(`Metadata QR code created at ${infoQRPath}`, 'success');
};

const createChunkQR = async (qrFolder, chunk, chunkIndex, errorCorrectionLevel) => {
    const chunkData = { index: chunkIndex, data: chunk };
    const chunkHash = crypto.createHash('sha256').update(chunk).digest('hex');
    const chunkContent = JSON.stringify({ chunkData, chunkHash });
    const qrPath = path.join(qrFolder, `qr-${chunkIndex}.png`);
    await QRCode.toFile(qrPath, chunkContent, { errorCorrectionLevel });
    log(`QR code for chunk ${chunkIndex} created at ${qrPath}`, 'success');
};

async function generateQRCodes(filePath, note, useBase64 = false, chunkSize = DEFAULT_CHUNK_SIZE, errorCorrectionLevel = DEFAULT_ERROR_CORRECTION_LEVEL) {
    try {
        log(`Starting QR code generation for file: ${filePath}`, 'info');
        log(`Chunk size set to ${chunkSize}`, 'info');
        log(`Error correction level: ${errorCorrectionLevel}`, 'info');
        
        const fileContent = fs.readFileSync(filePath);
        const fileBase64 = useBase64 ? fileContent.toString('base64') : fileContent.toString('utf-8');
        const fileName = path.basename(filePath);
        const qrFolder = `${fileName}-qr`;

        log(`Using base64: ${useBase64}`, 'info');
        createQrDirectory(qrFolder);

        const totalChunks = Math.ceil(fileBase64.length / chunkSize);
        const info = { fileName, note, totalChunks, useBase64, chunkSize, errorCorrectionLevel };
        await createMetadataQR(qrFolder, info, errorCorrectionLevel);

        for (let i = 0; i < totalChunks; i++) {
            const chunk = fileBase64.slice(i * chunkSize, (i + 1) * chunkSize);
            await createChunkQR(qrFolder, chunk, i + 2, errorCorrectionLevel);
        }

        log(`All QR codes created successfully in ${qrFolder}.`, 'success');
    } catch (err) {
        log('Error creating QR codes: ' + err.message, 'error');
    }
}

module.exports = { generateQRCodes };
