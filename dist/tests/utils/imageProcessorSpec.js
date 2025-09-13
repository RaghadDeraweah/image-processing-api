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
describe('ImageProcessor', () => {
    const testParams = {
        filename: 'test.jpg',
        width: 200,
        height: 200,
    };
    it('should process image successfully with valid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield ImageProcessor.processImage(testParams);
            expect(result).toBeDefined();
            const fileExists = yield fs
                .access(result)
                .then(() => true)
                .catch(() => false);
            expect(fileExists).toBeTrue();
        }
        catch (error) {
            pending('Test image not found - please add test.jpg to assets/full/');
        }
    }));
    it('should throw error for missing filename', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync(ImageProcessor.processImage(Object.assign(Object.assign({}, testParams), { filename: '' }))).toBeRejectedWithError('Filename is required');
    }));
    it('should throw error for non-existent image', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync(ImageProcessor.processImage(Object.assign(Object.assign({}, testParams), { filename: 'nonexistent.jpg' }))).toBeRejectedWithError('Input file not found: nonexistent.jpg');
    }));
    it('should throw error for invalid dimensions', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync(ImageProcessor.processImage(Object.assign(Object.assign({}, testParams), { width: -100, height: 200 }))).toBeRejectedWithError('Width and height must be positive numbers');
    }));
});
//# sourceMappingURL=imageProcessorSpec.js.map