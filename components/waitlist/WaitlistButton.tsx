// components/waitlist/WaitlistButton.tsx
'use client';

import React, { useState } from 'react';
import WaitlistModal from './WaitlistModal';
import styles from './waitlist.module.css';

interface WaitlistButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'free';
    size?: 'small' | 'medium' | 'large';
    children?: React.ReactNode;
    className?: string;
}

export default function WaitlistButton({
    variant = 'free',
    size = 'medium',
    children = 'Join Free Waitlist',
    className = ''
}: WaitlistButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Combine CSS module classes
    const buttonClass = [
        styles.buttonBase,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ');

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={buttonClass}
            >
                {children}
            </button>

            <WaitlistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}