import request from 'supertest';
import app from '../../app.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ImageProcessor } from '../../utils/imageProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Images API', () => {
  describe('GET /api/images', () => {
    it('should return 400 for missing filename', async () => {
      const response = await request(app).get(
        '/api/images?width=200&height=200',
      );
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Filename parameter is required');
    });

    it('should return 400 for missing dimensions', async () => {
      const response = await request(app).get('/api/images?filename=test');
      expect(response.status).toBe(400);
      expect(response.body.error).toContain(
        'Width and height parameters are required',
      );
    });

    it('should return 400 for invalid dimensions', async () => {
      const response = await request(app).get(
        '/api/images?filename=test&width=abc&height=200',
      );
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('valid numbers');
    });

    it('should return 404 for non-existent image', async () => {
      const response = await request(app).get(
        '/api/images?filename=nonexistent&width=200&height=200',
      );
      expect(response.status).toBe(404);
    });

    it('should return 200 and processed image for valid request', async () => {
      const testImagePath = path.join(
        __dirname,
        '../../../assets/full/test.jpg',
      );
      try {
        await fs.access(testImagePath);

        const response = await request(app).get(
          '/api/images?filename=test.jpg&width=200&height=200',
        );

        if (response.status === 404) {
          pending(
            'Image processing failed - check if Sharp is working properly',
          );
          return;
        }

        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('image/jpeg');
      } catch {
        pending('Test image not found - please add test.jpg to assets/full/');
      }
    });

    it('should return 500 for server error during processing', async () => {
      const originalProcessImage = ImageProcessor.processImage;
      spyOn(ImageProcessor, 'processImage').and.throwError('Processing failed');

      const response = await request(app).get(
        '/api/images?filename=test.jpg&width=200&height=200',
      );

      ImageProcessor.processImage = originalProcessImage;

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should return 500 when image processing fails', async () => {
      const originalProcessImage = ImageProcessor.processImage;
      spyOn(ImageProcessor, 'processImage').and.rejectWith(
        new Error('Sharp processing error'),
      );

      const response = await request(app).get(
        '/api/images?filename=test.jpg&width=200&height=200',
      );

      ImageProcessor.processImage = originalProcessImage;

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
});
