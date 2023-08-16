// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';

import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button';
import { Input } from '../../components/Input';
import Logo from '../../components/Logo';
// import Navbar from '../../components/Navbar';
import { initateSignupProcess, completeSignupProcess } from '../../data/auth';
import { storeAuthData } from '../../utils/security';

// const countries = [
//   'India',
//   'China',
//   'United States',
//   'Indonesia',
//   'Pakistan',
//   'Brazil',
//   'Nigeria',
//   'Bangladesh',
//   'Russia',
//   'Mexico',
//   'Japan',
//   'Ethiopia',
//   'Philippines',
//   'Egypt',
//   'Vietnam',
//   'DR Congo',
//   'Turkey',
//   'Iran',
//   'Germany',
//   'Thailand',
// ];

export const CreateAccountForm = () => {
    // eslint-disable-next-line
    const [userData, setUserData]: any = useOutletContext();
    const navigate = useNavigate();

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const passwordRepeatRef = useRef<HTMLInputElement | null>(null);

    const createAccountAction = async (e) => {
        e.preventDefault();
        if (
            passwordRef.current?.value &&
            passwordRef.current?.value != passwordRepeatRef.current?.value
        ) {
            toast.error("Passwords don't match!");
        } else {
            const { error } = await initateSignupProcess(userData.email);

            if (error) {
                toast.error(error);
            } else {
                navigate('email-confirmation');
            }
        }
    };

    return (
        <form
            className='flex flex-col items-center justify-center gap-[16px] px-32 py-8'
            onSubmit={createAccountAction}
        >
            <ToastContainer style={{ zIndex: 9999 }} />
            <Logo variant='mini' className='h-16 w-16' />
            <h4 className='leading-[120% relative m-0 text-center text-3xl font-bold'>
                Create your Terafill account
            </h4>

            <span className='relative flex w-2/3 flex-auto flex-row justify-center gap-2' id='name'>
                <div className='relative w-full' id='first-name'>
                    <Input
                        type='text'
                        name='firstName'
                        id='firstName'
                        className='w-full'
                        placeholder='First Name'
                        onChange={(e) => {
                            setUserData((prevState) => ({
                                ...prevState,
                                firstName: e.target.value,
                            }));
                        }}
                        value={userData.firstName}
                        required
                    />
                </div>

                <div className='relative w-full' id='last-name'>
                    <Input
                        type='text'
                        name='lastName'
                        id='lastName'
                        className='w-full'
                        placeholder='Last Name'
                        value={userData.lastName}
                        onChange={(e) => {
                            setUserData((prevState) => ({
                                ...prevState,
                                lastName: e.target.value,
                            }));
                        }}
                    />
                </div>
            </span>

            <div className='relative w-2/3'>
                <Input
                    type='email'
                    name='email'
                    id='email'
                    className='w-full'
                    placeholder='Email address'
                    value={userData.email}
                    onChange={(e) => {
                        setUserData((prevState) => ({ ...prevState, email: e.target.value }));
                    }}
                    required
                />
            </div>
            <div className='relative w-2/3'>
                <Input
                    ref={passwordRef}
                    type='password'
                    name='password'
                    id='password'
                    className='w-full'
                    placeholder='Enter master password'
                    onChange={(e) => {
                        setUserData((prevState) => ({ ...prevState, password: e.target.value }));
                    }}
                    required
                />
            </div>
            <div className='relative w-2/3'>
                <Input
                    ref={passwordRepeatRef}
                    type='password'
                    name='passwordRepeat'
                    id='passwordRepeat'
                    className='w-full'
                    placeholder='Re-enter Master Password'
                    required
                />
            </div>
            <p className='text-destructive-foreground'>
                Note: Memorise this password and keep it safe.
            </p>
            <Button id='submit-button' buttonType='light' label='Create Account' type='submit' />
        </form>
    );
};

