#!/usr/bin/env node
//Consider checking the github project\\
//https://github.com/douxxu/floppy-qr \\
//The code was really shitty, so i    \\
//asked chat-gpt to redo it optimizing\\
//it, so sorry if it feels a lot like \\
//ia :(                               \\

const commander = require('commander');
const { generateQRCodes } = require('./createQR');
const { loadQRCodesOwO } = require('./loadQR');

const program = new commander.Command();

program
  .version('1.1.0')
  .description('Floppy QR - Store files in QR codes');

program
  .command('create <file>')
  .option('-n, --note <note>', 'Command to execute after rebuilding the file')
  .option('-b, --base64', 'Use base64 encoding for QR codes')
  .option('-s, --size <size>', 'Set the size of each chunk', parseInt)
  .option('-c, --correction <level>', 'Set the error correction level (L, M, Q, H)')
  .description('Create QR codes from a file')
  .action((file, options) => {
    const chunkSize = options.size || 1650;
    const errorCorrectionLevel = options.correction || 'Q';
    generateQRCodes(file, options.note, options.base64, chunkSize, errorCorrectionLevel);
  });

program
  .command('load <directory>')
  .option('-b, --base64', 'Expect base64 encoding in QR codes')
  .description('Load QR codes to reconstruct the file')
  .action((directory, options) => {
    loadQRCodesOwO(directory, options.base64);
  });

program.parse(process.argv);