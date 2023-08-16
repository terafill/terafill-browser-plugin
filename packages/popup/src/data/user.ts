// @ts-nocheck
import axios, { AxiosError } from 'axios';

import { BASE_URL } from '../config';
import { UserProfileResponse, UserProfileImageResponse } from '../schemas/user';

export async function getProfile() {
    const requestUrl = `${BASE_URL}/users/me`;
    const config = {
        withCredentials: true,
        method: 'get',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };
    try {
        const response = await axios.request(config);
        return UserProfileResponse.read.parse(response?.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorMessage =
                error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
            throw Error(errorMessage);
        }
    }
}

export async function getProfileImage() {
    const requestUrl = `${BASE_URL}/users/me/profile-image`;
    const config = {
        withCredentials: true,
        method: 'get',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    try {
        const response = await axios(config);
        return UserProfileImageResponse.read.parse(response?.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorMessage =
                error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
            throw Error(errorMessage);
        }
    }
}

export async function updateProfile({
    firstName,
    lastName,
    phoneNo,
    file,
}: {
    firstName: string;
    lastName?: string;
    phoneNo?: string;
    file?: File | null;
}) {
    const formData = new FormData();

    // Append fields to formData
    formData.append('first_name', firstName);

    if (lastName) {
        formData.append('last_name', lastName);
    }
    if (phoneNo) {
        formData.append('phone_no', phoneNo);
    }

    if (file) {
        formData.append('file', file);
    }

    const requestUrl = `${BASE_URL}/users/me`;
    const config = {
        withCredentials: true,
        method: 'put',
        url: requestUrl,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData,
    };

    try {
        await axios(config);
        return null;
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorMessage =
                error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
            throw Error(errorMessage);
        }
    }
}

// const makeAPIRequest = (
//   requestUrl,
//   propogateCredentials,
//   headers,
//   method,
//   requestSchema,
//   responseSchema
// ) => {
//   return async ()=>{
// const config = {
//       withCredentials: propogateCredentials,
//       method: method,
//       url: requestUrl,
//       headers: headers,
//     };

//     try {
//       const response = await axios(config);
//       return response?.data || {};
//     } catch (error) {
//       const errorMessage = error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
//       throw Error(errorMessage);
//     }
//   }
// }
