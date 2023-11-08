// @ts-nocheck

// import SRP from '@harshitsaini/srp-js';
import axios, { AxiosError, isAxiosError } from "axios";
import { Buffer } from "buffer/";
// import Cookies from 'js-cookie';
import { z } from "zod";

import { BASE_URL, CLIENT_ID } from "../config";
import { UserAuthResponse } from "../schemas/user";
import {
	getAuthClientDetails,
	getRSAPrivateKey,
	getSRPClient,
} from "../utils/security";

export const initateSignupProcess = async (email: string) => {
	try {
		const data = JSON.stringify({
			email: email,
		});
		const config = {
			method: "post",
			url: `${BASE_URL}/auth/signup`,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			data: data,
		};
		const response = await axios(config);
		return { response: response?.data || {} };
	} catch (error) {
		if (isAxiosError(error)) {
			const errorMessage =
				error?.response?.data?.detail?.info ||
				`Something went wrong: ${error}.`;
			throw Error(errorMessage);
		}
		throw error;
	}
};

export const completeSignupProcess = async (
	email: string,
	password: string,
	verificationCode: string,
	firstName: string,
	lastName: string
) => {
	try {
		// generate verifier and salt
		const [salt, verifier]: [Buffer, Buffer] = await getAuthClientDetails(
			email,
			password
		).then(([salt, verifier]) => {
			return [salt, verifier];
		});

		const encryptedKeyWrappingKey = getRSAPrivateKey(password, true);

		const data = JSON.stringify({
			email: email,
			verificationCode: verificationCode,
			firstName: firstName,
			lastName: lastName,
			verifier: verifier.toString("hex"),
			salt: salt.toString("hex"),
			encryptedKeyWrappingKey: encryptedKeyWrappingKey,
		});

		const config = {
			withCredentials: true,
			method: "post",
			url: `${BASE_URL}/auth/signup/confirm`,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"client-id": CLIENT_ID,
			},
			data: data,
		};

		const response = await axios(config);
		return { response: response?.data || {} };
	} catch (error) {
		if (isAxiosError(error)) {
			const errorMessage =
				error?.response?.data?.detail?.info ||
				`Something went wrong: ${error}.`;
			throw Error(errorMessage);
		}
		throw error;
	}
};

type ErrorResponse = { error: string };

export const getSalt = async (
	email: string
): Promise<z.infer<typeof UserAuthResponse.getSalt.read> | ErrorResponse> => {
	const data = JSON.stringify({
		email: email,
	});

	const config = {
		withCredentials: true,
		method: "post",
		url: `${BASE_URL}/auth/salt`,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"client-id": CLIENT_ID,
		},
		data: data,
	};

	try {
		const response = await axios.request(config);
		return UserAuthResponse.getSalt.read.parse(response?.data);
	} catch (error) {
		if (error instanceof AxiosError) {
			const errorMessage =
				error?.response?.data?.detail?.info ||
				`Something went wrong: ${error}.`;
			throw Error(errorMessage);
		}
		throw error;
	}
};

const initiateLogin = async (
	email: string,
	clientPublicKey: string
): Promise<z.infer<typeof UserAuthResponse.initiateLogin.read>> => {
	const data = JSON.stringify({
		email: email,
		clientPublicKey: clientPublicKey,
	});

	const config = {
		withCredentials: true,
		method: "post",
		url: `${BASE_URL}/auth/login`,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"client-id": CLIENT_ID,
		},
		data: data,
	};
	try {
		const response = await axios(config);
		storeCookies("userId", response.data.userId);
		storeCookies("sessionId", response.data.sessionId);
		return UserAuthResponse.initiateLogin.read.parse(response.data);
	} catch (error) {
		if (isAxiosError(error)) {
			const errorMessage =
				error?.response?.data?.detail?.info ||
				`Something went wrong: ${error}.`;
			throw Error(errorMessage);
		}
		throw error;
	}
};

const storeCookies = (key, value) => {
	chrome.storage.session.set({
		[key]: value,
	});
};

const confirmLogin = async (email: string, clientProof: string) => {
	const data = JSON.stringify({
		email: email,
		clientProof: clientProof,
	});

	const config = {
		withCredentials: true,
		method: "post",
		url: `${BASE_URL}/auth/login/confirm`,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"client-id": CLIENT_ID,
		},
		data: data,
	};
	try {
		const response = await axios(config);
		storeCookies("sessionToken", response.data.sessionToken);

		return UserAuthResponse.confirmLogin.read.parse(response.data);
	} catch (error) {
		if (isAxiosError(error)) {
			const errorMessage =
				error?.response?.data?.detail?.info ||
				`Something went wrong: ${error}.`;
			throw Error(errorMessage);
		}
		throw error;
	}
};

export const loginUser = async (email: string, password: string) => {
	try {
		// Get salt from server
		const saltResponse = await getSalt(email);
		if ("error" in saltResponse) {
			throw Error(saltResponse.error);
		}
		const { salt } = saltResponse;

		// Create SRP Client
		const client = await getSRPClient(email, password, salt);
		const clientPubliKey = client.computeA();
		console.log(
			"clientPubliKey",
			typeof clientPubliKey,
			clientPubliKey,
			typeof client
		);

		// Send A to server and receive B
		const loginResponse = await initiateLogin(
			email,
			Buffer.from(clientPubliKey).toString("hex")
		);
		// if ("error" in loginResponse){
		//   throw Error(loginResponse.error)
		// }
		const { serverPublicKey } = loginResponse;
		client.setB(Buffer.from(serverPublicKey, "hex"));

		const clientProof = client.computeM1();

		// Share proofs and complete login
		const confirmLoginResponse = await confirmLogin(
			email,
			Buffer.from(clientProof).toString("hex")
		);
		// if ("error" in confirmLoginResponse){
		//   throw Error(confirmLoginResponse.error)
		// }
		const { serverProof, keyWrappingKey } = confirmLoginResponse;

		if (client.checkM2(Buffer.from(serverProof, "hex"))) {
			console.warn("Server verified!");
			return {
				response: { keyWrappingKey: keyWrappingKey },
			};
		} else {
			return { error: "Server not verified!" };
		}
	} catch (error) {
		if (isAxiosError(error)) {
			const errorMessage =
				error?.response?.data?.detail?.info ||
				`Something went wrong: ${error}.`;
			throw Error(errorMessage);
		}
		throw error;
	}
};

export const getLoginStatus = async () => {
	try {
		const config = {
			withCredentials: true,
			method: "get",
			url: `${BASE_URL}/auth/status`,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				// Cookie: cookies
			},
		};

		const response = await axios(config);
		return UserAuthResponse.getLoginStatus.read.parse(response?.data);
	} catch (error) {
		if (isAxiosError(error)) {
			const errorMessage =
				error?.response?.data?.detail?.info ||
				`Something went wrong: ${error}.`;
			throw Error(errorMessage);
		}
		throw error;
	}
};

export const logoutUser = () => {
	const config = {
		withCredentials: true,
		method: "post",
		url: `${BASE_URL}/auth/logout`,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	};

	return axios(config);
};
