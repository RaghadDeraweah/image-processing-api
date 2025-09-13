var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express, {} from 'express';
import { ImageProcessor } from '../utils/imageProcessor.js';
import path from 'path';
const router = express.Router();
router.get('/api/images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { filename, width, height, format } = req.query; // Added format here
        // Validate required parameters
        if (!filename) {
            res.status(400).json({ error: 'Filename parameter is required' });
            return;
        }
        if (!width || !height) {
            res.status(400).json({ error: 'Width and height parameters are required' });
            return;
        }
        // Validate parameter types
        const widthNum = parseInt(width, 10);
        const heightNum = parseInt(height, 10);
        if (isNaN(widthNum) || isNaN(heightNum)) {
            res.status(400).json({ error: 'Width and height must be valid numbers' });
            return;
        }
        if (widthNum <= 0 || heightNum <= 0) {
            res.status(400).json({ error: 'Width and height must be positive numbers' });
            return;
        }
        // Check if original image exists
        const imageExists = yield ImageProcessor.imageExists(filename);
        if (!imageExists) {
            res.status(404).json({ error: `Image not found: ${filename}` }); // Removed .jpg from error message
            return;
        }
        // Process image
        const params = {
            filename: filename,
            width: widthNum,
            height: heightNum,
            format: format // Added format here
        };
        const outputPath = yield ImageProcessor.processImage(params);
        // Set appropriate content type based on output file extension
        const ext = (_a = outputPath.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (ext === 'png') {
            res.type('image/png');
        }
        else if (ext === 'webp') {
            res.type('image/webp');
        }
        else {
            res.type('image/jpeg');
        }
        res.sendFile(path.resolve(outputPath));
    }
    catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
export default router;
//# sourceMappingURL=images.js.map