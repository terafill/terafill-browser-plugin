// @ts-nocheck
import React, { memo, useState, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { MenuItem } from './Menu';
import PortalPopup from './PortalPopup';
import SignoutPopup from './SignoutPopup';
import { cleanupUserSession } from './TokenTools';
import { logoutUser } from '../data/auth';

type ProfileMenuProps = {
    onClose?: () => void;
    // ... other props
};

const ProfileMenu: React.FC<ProfileMenuProps> = () => {

    const [isSignoutPopupOpen, setSignoutPopupOpen] = useState(false);
    const navigate = useNavigate();

    const onSignoutConfirm = useCallback(() => {
        // Signout
        logoutUser()
            .then(function () {
                cleanupUserSession(null);
                console.log('Session cleaned up!');
            })
            .catch(function (error) {
                console.log(error);
                if (error?.response?.data?.detail) {
                    const errorMessage = error.response.data.detail;
                    console.log(errorMessage);
                    alert([errorMessage]);
                } else {
                    alert([`Something went wrong: ${error}.`]);
                }
            });
        navigate('/');
    }, []);

    const openSignoutPopup = useCallback(() => {
        setSignoutPopupOpen(true);
    }, []);

    const closeSignoutPopup = useCallback(() => {
        setSignoutPopupOpen(false);
    }, []);

    return (
        <>
            <div className='relative flex max-h-full max-w-full flex-col items-center justify-center overflow-hidden rounded-md border bg-black'>
                <div className='flex w-[200px] flex-col items-center justify-center gap-2 overflow-hidden px-2 py-2'>
                    <MenuItem menuItem='Home' onClick={() => navigate('/app/home')} />
                    {/*<MenuItem menuItem="Settings" onClick={()=>navigate("/settings")}/>*/}
                    {/*<MenuItem menuItem='Download App' />*/}
                    {/*<MenuItem menuItem='Import' onClick={() => navigate('/import')} />*/}
                    {/*<MenuItem menuItem={`Help & Support`} onClick={() => navigate('/help-and-support')} />*/}
                    <MenuItem menuItem='Sign Out' onClick={openSignoutPopup} />
                </div>
            </div>
            {isSignoutPopupOpen && (
                <PortalPopup
                    overlayColor='rgba(113, 113, 113, 0.3)'
                    placement='Centered'
                    onOutsideClick={closeSignoutPopup}
                >
                    <SignoutPopup onConfirm={onSignoutConfirm} onClose={closeSignoutPopup} />
                </PortalPopup>
            )}
        </>
    );
};

export default memo(ProfileMenu);
