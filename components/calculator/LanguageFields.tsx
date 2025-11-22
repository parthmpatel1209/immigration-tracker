import React from "react";
import styles from "./Calculator.module.css";

interface LanguageFieldsProps {
    prefix?: string; // e.g., "spouse_" or "second_"
    values: Record<string, any>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title?: string;
    tooltip?: string;
}

export default function LanguageFields({
    prefix = "",
    values,
    onChange,
    title,
    tooltip = "IELTS band (0–9, step 0.5)",
}: LanguageFieldsProps) {
    const skills = ["listening", "reading", "writing", "speaking"] as const;

    return (
        <div className={styles.fieldGroup}>
            {title && <span className={styles.subsectionTitle}>{title}</span>}
            <div className={styles.compactGrid}>
                {skills.map((skill) => {
                    const name = `${prefix}${skill}`;
                    const label = skill.charAt(0).toUpperCase() + skill.slice(1);

                    return (
                        <div key={name} className={styles.fieldGroup}>
                            <label className={styles.label} htmlFor={name}>
                                {label}
                            </label>
                            <input
                                id={name}
                                name={name}
                                type="number"
                                placeholder="0.0"
                                min={0}
                                max={9}
                                step={0.5}
                                value={values[name] || ""}
                                onChange={onChange}
                                className={styles.input}
                                title={tooltip}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
