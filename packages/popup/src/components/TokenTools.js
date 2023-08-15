import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';

export function cleanupUserSession(navigate){
    Cookies.remove('accessToken');
    Cookies.remove('idToken');
    Cookies.remove('refreshToken');
    navigate('/');
    console.log("Session cleaned up!");
}

export async function isUserSessionValid(){
    const tokenCookie = Cookies.get('accessToken');
    if (!tokenCookie) {
      return false;
    }

    const decodedToken = jwt_decode(tokenCookie);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();

    if (expirationTime < currentTime) {
      return false
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/v1/auth/status?token=${tokenCookie}`);
      console.log(response);
      if (response.data.logged_in) {
        console.log("User is logged in!");
        return true;
      } else {
        console.log("User is logged out!");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
}

export async function checkUserSession(navigate, context) {
  const flag = await isUserSessionValid();
  if(flag && context === "login"){
    navigate("/app-home");
  }
  else if(!flag){
    cleanupUserSession(navigate);
  }

}


export function useTokenExpiration(context) {
  const shouldCheck = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    if(shouldCheck.current){
      checkUserSession(navigate, context);
      shouldCheck.current = false;
    }
    const intervalId = setInterval(() => {
      checkUserSession(navigate, context);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);
}
