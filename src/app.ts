import express from 'express';
import imagesRouter from './routes/images.js';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/', imagesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;