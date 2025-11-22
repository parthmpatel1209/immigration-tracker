"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, CheckCircle } from "lucide-react";
import styles from "./DisclaimerModal.module.css";

interface DisclaimerModalProps {
    onClose: () => void;
}

export default function DisclaimerModal({ onClose }: DisclaimerModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
    };

    return (
        <div className={`${styles.overlay} ${isVisible ? styles.visible : ""}`}>
            <div className={`${styles.modal} ${isVisible ? styles.modalVisible : ""}`}>
                {/* Close button */}
                <button
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Close disclaimer"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <AlertTriangle className={styles.icon} size={32} />
                    </div>
                    <h2 className={styles.title}>Important Disclaimer</h2>
                    <div className={styles.betaBadge}>BETA VERSION</div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <p className={styles.mainText}>
                        This CRS Calculator is currently in <strong>BETA</strong> and is being actively developed to ensure maximum accuracy.
                    </p>

                    <div className={styles.infoBox}>
                        <CheckCircle className={styles.checkIcon} size={18} />
                        <div>
                            <h3 className={styles.infoTitle}>Our Commitment</h3>
                            <p className={styles.infoText}>
                                We are continuously working to improve the calculator's accuracy and verify all calculations against official IRCC guidelines.
                            </p>
                        </div>
                    </div>

                    <div className={styles.warningBox}>
                        <AlertTriangle className={styles.warningIcon} size={18} />
                        <div>
                            <h3 className={styles.warningTitle}>Please Note</h3>
                            <p className={styles.warningText}>
                                Always verify your CRS score and eligibility on the{" "}
                                <a
                                    href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    official IRCC website
                                </a>{" "}
                                before making any immigration decisions.
                            </p>
                        </div>
                    </div>

                    <p className={styles.footerText}>
                        This tool is provided for informational purposes only and should not be considered as official immigration advice.
                    </p>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.acceptButton} onClick={handleClose}>
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}
