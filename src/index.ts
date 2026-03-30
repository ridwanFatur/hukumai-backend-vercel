import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOrigins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || [];

app.use(cors({
	origin: function (origin, callback) {
		if (!origin) return callback(null, true)

		if (corsOrigins.includes(origin)) {
			return callback(null, true)
		}

		return callback(new Error("Not allowed by CORS"))
	},
	credentials: true,
}))

app.get('/', (req, res) => {
	res.json({ message: 'App is Ready!' });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app
