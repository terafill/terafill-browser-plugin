import { z } from 'zod';

export const UserAuthResponse = {
    getSalt: {
        read: z.object({
            salt: z.string(),
        }),
    },
    initiateLogin: {
        read: z.object({
            serverPublicKey: z.string(),
        }),
    },
    confirmLogin: {
        read: z.object({
            serverProof: z.string(),
            keyWrappingKey: z.string(),
        }),
    },
    getLoginStatus: {
        read: z.object({
            loggedIn: z.boolean(),
        }),
    },
};

export const UserProfileResponse = {
    read: z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string().optional(),
        phoneNo: z.string().optional(),
        birthday: z.date().optional(),
        gender: z.string().optional(),
    }),
};

export const UserProfileImageResponse = {
    read: z.object({
        profileImage: z.string().optional(),
    }),
};
