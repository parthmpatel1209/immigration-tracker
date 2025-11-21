import styles from "../PRPathways.module.css";

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
      <h4 className={styles.keyPoints}>Key Requirements</h4>

      {items.length > 0 ? (
        <ul className="space-y-3 text-base leading-relaxed">
          {items.map((item: string, i: number) => {
            const formattedItem = capitalizeFirstLetter(item);

            return (
              <li key={i} className="flex items-start gap-3">
                <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
                  {formattedItem}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="italic text-gray-500 dark:text-gray-400">
          No specific requirements listed
        </p>
      )}
    </div>
  );
}
