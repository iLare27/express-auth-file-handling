const fs = require('fs');
const path = require('path');
const File = require('../models/file');

const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

class FileService {
    async uploadFile(file) {
        const { originalname, mimetype, size } = file;
        const extension = path.extname(originalname);
        const name = path.basename(originalname, extension);

        const newFile = await File.create({
            name,
            extension,
            mimeType: mimetype,
            size,
            uploadDate: new Date()
        });

        const filePath = path.join(uploadDir, `${newFile.id}${extension}`);
        fs.writeFileSync(filePath, file.buffer);

        return newFile;
    }

    async listFiles(page = 1, listSize = 10) {
        const offset = (page - 1) * listSize;
        const files = await File.findAndCountAll({
            limit: parseInt(listSize, 10),
            offset
        });

        return {
            total: files.count,
            pages: Math.ceil(files.count / listSize),
            data: files.rows
        };
    }

    async getFile(id) {
        const file = await File.findByPk(id);
        if (!file) {
            throw new Error('File not found');
        }
        return file;
    }

    async deleteFile(id) {
        const file = await File.findByPk(id);
        if (!file) {
            throw new Error('File not found');
        }

        const filePath = path.join(uploadDir, `${file.id}${file.extension}`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await file.destroy();
    }

    async downloadFile(id) {
        const file = await File.findByPk(id);
        if (!file) {
            throw new Error('File not found');
        }

        const filePath = path.join(uploadDir, `${file.id}${file.extension}`);
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found on server');
        }

        return { file, filePath };
    }

    async updateFile(id, file) {
        const { originalname, mimetype, size } = file;
        const extension = path.extname(originalname);
        const name = path.basename(originalname, extension);

        const existingFile = await File.findByPk(id);
        if (!existingFile) {
            throw new Error('File not found');
        }

        const oldFilePath = path.join(uploadDir, `${existingFile.id}${existingFile.extension}`);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }

        const newFilePath = path.join(uploadDir, `${existingFile.id}${extension}`);
        fs.writeFileSync(newFilePath, file.buffer);

        existingFile.name = name;
        existingFile.extension = extension;
        existingFile.mimeType = mimetype;
        existingFile.size = size;
        existingFile.uploadDate = new Date();

        await existingFile.save();

        return existingFile;
    }
}

module.exports = new FileService();
