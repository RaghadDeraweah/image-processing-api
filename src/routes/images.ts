import express, { type Request, type Response } from 'express';
import { ImageProcessor, type ImageProcessingParams } from '../utils/imageProcessor.js';
import path from 'path';

const router = express.Router();

router.get('/api/images', async (req: Request, res: Response): Promise<void> => {
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
    const widthNum = parseInt(width as string, 10);
    const heightNum = parseInt(height as string, 10);

    if (isNaN(widthNum) || isNaN(heightNum)) {
      res.status(400).json({ error: 'Width and height must be valid numbers' });
      return;
    }

    if (widthNum <= 0 || heightNum <= 0) {
      res.status(400).json({ error: 'Width and height must be positive numbers' });
      return;
    }

    // Check if original image exists
    const imageExists = await ImageProcessor.imageExists(filename as string);
    if (!imageExists) {
      res.status(404).json({ error: `Image not found: ${filename}` }); // Removed .jpg from error message
      return;
    }

    // Process image
    const params: ImageProcessingParams = {
      filename: filename as string,
      width: widthNum,
      height: heightNum,
      format: format as string | undefined // Added format here
    };

    const outputPath = await ImageProcessor.processImage(params);
    
    // Set appropriate content type based on output file extension
    const ext = outputPath.split('.').pop()?.toLowerCase();
    if (ext === 'png') {
      res.type('image/png');
    } else if (ext === 'webp') {
      res.type('image/webp');
    } else {
      res.type('image/jpeg');
    }
    
    res.sendFile(path.resolve(outputPath));
    
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;