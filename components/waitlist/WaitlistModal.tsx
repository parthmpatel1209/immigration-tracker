// components/waitlist/WaitlistModal.tsx
'use client';

import React from 'react';
import WaitlistForm from './WaitlistForm';
import styles from './waitlist.module.css';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <WaitlistForm />
            </div>
        </div>
    );
}