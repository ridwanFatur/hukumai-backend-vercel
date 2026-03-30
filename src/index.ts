import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config()

const app = express()

const corsOrigins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || []

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin) return callback(null, true);

		if (corsOrigins.indexOf(origin) !== -1 || corsOrigins.includes('*')) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	optionsSuccessStatus: 204
};

app.use(cors(corsOptions))

app.get('/', (req, res) => {
	res.json({ message: 'App is Ready!' });
});

app.get('/env', (req, res) => {
	res.json({ cors_origins: corsOrigins });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app
