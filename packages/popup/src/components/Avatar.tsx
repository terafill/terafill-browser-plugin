import React, { useEffect, useState } from 'react';

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-male-sprites';

const Avatar = ({ email }) => {
    const [avatarSvg, setAvatarSvg] = useState('');

    useEffect(() => {
        // Hash the email to create a seed using subtle crypto
        async function generateAvatar() {
            if (!email) {
                return;
            }
            const encoder = new TextEncoder();
            const data = encoder.encode(email);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

            // Use the hash as a seed for the avatar
            const svg = createAvatar(style, {
                seed: hashHex,
                width: 108,
                height: 108,
            });
            setAvatarSvg(svg);
        }

        generateAvatar();
    }, [email]);

    return <div dangerouslySetInnerHTML={{ __html: avatarSvg }} />;
};

export default Avatar;
