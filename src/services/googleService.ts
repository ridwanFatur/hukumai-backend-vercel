import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

interface GoogleUser {
	email: string | null;
	name: string | null;
}

export async function getGoogleUserDetails(authCode: string): Promise<GoogleUser> {
	const tokenUrl = "https://oauth2.googleapis.com/token";

	try {
		const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
			code: authCode,
			client_id: GOOGLE_CLIENT_ID,
			client_secret: GOOGLE_CLIENT_SECRET,
			redirect_uri: GOOGLE_REDIRECT_URI,
			grant_type: "authorization_code",
		}), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
		const { access_token, error } = tokenResponse.data;

		if (error || !access_token) {
			throw new Error("Invalid Auth Code");
		}
		const userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
		const userInfoResponse = await axios.get(userInfoUrl, {
			params: { access_token }
		});
		const userInfo = userInfoResponse.data;

		return {
			email: userInfo.email || null,
			name: userInfo.name || null,
		};
	} catch (err) {
		console.error(err);
		throw new Error("Invalid Auth Code");
	}
}