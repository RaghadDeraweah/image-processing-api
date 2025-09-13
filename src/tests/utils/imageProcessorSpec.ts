import { ImageProcessor } from '../../utils/imageProcessor.js';
import { promises as fs } from 'fs';
import path from 'path';

describe('ImageProcessor', () => {
  const testParams = {
    filename: 'test',
    width: 200,
    height: 200
  };

  beforeEach(async () => {
    // Create test image if it doesn't exist
    const testImagePath = path.join(__dirname, '../../../assets/full/test.jpg');
    try {
      await fs.access(testImagePath);
    } catch {
      // Create a simple test image
      const { createCanvas } = require('canvas');
      const canvas = createCanvas(400, 400);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 400, 400);
      
      const buffer = canvas.toBuffer('image/jpeg');
      await fs.writeFile(testImagePath, buffer);
    }
  });

  it('should process image successfully with valid parameters', async () => {
    const result = await ImageProcessor.processImage(testParams);
    expect(result).toBeDefined();
    
    // Check if file was created
    const fileExists = await fs.access(result).then(() => true).catch(() => false);
    expect(fileExists).toBeTrue();
  });

  it('should throw error for missing filename', async () => {
    await expectAsync(ImageProcessor.processImage({ ...testParams, filename: '' }))
      .toBeRejectedWithError('Filename is required');
  });

  it('should throw error for non-existent image', async () => {
    await expectAsync(ImageProcessor.processImage({ ...testParams, filename: 'nonexistent' }))
      .toBeRejectedWithError('Input file not found');
  });
});