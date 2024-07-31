const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
require('colors');

const CHUNK_SIZE = 1650; // Size of each chunk for QR codes in base64

const log = (message, type = 'info') => {
    const typeMap = {
        info: '[i]'.blue,
        success: '[✔]'.green,
        error: '[✘]'.red
    };
    console.log(`${typeMap[type]} ${message.grey}`);
};

async function generateQRCodes(filePath, note) {
    try {
        log(`Starting QR code generation for file: ${filePath}`, 'info');
        const fileContent = fs.readFileSync(filePath);
        const fileBase64 = fileContent.toString('base64');
        const fileName = path.basename(filePath);
        const qrFolder = `${fileName}-qr`;

        if (!fs.existsSync(qrFolder)) {
            fs.mkdirSync(qrFolder);
        }

        const totalChunks = Math.ceil(fileBase64.length / CHUNK_SIZE);
        let chunkIndex = 0;

        const info = {
            fileName,
            note: note || null,
            totalChunks
        };
        const infoQR = JSON.stringify(info);
        const infoQRPath = path.join(qrFolder, `qr-1.png`);

        try {
            await QRCode.toFile(infoQRPath, infoQR, { errorCorrectionLevel: 'Q' });
            chunkIndex = 1;
            log(`Metadata QR code created at ${infoQRPath}`, 'success');
        } catch (err) {
            log(`Error creating metadata QR code: ${err.message}`, 'error');
            return;
        }

        for (let i = 0; i < totalChunks; i++) {
            const chunk = fileBase64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            const qrPath = path.join(qrFolder, `qr-${chunkIndex + 1}.png`);

            try {
                await QRCode.toFile(qrPath, chunk, { errorCorrectionLevel: 'Q' });
                log(`QR code for chunk ${chunkIndex + 1} created at ${qrPath}`, 'success');
                chunkIndex++;
            } catch (err) {
                log(`Error creating QR code for chunk ${i + 1}: ${err.message}`, 'error');
                continue;
            }
        }

        log(`All QR codes created successfully in ${qrFolder}.`, 'success');
    } catch (err) {
        log('Error creating QR codes: ' + err.message, 'error');
    }
}

module.exports = { generateQRCodes };
