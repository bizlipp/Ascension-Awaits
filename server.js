import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Add error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Server Error');
});

// Add logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from dist directory
app.use(express.static('dist'));

// Serve index.html for all routes
app.get('*', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server with callback
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Add error handling for server
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Add graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}); 