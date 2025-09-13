import request from 'supertest';
import app from '../../app.js';

describe('Images API', () => {
  describe('GET /api/images', () => {
    it('should return 400 for missing filename', async () => {
      const response = await request(app).get('/api/images?width=200&height=200');
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Filename parameter is required');
    });

    it('should return 400 for missing dimensions', async () => {
      const response = await request(app).get('/api/images?filename=test');
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Width and height parameters are required');
    });

    it('should return 400 for invalid dimensions', async () => {
      const response = await request(app).get('/api/images?filename=test&width=abc&height=200');
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('valid numbers');
    });

    it('should return 404 for non-existent image', async () => {
      const response = await request(app).get('/api/images?filename=nonexistent&width=200&height=200');
      expect(response.status).toBe(404);
    });

    it('should return 200 and processed image for valid request', async () => {
      const response = await request(app).get('/api/images?filename=test&width=200&height=200');
      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('image/jpeg');
    });
  });
});