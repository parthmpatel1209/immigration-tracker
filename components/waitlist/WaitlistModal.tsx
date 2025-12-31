// components/waitlist/WaitlistModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import WaitlistForm from './WaitlistForm';
import styles from './waitlist.module.css';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
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
        </div>,
        document.body
    );
}