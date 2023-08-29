// @ts-nocheck
import React, { useState, memo } from 'react';

import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button';
import { Input } from '../../components/Input';
import Logo from '../../components/Logo';
import { loginUser, getLoginStatus } from '../../data/auth';
import { storeAuthData } from '../../utils/security';

const LoginPage = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const [userData, setUserData] = useState({ email: email || '', password: '' });

    const attemptLogin = async (e) => {
        e.preventDefault();
        const { response, error } = await loginUser(userData.email, userData.password);
        if (error) {
            toast.error(error);
        } else {
            // console.log("This is not getting triggered");
            storeAuthData(userData.email, userData.password, response.keyWrappingKey);
            toast.success('Login successful');
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const currentTab = tabs[0];
                
                // Send a message to the content script
                chrome.tabs.sendMessage(currentTab.id, {"message": "popup_script_login_trigger"});
                console.warn("Message sent to tab");

            });
            navigate('/app/home');
        }
    };

    getLoginStatus().then(async (response)=>{
        const { keyWrappingKey } = await chrome.storage.session.get("keyWrappingKey");
        console.log("keyWrappingKey is: ", keyWrappingKey);
        if(response.loggedIn && keyWrappingKey){
            console.log("Pre-login successful");
            navigate('/app/home');
        }
        else{
            console.log("Pre-login failed", response);
        }
    }).catch(err=>console.error(err))

    return (
        <div className='flex h-screen w-screen flex-col items-center justify-center'>
            <form
                className='flex w-1/2 flex-col items-center justify-center gap-[32px] overflow-hidden px-16 py-16'
                onSubmit={attemptLogin}
            >
                <ToastContainer />
                <Logo variant='mini' className='h-16 w-16' />
                <h4 className='text-center text-3xl font-semibold'>Log in to Terafill</h4>

                <div className='w-2/3'>
                    <Input
                        type='email'
                        name='email'
                        id='email'
                        data-test='email'
                        className='w-full'
                        placeholder='Enter your email addres'
                        onChange={(e) => {
                            setUserData((prevState) => ({
                                ...prevState,
                                email: e.target.value,
                            }));
                        }}
                        value={userData.email}
                        required
                    />
                </div>

                <div className='w-2/3'>
                    <Input
                        type='password'
                        name='password'
                        id='password'
                        data-test='password'
                        className='w-full'
                        placeholder='Enter master password'
                        onChange={(e) => {
                            setUserData((prevState) => ({
                                ...prevState,
                                password: e.target.value,
                            }));
                        }}
                        value={userData.password}
                        required
                    />
                </div>
                <Button
                    buttonType='light'
                    label='Continue'
                    labelClassName='text-gray-800'
                    type='submit'
                    data-test='submit'
                />
            </form>
        </div>
    );
};

export default memo(LoginPage);
