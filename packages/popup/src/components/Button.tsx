import React, { memo, FC, ReactNode } from 'react';

// import * as React from "react"
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/basic';

interface ButtonProps {
    buttonType?: string;
    buttonClassName?: string;
    onClick?: () => void;
    label: string;
    labelClassName?: string;
    icon?: string;
    iconComponent?: ReactNode;
    iconPosition?: string;
    iconClassName?: string;
    id?: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: FC<React.PropsWithChildren<ButtonProps>> = ({
    buttonType,
    buttonClassName,
    label,
    labelClassName,
    icon,
    iconComponent,
    iconPosition = 'left',
    iconClassName,
    type = 'button',
    ...props
}) => {
    const buttonTypeClassMap = {
        dark: 'bg-black text-white font-medium text-base py-1 px-3 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none transition-all flex flex-row items-center justify-center',
        panel: 'text-blue-400 font-medium text-base py-1 px-3 rounded-lg hover:bg-gray-200 focus:outline-none transition-all flex flex-row items-center justify-center',
        link: 'text-blue-400 font-medium text-base py-1 px-3 rounded-lg hover:bg-blue-50 focus:outline-none transition-all flex flex-row items-center justify-center',
        red: 'bg-red-500 text-white font-medium text-base py-1 px-3 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transition-all flex flex-row items-center justify-center',
        blue: 'bg-blue-500 text-white font-medium text-base py-1 px-3 rounded-lg shadow-md hover:bg-blue-400 focus:outline-none transition-all flex flex-row items-center justify-center',
        light: 'bg-white text-black font-medium text-base py-1 px-3 rounded-lg shadow-all-direction hover:bg-gray-300 focus:outline-none transition-all flex flex-row items-center justify-center',
        lightOutlined: '',
    };

    const labelTypeClassMap = {
        dark: 'cursor-pointer',
        panel: 'cursor-pointer',
        link: 'cursor-pointer',
        red: 'cursor-pointer',
        blue: 'cursor-pointer',
        light: 'cursor-pointer',
        lightOutlined: 'cursor-pointer',
    };

    const iconTypeClassMap = {
        dark: '',
        panel: '',
        link: '',
        red: '',
        blue: '',
        light: '',
        lightOutlined: '',
    };

    if (buttonType == undefined || buttonType == null) {
        buttonType = 'dark';
    }
    return (
        <button
            className={`${buttonTypeClassMap[buttonType]} ${buttonClassName}`}
            type={type}
            {...props}
        >
            {props.children}
            {iconPosition === 'left' && (icon || iconComponent) && (
                <span className={`${iconTypeClassMap[buttonType]} ${iconClassName}`}>
                    {icon ? <img alt='' src={icon} /> : iconComponent}
                </span>
            )}
            {label && (
                <div className={`${labelTypeClassMap[buttonType]} ${labelClassName}`}>{label}</div>
            )}
            {iconPosition === 'right' && (icon || iconComponent) && (
                <span className={`${iconTypeClassMap[buttonType]} ${iconClassName}`}>
                    {icon ? <img alt='' src={icon} /> : iconComponent}
                </span>
            )}
        </button>
    );
};

export default memo(Button);

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline:
                    'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps2
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button2 = React.forwardRef<HTMLButtonElement, ButtonProps2>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button2.displayName = 'Button2';

export { Button2, buttonVariants };
