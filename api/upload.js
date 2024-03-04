import fs from 'fs';
import express from 'express';
import { UPLOADS_FOLDER } from '../client/constants/common';
import { NO_FILE_UPLOADED, FILE_DELETED_SUCCESSFULLY } from '../constants/message';

const router = express.Router();

router.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send(NO_FILE_UPLOADED);
    }

    const file = req.files.file;

    const filename = `/${UPLOADS_FOLDER}/${new Date().getTime()}-${file.name}`;
    
    const uploadPath = `${__dirname}/..${filename}`;

    file.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        res.send({
            url: filename
        });
    });
});

router.post('/upload-delete', (req, res) => {
    const filename = req.body.filename;

    const filePath = `${__dirname}/..${filename}`;

    fs.unlink(filePath, err => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send(FILE_DELETED_SUCCESSFULLY);
    });
});

export default router;