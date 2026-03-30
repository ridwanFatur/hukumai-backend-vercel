import { Router, Request, Response } from "express";
import { auth_middleware } from "../middlewares/auth_middleware.js";
import { db } from "../services/firebase.js";

const router = Router();

router.use(auth_middleware);

router.get("/", (req, res) => {
	const user = (req as any).user;
	res.json({ user });
});

router.get("/token", async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;

		if (!user) {
			return res.status(401).json({ message: "User not authenticated" });
		}

		const userTokenRef = db.collection("user_tokens").doc(user.id);
		const snapshot = await userTokenRef.get();

		if (!snapshot.exists) {
			return res.json({
				total_tokens: 0,
			});
		}

		const data = snapshot.data() as {
			total_tokens: number;
			updated_at: string | null;
		};

		return res.json({
			total_tokens: data.total_tokens ?? 0,
			updated_at: data.updated_at,
		});
	} catch (error: any) {
		return res.status(500).json({
			message: "Failed to fetch user token",
			error: error.message,
		});
	}
});

export default router;