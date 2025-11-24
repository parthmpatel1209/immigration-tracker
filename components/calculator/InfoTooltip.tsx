import React, { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";
import styles from "./InfoTooltip.module.css";

interface InfoTooltipProps {
    content: React.ReactNode;
    title?: string;
}

export default function InfoTooltip({ content, title }: InfoTooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Detect if device is mobile/touch
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Close tooltip when clicking outside on mobile
        if (!isMobile || !isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isMobile]);

    const handleInteraction = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <button
                type="button"
                className={styles.iconButton}
                onClick={handleInteraction}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="More information"
                aria-expanded={isOpen}
            >
                <Info size={16} />
            </button>

            {isOpen && (
                <>
                    {isMobile && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
                    <div className={styles.tooltip}>
                        {title && <div className={styles.tooltipTitle}>{title}</div>}
                        <div className={styles.tooltipContent}>{content}</div>
                        {isMobile && (
                            <button
                                className={styles.closeButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                            >
                                Got it
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
