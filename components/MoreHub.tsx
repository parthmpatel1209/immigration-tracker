"use client";

import React from "react";
import {
    MapPin,
    GraduationCap,
    Heart,
    Mail,
    Bell,
    ArrowRight
} from "lucide-react";
import styles from "./MoreHub.module.css";

interface MoreHubProps {
    onNavigateToTab?: (tabName: string) => void;
}

export default function MoreHub({ onNavigateToTab }: MoreHubProps) {
    const sections = [
        {
            title: "Resources & Guides",
            items: [
                {
                    icon: MapPin,
                    label: "PR Pathways",
                    description: "Explore Canadian immigration routes",
                    action: "PR Pathways"
                },
                {
                    icon: GraduationCap,
                    label: "FAQ & What Is...?",
                    description: "Common questions and guides",
                    action: "What Is...?"
                }
            ]
        },
        {
            title: "Join & Support",
            items: [
                {
                    icon: Bell,
                    label: "Early Access",
                    description: "Get notified of new features",
                    action: "Early Access"
                },
                {
                    icon: Heart,
                    label: "Support the Project",
                    description: "Help us keep the data free",
                    action: "Support"
                },
                {
                    icon: Mail,
                    label: "Contact Us",
                    description: "Get in touch for feedback",
                    action: "Contact"
                }
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.sectionsGrid}>
                {sections.map((section, idx) => (
                    <div key={idx} className={styles.section}>
                        <h2 className={styles.sectionTitle}>{section.title}</h2>
                        <div className={styles.itemsGrid}>
                            {section.items.map((item, i) => (
                                <button
                                    key={i}
                                    className={styles.itemCard}
                                    onClick={() => onNavigateToTab?.(item.action)}
                                >
                                    <div className={styles.iconWrapper}>
                                        <item.icon size={24} />
                                    </div>
                                    <div className={styles.content}>
                                        <span className={styles.label}>{item.label}</span>
                                        <span className={styles.description}>{item.description}</span>
                                    </div>
                                    <ArrowRight className={styles.arrow} size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
