import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
// import { db } from './services/firebase.js'

dotenv.config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.CORS_ORIGINS
	? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
	: [];

const corsOptions = {
	origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
		if (!origin) {
			return callback(null, true);
		}

		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		console.warn(`CORS blocked origin: ${origin}`);
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
	res.json({ message: 'App is Ready!' });
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

export default app