export const EmailConfirmationForm = () => {
    // eslint-disable-next-line
    const [userData, setUserData]: any = useOutletContext();
    const navigate = useNavigate();

    const pinInputRefs = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
    ];

    const [pinState, setPinState] = useState(['', '', '', '', '', '']);
    const [pinIdx, setPinIdx] = useState(0);

    // const submitButtonRef = useRef(null);

    useEffect(() => {
        pinInputRefs[pinIdx].current?.focus();
    }, [pinIdx]);

    const handleFocus = (e, index) => {
        if (pinIdx != index) {
            setPinIdx(index);
        } else {
            // Do nothing
        }
    };

    const handleKeyDown = (e) => {
        const { key } = e;
        const tempPin = [...pinState];
        if (e.keyCode === 37 || e.keyCode === 8) {
            if (e.keyCode === 8) {
                tempPin[pinIdx] = '';
                setPinState(tempPin);
            }
            setPinIdx((pinIdx) => Math.max(0, pinIdx - 1));
        } else if (e.keyCode === 39) {
            setPinIdx((pinIdx) => Math.min(pinIdx + 1, pinInputRefs.length - 1));
        } else if (e.keyCode >= 48 && e.keyCode <= 57) {
            tempPin[pinIdx] = key[0];
            setPinState(tempPin);
            setPinIdx((pinIdx) => Math.min(pinIdx + 1, pinInputRefs.length - 1));
        }
    };

    const handleOnPaste = (e) => {
        const text = e.clipboardData.getData('Text');
        let textIdx = 0;
        let curPinIdx = pinIdx;
        const tempPin = [...pinState];
        while (textIdx < text.length && curPinIdx < pinInputRefs.length) {
            const char = text[textIdx];
            if (char >= '0' && char <= '9') {
                tempPin[curPinIdx] = char;
                textIdx += 1;
                curPinIdx += 1;
            } else {
                textIdx += 1;
            }
        }
        setPinState(tempPin);

        if (curPinIdx != pinIdx) {
            setPinIdx(Math.min(curPinIdx, pinInputRefs.length - 1));
        }
    };

    const signupConfirmationAction = async (e) => {
        e.preventDefault();
        const verificationCode = [...pinState].join('');

        const { error } = await completeSignupProcess(
            userData.email,
            userData.password,
            verificationCode,
            userData.firstName,
            userData.lastName,
        );
        if (error) {
            toast.error(error);
        } else {
            storeAuthData(userData.email);
            toast.success('Signup successful');
            navigate('/login');
        }
    };

    return (
        <form
            className='flex flex-col items-center justify-center gap-[32px] overflow-hidden px-32 py-8'
            onSubmit={signupConfirmationAction}
        >
            <ToastContainer style={{ zIndex: 9999 }} />
            <h4 className='text-center text-3xl font-semibold'>Verify your email address</h4>
            <p className='flex shrink-0 items-center text-center text-lg text-muted-foreground'>
                <span className='w-full'>
                    <span>Enter verification code sent to email address</span>
                    <b className='text-foreground'> {userData.email}</b>
                </span>
            </p>
            <div className='flex w-full flex-row justify-evenly'>
                {pinInputRefs.map((_, index) => (
                    <Input
                        key={index}
                        type='number'
                        ref={pinInputRefs[index]}
                        name={`pin-${index}`}
                        id={`pin-${index}`}
                        value={pinState[index]}
                        maxLength={1}
                        className='no-scrollbar m-0 h-16 w-16 overflow-hidden p-0 text-center text-3xl'
                        placeholder='-'
                        onKeyDown={handleKeyDown}
                        // onChange={(e)=>{console.log(`Change ${e.target.value}, id: ${event.target.id}`);}}
                        onFocus={(e) => handleFocus(e, index)}
                        onPaste={handleOnPaste}
                        required
                    />
                ))}
            </div>
            <div className='flex flex-col items-center justify-center'>
                <Button
                    buttonType='dark'
                    labelClassName='text-gray-300'
                    label='Re-send verification code'
                    onClick={async () => {
                        setPinState(['', '', '', '', '', '']);
                        const { error } = await initateSignupProcess(userData.email);
                        if (error) {
                            toast.error(error);
                        } else {
                            toast.success('Verification code sent successfully!');
                        }
                    }}
                    type='reset'
                />
                <Button
                    buttonType='dark'
                    label='Change email address'
                    labelClassName='text-gray-300'
                    onClick={() => {
                        navigate('/signup');
                    }}
                />
            </div>
            <Button
                buttonType='light'
                labelClassName='text-gray-800'
                id='submit-button'
                // ref={submitButtonRef}
                label='Submit'
                type='submit'
            />
        </form>
    );
};

const SignUpPage = () => {
    interface User {
        email?: string;
        firstName?: string;
        lastName?: string;
        phoneNo?: string;
        birthday?: string;
        gender?: string;
        profileImage?: string | null;
        password?: string;
    }

    const [userData, setUserData] = useState<User>({
        email: '',
        firstName: '',
        lastName: '',
        // country: countries[0],
        password: '',
    });

    return (
        <div className='justify-cente flex h-screen w-screen flex-col items-center'>
            {/* <Navbar navbarType='signup' /> */}
            <div className='flex flex-1 flex-col items-center justify-center self-stretch overflow-hidden'>
                <Outlet context={[userData, setUserData]} />
            </div>
        </div>
    );
};

export default SignUpPage;
