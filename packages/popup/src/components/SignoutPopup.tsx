import React, { memo } from 'react';

import Button from './Button';

const SignoutPopup = ({ onConfirm, onClose }) => {
    return (
        <div className='relative flex max-h-full max-w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border border-gray-600 bg-black px-8 py-8'>
            <b className='relative flex shrink-0 items-center justify-center text-lg'>
                Confirm sign out ?
            </b>
            <div className='flex flex-row items-center justify-center gap-4 self-stretch'>
                <Button buttonType='light' onClick={onClose} label='Cancel' />
                <Button buttonType='light' onClick={onConfirm} label='Confirm' />
            </div>
        </div>
    );
};

export default memo(SignoutPopup);
