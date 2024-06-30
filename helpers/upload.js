import multer from "multer";
import { FILE_BUCKET } from "../constants/config";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({
	url: process.env.MONGO_DB_URI,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	file: (request, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: FILE_BUCKET
  })
});

export const GetFile = (request, response, grid) => {
	grid.files.findOne({ filename: request.params.filename }, (err, file) => {
		if (!file || file.length === 0) {
			return response.status(404).json({ error: 'File not found' });
		}

		if (file.contentType.startsWith('image')) {
			response.set('Content-Type', file.contentType);
			grid.createReadStream(file.filename).pipe(response);
		} else {
			response.status(400).json({ error: 'File type not supported for preview' });
		}
	});
};

export const DeleteFile = (request, response, grid) => {
	grid.files.findOne({ filename: request.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return response.status(404).json({ error: 'File not found' });
    }

    grid.remove({ _id: file._id, root: 'uploads' }, (err) => {
      if (err) {
        return response.status(500).json({ error: 'Error deleting file' });
      }
      
      response.json({ message: 'File deleted successfully' });
    });
  });
};

export const UploadFile = multer({ storage });