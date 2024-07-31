# Floppy QR

Welcome to **Floppy QR**! This project provides a way to store and retrieve files using QR codes, inspired by the classic floppy disk style. With Floppy QR, you can encode a file into a series of QR codes and later reconstruct the file from those QR codes. It’s a fun throwback to the days of floppy disks, but with a modern twist!

## Features

- **Create QR Codes**: Split a file into chunks, encode each chunk into a QR code, and store them in a directory.
- **Load QR Codes**: Reconstruct the original file from a series of QR codes.
- **Retro Charm**: Designed with a nostalgic nod to the floppy disk era.

## Installation

Clone the repository and install the necessary dependencies using npm:

```sh
sudo npm install -g floppy-qr
```
*note: don't forget the "-g"*

## Usage

### Create QR Codes

To generate QR codes from a file, use the `create` command. This will create QR codes for each chunk of the file.

```sh
floppy-qr create <file-path> [-n, --note <optional-note>]
```

- **`<file-path>`**: Path to the file you want to encode into QR codes.
- **`--note`**: Optional note to include in the metadata QR code.

**Example:**

```sh
floppy-qr create myfile.txt --note "This is a test file."
```

This command will generate QR codes in a directory named `myfile.txt-qr`, with the metadata and file chunks encoded into individual QR codes.

### Load QR Codes

To reconstruct a file from a series of QR codes, use the `load` command. This will read the QR codes from the specified directory and reassemble the file.

```sh
floppy-qr load <directory>
```

- **`<directory>`**: Directory containing the QR codes to be read.

**Example:**

```sh
floppy-qr load myfile.txt-qr/
```

This command will read QR codes from the `myfile.txt-qr` directory and reconstruct the original file in the current directory. If a note was included, it will be displayed after reconstruction.

## Project Structure

- **`createQR.js`**: Contains functionality to create QR codes from a file.
- **`loadQR.js`**: Contains functionality to load and reconstruct a file from QR codes.
- **`index.js`**: Main script for handling command-line interface.

## Dependencies

- `colors`: For adding color to console output.
- `fs-extra`: For extended file system operations.
- `pngjs`: For handling PNG image files.
- `qrcode`: For generating QR codes.
- `jsqr`: For decoding QR codes from images.

## Contributing

Feel free to contribute to this project! You can submit issues, create pull requests, or suggest improvements. Please follow the standard GitHub workflow for contributions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please reach out to [douxx@douxx.xyz](mailto:douxx@douxx.xyz).
