// @ts-nocheck
import { useEffect, useState, useRef } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import hash from 'object-hash';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Navbar from '../../components/Navbar';
import SideNavbar from '../../components/SideNavbar';
//eslint-disable-next-line
import { getProfile, updateProfile, getProfileImage } from '../../data/user';

const PersonalInfo = () => {
    // Access the client
    const queryClient = useQueryClient();

    const userProfileRaw = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        refetchOnWindowFocus: false,
        staleTime: 300000,
    });

    const userProfileImageRaw = useQuery({
        queryKey: ['profileImage'],
        queryFn: getProfileImage,
        refetchOnWindowFocus: false,
        staleTime: 300000,
    });

    interface profileData {
        email?: string;
        firstName?: string;
        lastName?: string;
        phoneNo?: string;
        birthday?: string;
        gender?: string;
        profileImage?: string | null;
    }

    const initData: profileData = {
        email: userProfileRaw?.data?.email ?? '',
        firstName: userProfileRaw?.data?.firstName ?? '',
        lastName: userProfileRaw?.data?.lastName ?? '',
        phoneNo: userProfileRaw?.data?.phoneNo ?? '',
        birthday: userProfileRaw?.data?.birthday ?? '',
        gender: userProfileRaw?.data?.gender ?? '',
        profileImage: '',
    };

    const [userProfileView, setUserProfileView] = useState<profileData>(initData);

    const loadUserProfileView = ({ loadProfile = false, loadProfileImage = false }) => {
        if (loadProfile && userProfileRaw.isSuccess) {
            setUserProfileView((prevState) => ({
                ...prevState,
                ...userProfileRaw.data,
            }));
        }

        if (loadProfileImage && userProfileImageRaw.isSuccess) {
            setUserProfileView((prevState) => ({
                ...prevState,
                profileImage: userProfileImageRaw.data.profileImage
                    ? `data:image/jpeg;base64,${userProfileImageRaw.data.profileImage}`
                    : '',
            }));
        }
    };

    useEffect(() => {
        loadUserProfileView({ loadProfile: true });
    }, [userProfileRaw.dataUpdatedAt]);

    useEffect(() => {
        loadUserProfileView({ loadProfileImage: true });
    }, [userProfileImageRaw.dataUpdatedAt]);

    const updateUserProfile = useMutation({
        mutationFn: updateProfile,
    });

    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

    // TODO --- IMPLEMENT THIS USING WEBWORKER //
    const syncSaveButton = () => {
        if (userProfileRaw?.data && userProfileImageRaw?.data?.profileImage) {
            const userProfileRawTemp = {
                ...userProfileRaw.data,
                profileImage: userProfileImageRaw.data.profileImage
                    ? `data:image/jpeg;base64,${userProfileImageRaw.data.profileImage}`
                    : '',
            };
            if (hash(userProfileRawTemp) !== hash(userProfileView)) {
                setSaveButtonEnabled(true);
            } else {
                setSaveButtonEnabled(false);
            }
        }
    };

    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutId.current !== null) {
            clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
            syncSaveButton();
        }, 500);
    }, [userProfileView]);

    const [file, setFile] = useState<File | null>(null);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2 && typeof reader.result === 'string') {
                    setUserProfileView((prevState) => ({
                        ...prevState,
                        profileImage: reader.result as string,
                    }));
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div className='flex h-screen w-full flex-col items-stretch justify-start text-left'>
            <Navbar navbarType='app' />
            <div className='flex h-full w-full flex-row items-stretch' id='app-screen'>
                <SideNavbar />
                <div className='flex flex-1 items-center justify-center' id='page-content-outer'>
                    <ToastContainer />
                    <div
                        className='flex-0 flex h-5/6 w-2/3 flex-col items-center justify-center rounded-lg border-2 bg-gray-50'
                        id='page-content-inner'
                    >
                        <div
                            className='flex flex-1 flex-col items-center justify-center gap-2'
                            id='profile-picture-section'
                        >
                            {userProfileView.profileImage ? (
                                <img
                                    className='relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border-2 bg-white'
                                    alt=''
                                    src={userProfileView.profileImage}
                                />
                            ) : (
                                <div className='flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-2 bg-white'>
                                    <Avatar email={userProfileView.email} />
                                </div>
                            )}
                            <Button
                                label='Update Photo'
                                buttonType='light'
                                labelClassName='text-gray-700'
                            >
                                <input
                                    type='file'
                                    onChange={onFileChange}
                                    className='absolute cursor-pointer opacity-0'
                                    id='profileImage'
                                />
                            </Button>
                            {/*<Button label="Remove Photo" buttonType="light" labelClassName="text-red-500"/>*/}
                        </div>
                        <div
                            className='flex flex-1 flex-col items-stretch justify-center gap-10'
                            id='profile-data-section'
                        >
                            <span
                                className='relative flex w-full flex-row justify-center gap-2'
                                id='name'
                            >
                                <div className='relative w-full' id='first-name'>
                                    <label
                                        htmlFor='firstName'
                                        className='absolute -top-5 left-0 inline-block rounded bg-gray-50 px-1 text-sm font-medium text-gray-700'
                                    >
                                        First Name
                                    </label>
                                    <input
                                        type='text'
                                        name='firstName'
                                        id='firstName'
                                        className='w-full rounded-md px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:text-sm sm:leading-6'
                                        placeholder='Jane'
                                        onChange={(e) => {
                                            setUserProfileView((prevState) => ({
                                                ...prevState,
                                                firstName: e.target.value,
                                            }));
                                        }}
                                        value={userProfileView.firstName}
                                        required
                                        title='Please enter first name'
                                    />
                                </div>

                                <div className='relative w-full' id='last-name'>
                                    <label
                                        htmlFor='lastName'
                                        className='absolute -top-5 left-0 inline-block rounded bg-gray-50 px-1 text-sm font-medium text-gray-700'
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        type='text'
                                        name='lastName'
                                        id='lastName'
                                        className='w-full rounded-md px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:text-sm sm:leading-6'
                                        placeholder='Smith'
                                        value={userProfileView.lastName}
                                        onChange={(e) => {
                                            setUserProfileView((prevState) => ({
                                                ...prevState,
                                                lastName: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </span>

                            <div className='relative flex'>
                                <label
                                    htmlFor='email'
                                    className='absolute -top-5 left-0 inline-block rounded bg-gray-50 px-1 text-sm font-medium text-gray-700'
                                >
                                    Email
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    id='email'
                                    className='w-full rounded-md px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:text-sm sm:leading-6'
                                    placeholder='jane@example.com'
                                    value={userProfileView.email}
                                    onChange={(e) => {
                                        setUserProfileView((prevState) => ({
                                            ...prevState,
                                            email: e.target.value,
                                        }));
                                    }}
                                    disabled
                                    title='Please enter email'
                                />
                            </div>
                            <div className='relative flex'>
                                <label
                                    htmlFor='email'
                                    className='absolute -top-5 left-0 inline-block rounded bg-gray-50 px-1 text-sm font-medium text-gray-700'
                                >
                                    Phone No.
                                </label>
                                <input
                                    type='tel'
                                    name='phoneNo'
                                    id='phoneNo'
                                    className='w-full rounded-md px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:text-sm sm:leading-6'
                                    placeholder='00-000-00000'
                                    value={userProfileView.phoneNo}
                                    onChange={(e) => {
                                        setUserProfileView((prevState) => ({
                                            ...prevState,
                                            phoneNo: e.target.value,
                                        }));
                                    }}
                                    title='Please enter phone no.'
                                />
                            </div>
                            <div
                                className='flex flex-1 flex-row items-center justify-center gap-4'
                                id='form-button-group'
                            >
                                <Button
                                    label='Discard changes'
                                    buttonType='light'
                                    labelClassName='text-gray-700'
                                    onClick={() => {
                                        loadUserProfileView({
                                            loadProfile: true,
                                            loadProfileImage: true,
                                        });
                                    }}
                                />
                                <Button
                                    label='Save changes'
                                    buttonType='dark'
                                    buttonClassName={
                                        !saveButtonEnabled ? 'pointer-events-none bg-gray-500' : ''
                                    }
                                    onClick={async () => {
                                        console.log('Saving', userProfileView);
                                        await updateUserProfile.mutateAsync(
                                            {
                                                firstName: userProfileView.firstName,
                                                lastName: userProfileView.lastName,
                                                phoneNo: userProfileView.phoneNo,
                                                file: file,
                                            },
                                            {
                                                onError: (error: unknown) => {
                                                    if (error instanceof Error) {
                                                        toast.error(error.message);
                                                    } else {
                                                        // Handle other cases if necessary, or use a default error message
                                                        toast.error('An error occurred');
                                                    }
                                                },
                                                onSuccess: () => {
                                                    toast.success('User profile updated!');
                                                    queryClient.invalidateQueries(['profile']);
                                                    queryClient.invalidateQueries(['profileImage']);
                                                },
                                            },
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
