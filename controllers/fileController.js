const fileService = require('../services/fileService');

const uploadFile = async (req, res) => {
    try {
        const file = await fileService.uploadFile(req.file);
        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const listFiles = async (req, res) => {
    try {
        const { page = 1, list_size = 10 } = req.query;
        const files = await fileService.listFiles(page, list_size);
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFile = async (req, res) => {
    try {
        const file = await fileService.getFile(req.params.id);
        res.json(file);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteFile = async (req, res) => {
    try {
        await fileService.deleteFile(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const downloadFile = async (req, res) => {
    try {
        const { file, filePath } = await fileService.downloadFile(req.params.id);
        res.download(filePath, `${file.name}${file.extension}`);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateFile = async (req, res) => {
    try {
        const file = await fileService.updateFile(req.params.id, req.file);
        res.json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadFile,
    listFiles,
    getFile,
    deleteFile,
    downloadFile,
    updateFile
};
