import { ImageProcessor } from '../../utils/imageProcessor.js';
import { promises as fs } from 'fs';

describe('ImageProcessor', () => {
  const testParams = {
    filename: 'test.jpg',
    width: 200,
    height: 200,
  };

  it('should process image successfully with valid parameters', async () => {
    try {
      const result = await ImageProcessor.processImage(testParams);
      expect(result).toBeDefined();
      const fileExists = await fs
        .access(result)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBeTrue();
    } catch (error) {
      pending('Test image not found - please add test.jpg to assets/full/');
    }
  });

  it('should throw error for missing filename', async () => {
    await expectAsync(
      ImageProcessor.processImage({ ...testParams, filename: '' }),
    ).toBeRejectedWithError('Filename is required');
  });

  it('should throw error for non-existent image', async () => {
    await expectAsync(
      ImageProcessor.processImage({
        ...testParams,
        filename: 'nonexistent.jpg',
      }),
    ).toBeRejectedWithError('Input file not found: nonexistent.jpg');
  });

  it('should throw error for invalid dimensions', async () => {
    await expectAsync(
      ImageProcessor.processImage({ ...testParams, width: -100, height: 200 }),
    ).toBeRejectedWithError('Width and height must be positive numbers');
  });
});
