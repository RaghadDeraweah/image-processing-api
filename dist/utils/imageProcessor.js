var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class ImageProcessor {
    static processImage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filename, width, height, format } = params;
            // Validate inputs
            if (!filename)
                throw new Error('Filename is required');
            if (!width || !height)
                throw new Error('Width and height are required');
            if (width <= 0 || height <= 0)
                throw new Error('Width and height must be positive numbers');
            // Extract name and extension
            const fileExt = path.extname(filename).toLowerCase();
            const baseName = path.basename(filename, fileExt);
            if (!fileExt) {
                throw new Error('Filename must include extension (e.g., image.jpg, photo.png)');
            }
            const inputPath = path.join(this.fullImagesPath, filename);
            // Handle undefined format by providing a default
            const outputFormat = format || path.extname(filename).replace('.', '') || 'jpg';
            const outputFilename = `${baseName}_${width}x${height}.${outputFormat}`;
            const outputPath = path.join(this.thumbImagesPath, outputFilename);
            // Check if output already exists
            try {
                yield fs.access(outputPath);
                return outputPath;
            }
            catch (error) {
                // File doesn't exist, proceed with processing
            }
            // Check if input file exists
            try {
                yield fs.access(inputPath);
            }
            catch (error) {
                throw new Error(`Input file not found: ${filename}`);
            }
            // Process image with format-specific settings
            try {
                const sharpInstance = sharp(inputPath).resize(width, height);
                // Set output format with appropriate options
                switch (outputFormat) {
                    case 'jpg':
                    case 'jpeg':
                        sharpInstance.jpeg({ quality: 90 });
                        break;
                    case 'png':
                        sharpInstance.png({ compressionLevel: 9 });
                        break;
                    case 'webp':
                        sharpInstance.webp({ quality: 90 });
                        break;
                    case 'avif':
                        sharpInstance.avif({ quality: 90 });
                        break;
                    default:
                        sharpInstance.jpeg({ quality: 90 }); // Default to jpeg
                }
                yield sharpInstance.toFile(outputPath);
                return outputPath;
            }
            catch (error) {
                throw new Error(`Failed to process image: ${error}`);
            }
        });
    }
    static imageExists(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.access(path.join(this.fullImagesPath, filename));
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
}
ImageProcessor.fullImagesPath = path.join(__dirname, '../../assets/full');
ImageProcessor.thumbImagesPath = path.join(__dirname, '../../assets/thumb');
//# sourceMappingURL=imageProcessor.js.map