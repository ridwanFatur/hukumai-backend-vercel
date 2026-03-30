import { isValidEmail } from '../utils/email_utils.js';
import { db } from './firebase.js';

export async function getOrCreateUser(email: string, name: string) {
	if (!isValidEmail(email)) {
		throw new Error("Invalid Email Format");
	}

	const existingUserSnapshot = await db
		.collection("users")
		.where("email", "==", email)
		.limit(1)
		.get();

	if (!existingUserSnapshot.empty) {
		const doc = existingUserSnapshot.docs[0];
		return { user: { id: doc.id, ...doc.data() }, created: false };
	}

	const userRef = await db.collection("users").add({
		name,
		email,
		createdAt: new Date(),
	});

	await db.collection("user_tokens").add({
		userId: userRef.id,
		totalTokens: 3,
		createdAt: new Date(),
	});

	const newUserSnapshot = await userRef.get();
	return { user: { id: newUserSnapshot.id, ...newUserSnapshot.data() }, created: true };
}

export async function getUser(id: string) {
	const doc = await db.collection("users").doc(id).get();
	if (!doc.exists) return null;

	return { id: doc.id, ...doc.data() };
}