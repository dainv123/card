import { resolve } from 'path';
import { createWriteStream } from 'fs';

const uploadFile = async (file, destinationPath) => {
  const { createReadStream, filename } = await file;
  const stream = createReadStream();
  const path = resolve(destinationPath, filename);
  await stream.pipe(createWriteStream(path));
  return path;
};


export default uploadFile;
