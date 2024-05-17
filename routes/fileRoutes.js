const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    uploadFile,
    listFiles,
    getFile,
    deleteFile,
    downloadFile,
    updateFile
} = require('../controllers/fileController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.get('/list', authenticateToken, listFiles);
router.get('/:id', authenticateToken, getFile);
router.delete('/:id', authenticateToken, deleteFile);
router.get('/download/:id', authenticateToken, downloadFile);
router.put('/update/:id', authenticateToken, upload.single('file'), updateFile);

module.exports = router;
