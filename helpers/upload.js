import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { FILE_BUCKET, FILE_IMAGE_ACCEPTED } from "../constants/config";

const storage = new GridFsStorage({
	url: process.env.MONGO_DB_URI,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	file: (req, file) => {
		return FILE_IMAGE_ACCEPTED.indexOf(file.mimetype) === -1
			? `${Date.now()}-${file.name}`
			: {
				bucketName: FILE_BUCKET,
				filename: `${Date.now()}-${file.name}`
			};
	}
});

const uploadFile = multer({ storage: storage }).single("file");

const uploadFiles = multer({ storage: storage }).array('file', 10);

export const uploadFileMiddleware = util.promisify(uploadFile);

export const uploadFilesMiddleware = util.promisify(uploadFiles);