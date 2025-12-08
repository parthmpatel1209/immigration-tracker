// components/waitlist/WaitlistSuccess.tsx
import React from 'react';
import styles from './waitlist.module.css';
import { CheckCircle, Zap } from 'lucide-react';

interface WaitlistSuccessProps {
    email?: string;
    onClose?: () => void;
}

export default function WaitlistSuccess({ email, onClose }: WaitlistSuccessProps) {
    return (
        <div className={styles.successCard}>
            <div className={styles.iconWrapper} style={{
                transform: 'none',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                margin: '0 auto 1.5rem',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                <CheckCircle size={32} />
            </div>

            <h2 className={styles.successTitle}>You're on the list!</h2>

            <p className={styles.successDesc}>
                {email ? (
                    <>We've sent a confirmation to <span style={{ color: '#3b82f6', fontWeight: 600 }}>{email}</span>.</>
                ) : (
                    "Thanks for joining! You've secured your spot."
                )}
            </p>

            <div className={styles.valueProp}>
                <div className={styles.bulbIcon}>
                    <Zap size={24} color="#eab308" />
                </div>
                <div>
                    <h5 className={styles.valueTitle}>What happens next?</h5>
                    <p className={styles.valueText}>
                        You'll be the first to know when we launch. In the meantime,
                        explore our free CRS calculator and tools.
                    </p>
                </div>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className={styles.button}
                    style={{ width: '100%', marginTop: '2rem' }}
                >
                    Continue Exploring
                </button>
            )}

            <p className={styles.disclaimer}>
                We respect your inbox. No spam, ever.
            </p>
        </div>
    );
}