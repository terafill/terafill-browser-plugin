import axios, { AxiosError } from 'axios';

// Mock out all top level functions, such as get, put, delete and post:
jest.mock('axios');

import { getSalt } from '../auth';

describe('getSalt function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getSalt: success', async () => {
        // Mock successful response
        const salt = 'sample_salt';
        axios.request = jest.fn().mockResolvedValue({ data: { salt: salt } });

        // Call the function with a sample email
        const result = await getSalt('test@example.com');

        // Verify the result
        expect(result).toEqual({ salt: salt });
    });

    test('getSalt: schema parse failure', async () => {
        // Mock successful response
        const salt = null;
        axios.request = jest.fn().mockResolvedValue({ data: { salt: salt } });

        // Call the function with a sample email
        try {
            await getSalt('test@example.com');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }

        // Verify the result
        // expect(result).toEqual({ salt: salt });
    });

    test('getSalt: schema parse failure', async () => {
        axios.request = jest.fn().mockRejectedValue(new AxiosError('hello'));

        // Call the function with a sample email
        try {
            await getSalt('test@example.com');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });
});
