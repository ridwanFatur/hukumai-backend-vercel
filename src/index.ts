import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config()

const app = express()

const corsOrigins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || [];

app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (corsOrigins.includes(origin)) {
		res.header("Access-Control-Allow-Origin", origin);
		res.header("Access-Control-Allow-Credentials", "true");
		res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
		res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
	}

	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}

	next();
});

app.get('/', (req, res) => {
	res.json({ message: 'App is Ready!' });
});

app.get('/env', (req, res) => {
	res.json({ cors_origins: corsOrigins });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app
