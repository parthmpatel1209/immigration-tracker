import styles from "../PRPathways.module.css";
import { AlertCircle } from "lucide-react";

interface RequirementsSlideProps {
  p: any;
  darkMode: boolean;
}

export function RequirementsSlide({ p, darkMode }: RequirementsSlideProps) {
  const items =
    p.key_requirements
      ?.split(";")
      .map((s: string) => s.trim())
      .filter(Boolean) || [];

  // Helper: Capitalize first letter of a string
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <AlertCircle size={24} className={darkMode ? "text-violet-400" : "text-indigo-600"} />
        <h4 className={styles.keyPoints}>Key Requirements</h4>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item: string, i: number) => {
            const formattedItem = capitalizeFirstLetter(item);

            return (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`text-base leading-relaxed ${darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                >
                  {formattedItem}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="italic text-gray-500 dark:text-gray-400 text-center py-4">
          No specific requirements listed
        </p>
      )}
    </div>
  );
}
