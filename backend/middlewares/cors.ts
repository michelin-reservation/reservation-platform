import cors from 'cors';

const corsMiddleware = cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://223.130.155.88:5174'
    ],
    credentials: true
});

export default corsMiddleware;