import multer from "multer";
import { FILE_BUCKET } from "../constants/config";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({
	url: process.env.MONGO_DB_URI,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	file: (req, file) => {
		return {
			filename: `${Date.now()}-${file.originalname}`,
			bucketName: FILE_BUCKET
		};
	}
});

export const upload = multer({ storage });

export const showImage = (req, res, gfs) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		if (!file || file.length === 0) {
			return res.status(404).json({ error: 'File not found' });
		}

		if (file.contentType.startsWith('image')) {
			// Display the image directly in the browser
			res.set('Content-Type', file.contentType);
			const readStream = gfs.createReadStream(file.filename);
			readStream.pipe(res);
		} else {
			// For other file types, you may want to display them differently
			res.status(400).json({ error: 'File type not supported for preview' });
		}
	});
};