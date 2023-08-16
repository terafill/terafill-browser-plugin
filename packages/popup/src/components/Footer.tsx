import React from 'react';

import { BsTwitter, BsFacebook, BsInstagram } from 'react-icons/bs';
// import { useNavigate } from 'react-router-dom';

import Button from './Button';
import Logo from './Logo';

const Footer = () => {
    // const navigate = useNavigate();
    return (
        <div className='flex flex-row border-t-2 p-12' id='footer'>
            <div className='flex flex-1 pl-4' id='terafill-icon'>
                <Logo variant='full' />
            </div>
            <div className='flex flex-1 flex-row justify-around' id='right-footer'>
                <div className='flex flex-col items-center' id='support-group'>
                    <h6 className='text-lg font-bold' id='Support'>
                        SUPPORT
                    </h6>
                    {/* <Button buttonType='link' label='FAQ' onClick={() => navigate('/faq')} /> */}
                    <a href='mailto:support@keylance.in'>
                        <Button
                            buttonType='dark'
                            label='support@keylance.in'
                            labelClassName='text-gray-400'
                        />
                    </a>
                </div>
                <div className='flex flex-col' id='contact-group'>
                    <h6 className='text-lg font-bold'>FOLLOW US</h6>
                    <div className='flex flex-row justify-between' id='button-group'>
                        <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
                            <BsTwitter size={24} />
                        </a>
                        <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
                            <BsFacebook size={24} />
                        </a>
                        <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
                            <BsInstagram size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
