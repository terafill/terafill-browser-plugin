// import React from 'react';

// import { v4 as uuidv4 } from 'uuid';

// import Button from './Button';

// const CardItem = ({ label, label2, text, blockButton, editButton, recoveryButton }) => {
//     return (
//         <div className='flex flex-row justify-evenly'>
//             {label && <label className='flex-1 text-lg'>{label}</label>}
//             {label2 && <label className='flex-1 text-lg'>{label2}</label>}
//             {text && <p className='flex-1 grow-[3] text-lg'>{text}</p>}
//             {blockButton && <Button label='Block' buttonType='red' />}
//             {editButton && <Button label='Edit' buttonType='link' />}
//             {recoveryButton && <Button label='Recovery Kit' buttonType='link' />}
//         </div>
//     );
// };

// const Card = ({
//     cardType,
//     icon,
//     cardLabel,
//     cardLabel2,
//     cardButtonVisible = false,
//     cardBodyData,
// }) => {
//     return (
//         <div
//             className='flex flex-1 flex-col justify-start gap-2 self-stretch rounded-lg border-[0.5px] border-solid px-3 py-3 text-left'
//             id='card'
//         >
//             <div
//                 className='flex h-[4rem] flex-row items-center justify-start gap-2 border-b-[1px] border-solid'
//                 id='card-header'
//             >
//                 {icon && <img className='h-full max-h-full object-contain' alt='' src={icon} />}
//                 <div
//                     className='flex flex-1 flex-col items-start justify-start self-stretch'
//                     id='card-header-data'
//                 >
//                     <b className='flex-1 text-2xl'>{cardLabel}</b>
//                     <b className='flex-1 text-lg font-medium'>{cardLabel2}</b>
//                 </div>
//                 {cardButtonVisible && <Button label='Block' buttonType='red' />}
//             </div>
//             <div className='flex flex-col' id='card-body'>
//                 {cardBodyData.map((cardItemData) => {
//                     const uuid = uuidv4();
//                     if (cardType === 'device') {
//                         return (
//                             <CardItem
//                                 key={uuid}
//                                 label={cardItemData.eventDate}
//                                 text={cardItemData.eventDescription}
//                             />
//                         );
//                     } else if (cardType === 'password') {
//                         return (
//                             <CardItem
//                                 key={uuid}
//                                 label={cardItemData.userName}
//                                 label2={cardItemData.userEmail}
//                                 blockButton={true}
//                             />
//                         );
//                     } else if (cardType === 'user') {
//                         return (
//                             <CardItem
//                                 key={uuid}
//                                 label={cardItemData.passwordAppName}
//                                 label2={cardItemData.passwordUserName}
//                                 blockButton={true}
//                             />
//                         );
//                     } else if (cardType === 'userProfile') {
//                         return (
//                             <CardItem
//                                 key={uuid}
//                                 label={cardItemData.attributeType}
//                                 label2={cardItemData.attributeValue}
//                                 editButton={true}
//                             />
//                         );
//                     } else if (cardType === 'userSecurity') {
//                         return (
//                             <CardItem
//                                 key={uuid}
//                                 id={cardItemData.attributeType}
//                                 label={cardItemData.attributeType}
//                                 editButton={true}
//                                 recoveryButton={true}
//                             />
//                         );
//                     }
//                 })}
//             </div>
//         </div>
//     );
// };

// export default Card;
