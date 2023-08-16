import axios, { AxiosError } from 'axios';

// Mock out all top level functions, such as get, put, delete and post:
jest.mock('axios');

import { getProfile } from '../user';

describe('getProfile function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getProfile: success', async () => {
        // Mock successful response
        const userProfile = {
            email: 'test@keylance.io',
            firstName: 'John',
        };
        axios.request = jest.fn().mockResolvedValue({ data: userProfile });

        const result = await getProfile();

        // Verify the result
        expect(result).toEqual(userProfile);
    });

    test('getProfile: schema parse failure', async () => {
        // Mock successful response
        const userProfile = null;
        axios.request = jest.fn().mockResolvedValue({ data: userProfile });

        try {
            await getProfile();
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test('getProfile: schema parse failure', async () => {
        axios.request = jest.fn().mockRejectedValue(new AxiosError('hello'));

        try {
            await getProfile();
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });
});
