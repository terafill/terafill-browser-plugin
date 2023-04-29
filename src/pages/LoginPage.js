import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import Cookies from 'js-cookie';
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import Errors from "../components/Alerts";
import { useTokenExpiration } from '../components/TokenTools';


const LoginPage = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({email:'', password:''});
    const [errorList, setErrorList] = useState([]);
    const [isErrorListVisible, setErrorListVisibility] = useState(false);

    useTokenExpiration("login");

    const loginUser = () => {
      var data = JSON.stringify({
        email: userData.email,
        master_password: userData.password
      });

      console.log(`http://localhost:8000/api/v1/auth/login`);

      var config = {
        method: 'post',
        url: `http://localhost:8000/api/v1/auth/login`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data : data
      };

      return axios(config);
   }

    return (
    <div className="bg-gray-100 w-screen h-screen flex flex-col items-center justify-center">
      {/*<Navbar navbarType="login"/>*/}
      <div className="self-stretch flex-1 overflow-hidden flex flex-col items-center justify-center">
     <form
      className="bg-white w-2/3 rounded-xl shadow-[0px_0px_10px_rgba(0,_0,_0,_0.25)] overflow-hidden flex flex-col py-8 px-32 items-center justify-center gap-[32px]"
      onSubmit={(e)=>{
        e.preventDefault();
        setErrorListVisibility(prevState => (false));
        loginUser().then(function (response) {
              console.log(response);
              Cookies.set(`accessToken`, response.data.accessToken, { expires: 7 });
              Cookies.set(`refreshToken`, response.data.refreshToken, { expires: 7 });
              Cookies.set(`idToken`, response.data.idToken, { expires: 7 });
              navigate("/app-home");
            })
            .catch(function (error) {
              console.log(error);
              if (error.response.data.hasOwnProperty('detail')){
                const error_msg = error.response.data.detail;
                console.log(error_msg);
                setErrorList([error_msg]);
              }
              else{
                setErrorList([`Something went wrong: ${error}.`]);
              }
              setErrorListVisibility(prevState => (true));
            });
      }}
      >
        <h4 className="m-0 relative text-3xl leading-[120%] font-bold text-black text-center">Welcome</h4>

        <div className="relative w-2/3">
          <label
            htmlFor="email"
            className="absolute rounded -top-3 left-1 inline-block bg-white px-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full rounded-md px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:text-sm sm:leading-6"
            placeholder="jane@example.com"
            onChange={ (e) =>{setUserData(prevState => ({...prevState, email: e.target.value}))} }
            value={userData.email}
            required
          />
        </div>

        <div className="relative w-2/3">
          <label
            htmlFor="password"
            className="absolute rounded -top-3 left-1 inline-block bg-white px-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full rounded-md px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:text-sm sm:leading-6"
            placeholder="*********"
            onChange={ (e) =>{setUserData(prevState => ({...prevState, password: e.target.value}))} }
            value={userData.password}
            required
          />
        </div>
        { isErrorListVisible &&
          <Errors
            errorList={errorList}
            showAlert={isErrorListVisible}
            setAlertVisibilty={setErrorListVisibility}
            />
        }

        <Button buttonType="dark" label="Submit" type="submit"/>

      </form>
      </div>
    </div>
    );
}

export default LoginPage;