import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
		clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
	}),
});

export const db = admin.firestore();
export const storage = admin.storage();