// import React from 'react';

// import { HiBugAnt } from 'react-icons/hi2';
// import { RiLightbulbFlashFill, RiCustomerService2Fill } from 'react-icons/ri';

// import Button from '../../components/Button';
// import Navbar from '../../components/Navbar';
// import { useTokenExpiration } from '../../components/TokenTools';

// const HelpSupport = () => {
//     useTokenExpiration();

//     return (
//         <div className='bg-background-light-gray relative flex h-screen w-full flex-col items-center justify-start'>
//             <Navbar navbarType='app' />
//             <div className='bg-font-light relative flex flex-1 flex-row items-center justify-center gap-8 self-stretch overflow-hidden'>
//                 <Button
//                     label='Request a feature'
//                     buttonType='light'
//                     buttonClassName='group gap-[8px] px-8 py-4'
//                     iconComponent={<RiLightbulbFlashFill />}
//                     iconClassName='relative shrink-0 text-green-500'
//                 />
//                 <Button
//                     label='Submit a bug'
//                     buttonType='light'
//                     buttonClassName='gap-[8px] px-8 py-4'
//                     iconComponent={<HiBugAnt />}
//                     iconClassName='relative shrink-0 text-red-500'
//                 />
//                 <Button
//                     label='Contact customer care'
//                     buttonType='light'
//                     buttonClassName='gap-[8px] px-8 py-4'
//                     iconComponent={<RiCustomerService2Fill />}
//                     iconClassName='relative shrink-0 text-blue-600'
//                 />
//             </div>
//         </div>
//     );
// };

// export default HelpSupport;
