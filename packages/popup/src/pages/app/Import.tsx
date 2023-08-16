// import React from 'react';

// import Button from '../../components/Button';
// import Navbar from '../../components/Navbar';
// import { useTokenExpiration } from '../../components/TokenTools';

// const Import = () => {
//     useTokenExpiration();

//     const importList = [
//         { label: '1passoword', image: '../1passwordicon@2x.png' },
//         { label: 'Lastpass', image: '../lastpassimage@2x.png' },
//         { label: 'RoboForm', image: '../roboformimage@2x.png' },
//         { label: 'iCloud passwords', image: '../apple.svg' },
//         { label: 'Dashlane', image: '../dashlane.svg' },
//         { label: 'Keepass', image: '../keepassimage@2x.png' },
//         { label: 'Chrome', image: '../chrome@2x.png' },
//         { label: 'Firefox', image: '../firefox-1@2x.png' },
//         { label: 'Keepassxc', image: '../keepassxcimage@2x.png' },
//         { label: 'Thycotic', image: '../thycoticimage@2x.png' },
//         { label: 'Other', image: '../chevronRight.svg' },
//     ];

//     return (
//         <div className='relative flex h-screen w-screen flex-col items-center justify-start'>
//             <Navbar navbarType='app' />
//             <div className='grid flex-1 grid-cols-4 content-center items-center justify-center gap-12'>
//                 {importList.map((importItem) => (
//                     <Button
//                         key={importItem.label}
//                         buttonType='light'
//                         buttonClassName='gap-[8px] px-8 py-4'
//                         label={importItem.label}
//                         icon={importItem.image}
//                         iconClassName='relative w-6 h-6 shrink-0'
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Import;
