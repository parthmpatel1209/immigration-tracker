"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./ProvinceTicker.module.css";
import MapleIcon from "@/icons/maple.png";

const PROVINCES = [
    { name: "Ontario", stream: "OINP", status: "Active" },
    { name: "British Columbia", stream: "BC PNP", status: "Tech / Skilled" },
    { name: "Alberta", stream: "AAIP", status: "Express Entry" },
    { name: "Saskatchewan", stream: "SINP", status: "Occupations In-Demand" },
    { name: "Manitoba", stream: "MPNP", status: "Skilled Worker" },
    { name: "Nova Scotia", stream: "NSNP", status: "Labour Market Priorities" },
    { name: "New Brunswick", stream: "NBPNP", status: "Express Entry Stream" },
    { name: "Prince Edward Island", stream: "PEI PNP", status: "Schedule Verified" },
    { name: "Newfoundland & Labrador", stream: "NLPNP", status: "Priority Skills" },
    { name: "Yukon", stream: "YNP", status: "Critical Impact Worker" },
    { name: "Northwest Territories", stream: "NTNP", status: "Employer-Driven" },
];

const TICKER_ITEMS = [...PROVINCES, ...PROVINCES, ...PROVINCES];

export default function ProvinceTicker() {
    return (
        <div className={styles.tickerWrapper}>
            <div className={styles.leadBadge}>
                <span className={styles.leadDot} />
                <span>PNP Wire</span>
            </div>

            <div className={styles.fadeLeft} />
            <div className={styles.fadeRight} />

            <div className={styles.tickerTrack}>
                <motion.div
                    className={styles.tickerContent}
                    animate={{ x: "-33.33%" }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 35,
                            ease: "linear",
                        },
                    }}
                >
                    {TICKER_ITEMS.map((item, index) => (
                        <div key={index} className={styles.tickerItem}>
                            <span className={styles.provinceName}>{item.name}</span>
                            <span className={styles.streamBadge}>{item.stream}</span>
                            <span className={styles.statusLabel}>{item.status}</span>
                            <div className={styles.separator}>
                                <Image
                                    src={MapleIcon}
                                    alt="maple"
                                    width={12}
                                    height={12}
                                    className={styles.icon}
                                    unoptimized
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
