import React from 'react';

import { NavLink } from 'react-router-dom';

import Button from './Button';

const SettingsPanel = ({ activeSettingsPanel, setActiveSettingsPanel }) => {
    // const extraBoxShadow = '0px 0px 4px rgba(0, 0, 0, 0.25) inset';
    return (
        <nav className='bg-font-light z-[1] flex flex-col items-center justify-center gap-[64px] self-stretch overflow-hidden bg-white px-4 py-0 shadow-[2px_4px_4px_rgba(0,_0,_0,_0.25)]'>
            <NavLink to='' onClick={() => setActiveSettingsPanel('Personal Info')}>
                <Button
                    buttonType='panel'
                    label='Personal Info'
                    buttonClassName={`${
                        activeSettingsPanel == 'Personal Info' ? 'bg-gray-100' : ''
                    }`}
                />
            </NavLink>
            <NavLink to='security' onClick={() => setActiveSettingsPanel('Security')}>
                <Button
                    buttonType='panel'
                    label='Security'
                    buttonClassName={`${activeSettingsPanel == 'Security' ? 'bg-gray-100' : ''}`}
                />
            </NavLink>
            <NavLink to='sharing/by-user' onClick={() => setActiveSettingsPanel('Sharing')}>
                <Button
                    buttonType='panel'
                    label='Sharing'
                    buttonClassName={`${activeSettingsPanel == 'Sharing' ? 'bg-gray-100' : ''}`}
                />
            </NavLink>
            <NavLink
                to='device-management'
                onClick={() => setActiveSettingsPanel('Device Management')}
            >
                <Button
                    buttonType='panel'
                    label='Device Management'
                    buttonClassName={`${
                        activeSettingsPanel == 'Device Management' ? 'bg-gray-100' : ''
                    }`}
                />
            </NavLink>
        </nav>
    );
};

export default SettingsPanel;
