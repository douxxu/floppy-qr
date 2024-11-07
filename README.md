# Floppy QR

Welcome to **Floppy QR**! This project provides a way to store and retrieve files using QR codes, inspired by the classic floppy disk style. With Floppy QR, you can encode a file into a series of QR codes and later reconstruct the file from those QR codes. It’s a fun throwback to the days of floppy disks, but with a modern twist!

## Features

- **Create QR Codes**: Split a file into chunks, encode each chunk into a QR code, and store them in a directory.
- **Load QR Codes**: Reconstruct the original file from a series of QR codes. The format (base64 or text) is automatically detected based on metadata.
- **Customizable Options**: Adjust chunk size and error correction level for QR codes.
- **Retro Charm**: Designed with a nostalgic nod to the floppy disk era.

## Installation

Clone the repository and install the necessary dependencies using npm:

```sh
sudo npm install -g floppy-qr
```
*Note: Don't forget the "-g"*

## Usage

### Create QR Codes

To generate QR codes from a file, use the `create` command. This will create QR codes for each chunk of the file.

```sh
floppy-qr create <file-path> [-n, --note <optional-note>] [-b, --base64] [-s, --size <chunk-size>] [-c, --correction <level>]
```

- **`<file-path>`**: Path to the file you want to encode into QR codes.
- **`--note`**: Optional note to include in the metadata QR code.
- **`--base64`**: Optional flag to encode the file chunks in base64 format.
- **`--size`**: Optional parameter to specify the size of each chunk. Default is `1650` bytes.
- **`--correction`**: Optional parameter to set the error correction level. Options are `L`, `M`, `Q`, `H`. Default is `Q`.

**Example:**

```sh
floppy-qr create myfile.txt --note "This is a test file." --base64 --size 2000 --correction H
```

This command will generate QR codes in a directory named `myfile.txt-qr`, with the metadata and file chunks encoded into individual QR codes. It uses base64 encoding, chunks of 2000 bytes, and a high error correction level (`H`).

### Load QR Codes

To reconstruct a file from a series of QR codes, use the `load` command. This will read the QR codes from the specified directory and reassemble the file. The format (base64 or text) is detected automatically based on the metadata in the first QR code.

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
- **`floppy-qr.js`**: Main script for handling command-line interface.

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

For any questions or support, please reach out to [douxx@douxx.tech](mailto:douxx@douxx.tech).
