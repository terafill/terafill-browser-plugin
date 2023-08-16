// @ts-nocheck
import React, { Fragment } from 'react';

import {
    ChartPieIcon,
    HomeIcon,
    UsersIcon,
    ShieldCheckIcon,
    // UserIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

const navigation = [
    { name: 'Home', href: '/app/home', icon: HomeIcon, comingSoon: false },
    // { name: 'Profile', href: '/app/profile', icon: UserIcon, comingSoon: false },
    { name: 'Security', href: '/app/security', icon: ShieldCheckIcon, comingSoon: true },
    { name: 'Sharing', href: '/app/sharing', icon: UsersIcon, comingSoon: true },
    { name: 'Dashboard', href: '/app/dashboard', icon: ChartPieIcon, comingSoon: true },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function SideNavbar() {
    return (
        <>
            <div className='flex-0 flex h-full w-24 justify-center border-r bg-black'>
                <ul role='list' className='flex flex-1 flex-col items-center justify-around p-4'>
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            disabled={true}
                            className={item.comingSoon ? 'pointer-events-none' : ''}
                        >
                            {({ isActive }) => (
                                <li
                                    key={item.name}
                                    className='flex h-24 w-24 flex-1 cursor-pointer p-2'
                                >
                                    <div
                                        className={classNames(
                                            isActive
                                                ? 'flex flex-1 flex-col items-center justify-around bg-gray-800 text-white'
                                                : 'flex flex-1 flex-col items-center justify-around text-gray-400 hover:bg-gray-800 hover:text-white',
                                            'group rounded-md text-sm font-semibold',
                                        )}
                                    >
                                        <item.icon className='flex-0 flex h-8 w-8' />
                                        <p className='flex'>{item.name}</p>
                                        {item.comingSoon && (
                                            <p className='rounded-sm bg-black p-[2px] text-xs text-gray-500'>
                                                coming soon
                                            </p>
                                        )}
                                    </div>
                                </li>
                            )}
                        </NavLink>
                    ))}
                </ul>
            </div>
        </>
    );
}
