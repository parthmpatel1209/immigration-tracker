"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./ProvinceTicker.module.css";
import MapleIcon from "@/icons/maple.png";

const PROVINCES = [
    "Ontario OINP",
    "British Columbia PNP",
    "Alberta AAIP",
    "Saskatchewan SINP",
    "Manitoba MPNP",
    "Nova Scotia NSNP",
    "New Brunswick NBPNP",
    "Prince Edward Island PEI PNP",
    "Newfoundland & Labrador NLPNP",
    "Yukon YNP",
    "Northwest Territories NTNP",
];

// Duplicating the list to ensure seamless looping
const TICKER_ITEMS = [...PROVINCES, ...PROVINCES, ...PROVINCES];

export default function ProvinceTicker() {
    return (
        <div className={styles.tickerWrapper}>
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
                            duration: 25,
                            ease: "linear",
                        },
                    }}
                >
                    {TICKER_ITEMS.map((item, index) => (
                        <div key={index} className={styles.tickerItem}>
                            <span className={styles.text}>{item}</span>
                            <div className={styles.separator}>
                                <Image
                                    src={MapleIcon}
                                    alt="maple"
                                    width={14}
                                    height={14}
                                    className={styles.icon}
                                    unoptimized // Since it's a local import
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
