"use client";
import styles from "./Donate.module.css";
import ShareSupportCard from "./ShareSupportCard";
import AdSenseAd from "@/components/AdSenseAd";

// Load public display email from .env.local
const DISPLAY_EMAIL =
  process.env.NEXT_PUBLIC_INTERAC_DISPLAY_EMAIL ||
  "immigrationdatacanada@gmail.com";

export default function Donate() {
  const handleInteracClick = () => {
    navigator.clipboard.writeText(DISPLAY_EMAIL);
    alert(
      `Copied: ${DISPLAY_EMAIL}\n\n` +
        `Send Interac e-Transfer to this email.\n` +
        `Autodeposit enabled — money arrives instantly and securely!`
    );
  };

  return (
    <>
      <section className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Support This Project</h2>

          <p className={styles.description}>
            I’m building and maintaining this Canadian Immigration Tracker to
            help others — completely free. If you’ve found it useful, you can
            support my work with a small donation. Every bit helps me keep it
            running and improve it.
          </p>

          <div className={styles.buttonGroup}>
            {/* PayPal */}
            <a
              href="https://www.paypal.com/donate/?business=RBB5HMYS2V5KE&no_recurring=0&currency_code=CAD"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.paypalBtn}
            >
              Donate via PayPal
            </a>

            {/* Buy Me a Coffee */}
            <a
              href="https://buymeacoffee.com/immigrationdatacanada"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.coffeeBtn}
            >
              Buy Me a Coffee
            </a>

            {/* Interac e-Transfer */}
            <button onClick={handleInteracClick} className={styles.otherBtn}>
              Interac e-Transfer (🇨🇦)
            </button>
          </div>

          <p className={styles.thanks}>
            Thank you for helping keep this project alive
          </p>

          <ShareSupportCard />
        </div>
        <div className="mt-6">
          <AdSenseAd adSlot="1234567890" />
        </div>
      </section>
    </>
  );
}
