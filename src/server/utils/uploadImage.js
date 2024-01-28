import fs from 'fs';
import path from 'path';
import stream from 'stream';

export const saveImageToFileSystem = async file => {
  const { data, contentType, name } = file;
  const buffer = Buffer.from(data, 'base64');
  const readableStream = new stream.Readable();
  readableStream.push(buffer);
  readableStream.push(null);

  const filePath = `/uploads/${name}`;

  const fullFilePath = path.join(__dirname, '..', 'uploads', name);

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(fullFilePath);

    readableStream
      .pipe(writeStream)
      .on('finish', () => resolve(filePath))
      .on('error', reject);
  });
};

export const deleteImageFromFileSystem = async imageId => {
  const path = `./uploads/${imageId}`;
  return new Promise((resolve, reject) =>
    fs.unlink(path, err => {
      if (err) {
        console.error(err);
        resolve(false);
      } else {
        resolve(true);
      }
    })
  );
};
