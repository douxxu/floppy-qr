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
  .version('1.0.1')
  .description('Floppy QR - Store files in QR codes');

program
  .command('create <file>')
  .option('-n, --note <note>', 'Command to execute after rebuilding the file')
  .description('Create QR codes from a file')
  .action((file, options) => {
    generateQRCodes(file, options.note);
  });

program
  .command('load <directory>')
  .description('Load QR codes to reconstruct the file')
  .action((directory, options) => {
    loadQRCodesOwO(directory, options.noCmd);
  });

program.parse(process.argv);
