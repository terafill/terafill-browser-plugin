// @ts-nocheck
import { useEffect, useRef } from 'react';

import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { getLoginStatus } from '../data/auth';

export function cleanupUserSession(navigate) {
    Cookies.remove('sessionToken');
    Cookies.remove('sessionId');
    if (navigate) {
        navigate('/');
    }
    console.log('Session cleaned up!');
}

export async function isUserSessionValid() {
    try {
        const { loggedIn } = await getLoginStatus();
        return loggedIn || false;
    } catch (error) {
        return false;
    }
}

export async function checkUserSession(navigate) {
    if (!(await isUserSessionValid())) {
        console.warn('Not Logged In!');
        cleanupUserSession(navigate);
    } else {
        console.warn('Logged In!');
    }
    if(chrome?.runtime.sendMessage){
        chrome.runtime.sendMessage({ greeting: "hello" })
    }
}

export function useTokenExpiration() {
    const shouldCheck = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldCheck.current) {
            checkUserSession(navigate);
            shouldCheck.current = false;
        }
        const intervalId = setInterval(() => {
            checkUserSession(navigate);
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);
}
