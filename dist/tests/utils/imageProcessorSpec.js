var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ImageProcessor } from '../../utils/imageProcessor.js';
import { promises as fs } from 'fs';
import path from 'path';
describe('ImageProcessor', () => {
    const testParams = {
        filename: 'test',
        width: 200,
        height: 200
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create test image if it doesn't exist
        const testImagePath = path.join(__dirname, '../../../assets/full/test.jpg');
        try {
            yield fs.access(testImagePath);
        }
        catch (_a) {
            // Create a simple test image
            const { createCanvas } = require('canvas');
            const canvas = createCanvas(400, 400);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, 400, 400);
            const buffer = canvas.toBuffer('image/jpeg');
            yield fs.writeFile(testImagePath, buffer);
        }
    }));
    it('should process image successfully with valid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ImageProcessor.processImage(testParams);
        expect(result).toBeDefined();
        // Check if file was created
        const fileExists = yield fs.access(result).then(() => true).catch(() => false);
        expect(fileExists).toBeTrue();
    }));
    it('should throw error for missing filename', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync(ImageProcessor.processImage(Object.assign(Object.assign({}, testParams), { filename: '' })))
            .toBeRejectedWithError('Filename is required');
    }));
    it('should throw error for non-existent image', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync(ImageProcessor.processImage(Object.assign(Object.assign({}, testParams), { filename: 'nonexistent' })))
            .toBeRejectedWithError('Input file not found');
    }));
});
//# sourceMappingURL=imageProcessorSpec.js.map