import { AlertCircle } from "lucide-react";
import styles from "./CRSScore.module.css";

export default function DisclaimerBanner() {
    return (
        <div className={styles.disclaimerBanner}>
            <div className={styles.disclaimerIcon}>
                <AlertCircle />
            </div>
            <div className={styles.disclaimerContent}>
                <h4 className={styles.disclaimerTitle}>Data Accuracy Notice</h4>
                <p className={styles.disclaimerText}>
                    The analytics presented here are based on historical draw data and may contain inaccuracies,
                    especially for the <strong>"Others"</strong> category (French-language, Healthcare, etc.).
                    Always verify official information directly with{" "}
                    <a
                        href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.disclaimerLink}
                    >
                        IRCC (Immigration, Refugees and Citizenship Canada)
                    </a>.
                </p>
            </div>
        </div>
    );
}
