import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Hash, Users, Calendar, MapPin } from "lucide-react";
import { Draw, BADGE_COLORS, NA } from "./";
import styles from "./CRSScore.module.css";

interface DrawCardProps {
    draw: Draw;
    rank: 1 | 2 | 3;
}

export default function DrawCard({ draw, rank }: DrawCardProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const badge = BADGE_COLORS[draw.program] ?? BADGE_COLORS.default;
    const colors = isDark ? badge.dark : badge.light;

    const formattedDate = dayjs(draw.draw_date, "MM/DD/YYYY", true).isValid()
        ? dayjs(draw.draw_date, "MM/DD/YYYY").format("MMM D, YYYY")
        : NA(draw.draw_date);

    const rankLabel =
        rank === 1 ? "Latest" : rank === 2 ? "2nd Latest" : "3rd Latest";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={styles.drawCard}
            style={
                {
                    "--badge-bg": colors.bg,
                    "--badge-text": colors.text,
                } as React.CSSProperties
            }
        >
            <div className={styles.cardGlass}>
                <div className={styles.cardGlow} />
                <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{rankLabel} Draw</h3>
                    <span className={styles.cardBadge}>{draw.program}</span>
                </header>
                <div className={styles.cardCrs}>
                    <Hash
                        className={styles.cardIcon}
                        style={{ color: isDark ? "#93c5fd" : "#3b82f6" }}
                    />
                    <span className={styles.cardCrsValue}>{NA(draw.crs_cutoff)}</span>
                </div>
                <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                        <Users className={styles.cardIconSm} />
                        <span>
                            {draw.invitations != null
                                ? /^\d+$/.test(draw.invitations)
                                    ? Number(draw.invitations).toLocaleString()
                                    : draw.invitations
                                : "N/A"}
                        </span>
                    </div>
                    <div className={styles.cardStat}>
                        <Calendar className={styles.cardIconSm} />
                        <span>{formattedDate}</span>
                    </div>
                </div>
                <footer className={styles.cardFooter}>
                    <span>Round #{NA(draw.round)}</span>
                    <span className={styles.cardSep}> | </span>
                    <span className={styles.cardProvince}>
                        <MapPin className={styles.cardProvIcon} />
                        {NA(draw.draw_province)}
                    </span>
                </footer>
            </div>
        </motion.div>
    );
}
