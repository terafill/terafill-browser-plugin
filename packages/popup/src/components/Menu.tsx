import React from 'react';
export const MenuItem = ({ menuItem, onClick }: { menuItem: string; onClick: (e) => void }) => {
    return (
        <button
            className='box-border flex h-8 shrink-0 cursor-pointer flex-row items-center justify-center self-stretch rounded p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            onClick={onClick}
        >
            <b className='relative flex flex-1 items-center justify-center self-stretch text-center text-sm'>
                {menuItem}
            </b>
        </button>
    );
};

// const Menu = () => {

//   return (
//     <>
//     </>
//   );
// };

// export default Menu;
