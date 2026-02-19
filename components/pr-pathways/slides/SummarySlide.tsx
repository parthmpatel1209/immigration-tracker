import { ExternalLink, FileText } from "lucide-react";
import styles from "../PRPathways.module.css";

interface SummarySlideProps {
  p: any;
  darkMode: boolean;
}

export function SummarySlide({ p, darkMode }: SummarySlideProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <FileText
          size={24}
          className={`flex-shrink-0 mt-1 ${darkMode ? "text-violet-400" : "text-indigo-600"
            }`}
        />
        <p
          className={`text-base leading-relaxed ${darkMode ? "text-gray-200" : "text-gray-700"
            }`}
        >
          {p.summary || "No summary available."}
        </p>
      </div>

      {p.url && (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View Official Details <ExternalLink size={18} className="inline ml-1" />
        </a>
      )}
    </div>
  );
}
