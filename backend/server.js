import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import bannerRoute from './routes/bannerRoute.js'
import pageRoute from './routes/pageRoutes.js'
import pageAttributeRoute from './routes/pageAttributeRoutes.js'
import { createProxyMiddleware } from 'http-proxy-middleware';
import logRoutes from './routes/logRoutes.js';
import cors from 'cors';
dotenv.config();

const port = process.env.PORT || 8000;

connectDB();
console.log('connected');
const app = express();

app.use(cors({
  origin:
	'https://bms.tractorjunction.com',
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/api/users', userRoutes, bannerRoute);
app.use('/api/page', pageRoute);
app.use('/api/page-attribute', pageAttributeRoute);
app.use(logRoutes);

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
  })
);

// Serve static files without caching
const staticOptions = {
  etag: false,
  maxAge: 0,
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  },
};

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend', 'dist'), staticOptions));

// Catch-all route for serving index.html
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server started on port ${port}`));
