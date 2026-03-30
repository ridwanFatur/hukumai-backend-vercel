import { Router } from 'express';
import jwt, { Algorithm } from "jsonwebtoken";
import { getGoogleUserDetails } from "../services/googleService.js";
import { getOrCreateUser } from "../services/userService.js";

const router = Router();

router.post("/login", async (req, res) => {
	const { auth_code } = req.body;

	if (!auth_code) {
		return res.status(400).json({ message: "Auth code is required" });
	}

	try {
		const googleAccount = await getGoogleUserDetails(auth_code);
		const { email, name } = googleAccount;

		if (!email) {
			return res.status(400).json({ message: "Google account email not found" });
		}

		const { user, created } = await getOrCreateUser(email, name);
		const algorithm: Algorithm = (process.env.ALGORITHM || "HS256") as Algorithm;

		const token = jwt.sign(
			{
				user_id: user.id,
			},
			process.env.SECRET_KEY!,
			{
				algorithm,
				expiresIn: "1h",
			}
		);

		return res.json({
			user,
			status: created ? "created" : "existing",
			token,
		});
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: "Invalid Auth Code" });
	}
});

router.get('/google/config', (req, res) => {
	res.json({ client_id: process.env.GOOGLE_CLIENT_ID });
});

export default router;