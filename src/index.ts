import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config()

const app = express()

const corsOrigins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || []
app.use(cors({
	origin: corsOrigins,
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"]
}))

app.get('/', (req, res) => {
	res.json({ message: 'App is Ready!' });
});

app.get('/env', (req, res) => {
	res.json({ cors_origins: process.env.CORS_ORIGINS });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app
