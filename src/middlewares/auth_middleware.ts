import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "../services/firebase.js";

interface MyJwtPayload extends JwtPayload {
	user_id: string;
}

export const auth_middleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		let authHeader = req.headers.authorization;

		if (!authHeader) {
			res.status(401).json({ message: "Unauthorized: Missing Authorization header" });
			return;
		}

		if (authHeader.startsWith("Bearer ")) {
			authHeader = authHeader.substring(7);
		}

		const token = authHeader;

		const decoded = jwt.verify(
			token,
			process.env.SECRET_KEY as string,
			{ algorithms: [(process.env.ALGORITHM || "HS256") as jwt.Algorithm] }
		) as MyJwtPayload;

		if (!decoded.user_id) {
			res.status(401).json({ message: "Invalid token: user_id missing" });
			return;
		}

		const userRef = db.collection("users").doc(decoded.user_id);
		const userSnap = await userRef.get();

		if (!userSnap.exists) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const userData = userSnap.data();

		(req as Request & { user: any }).user = {
			id: decoded.user_id,
			...userData,
		};

		next();
	} catch (error: any) {
		console.error("JWT Error:", error);

		res.status(401).json({
			message: "Unauthorized - Invalid token",
			error: error.message,
		});
	}
};