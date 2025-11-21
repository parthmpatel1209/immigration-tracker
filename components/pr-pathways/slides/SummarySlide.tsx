import { ExternalLink } from "lucide-react";
import styles from "../PRPathways.module.css";

interface SummarySlideProps {
  p: any;
  darkMode: boolean;
}

export function SummarySlide({ p, darkMode }: SummarySlideProps) {
  return (
    <div className="space-y-6">
      <p
        className={`text-base leading-relaxed ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {p.summary || "No summary available."}
      </p>

      {p.url && (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Official Details <ExternalLink size={18} className="inline ml-2" />
        </a>
      )}
    </div>
  );
}
