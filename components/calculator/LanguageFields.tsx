import React from "react";
import { Info } from "lucide-react";
import styles from "./Calculator.module.css";

interface LanguageFieldsProps {
    prefix?: string; // e.g., "spouse_" or "second_"
    values: Record<string, any>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    title?: string;
    tooltip?: string;
    onViewChart?: (testType: string) => void;
}

// Test type configurations
const TEST_CONFIGS = {
    "IELTS General Training": {
        label: "IELTS General Training",
        min: 0,
        max: 9,
        step: 0.5,
        placeholder: "0.0",
    },
    "CELPIP-General": {
        label: "CELPIP-General",
        min: 0,
        max: 12,
        step: 1,
        placeholder: "0",
    },
    "PTE-Core": {
        label: "PTE-Core",
        min: 10,
        max: 90,
        step: 1,
        placeholder: "10",
    },
    "TEF Canada": {
        label: "TEF Canada (French)",
        min: 0,
        max: 450,
        step: 1,
        placeholder: "0",
    },
    "TCF Canada": {
        label: "TCF Canada (French)",
        min: 0,
        max: 699,
        step: 1,
        placeholder: "0",
    },
} as const;

export default function LanguageFields({
    prefix = "",
    values,
    onChange,
    title,
    tooltip,
    onViewChart,
}: LanguageFieldsProps) {
    const skills = ["listening", "reading", "writing", "speaking"] as const;
    const testTypeName = `${prefix}testType`;
    const currentTestType = values[testTypeName] || "IELTS General Training";
    const config = TEST_CONFIGS[currentTestType as keyof typeof TEST_CONFIGS];

    return (
        <div className={styles.fieldGroup}>
            {title && <span className={styles.subsectionTitle}>{title}</span>}

            {/* Test Type Selector */}
            <div className={styles.fieldGroup} style={{ marginBottom: "1rem" }}>
                <label className={styles.label} htmlFor={testTypeName}>
                    Test Type
                </label>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                    <select
                        id={testTypeName}
                        name={testTypeName}
                        value={currentTestType}
                        onChange={onChange}
                        className={styles.select}
                        style={{ flex: 1 }}
                    >
                        {Object.entries(TEST_CONFIGS).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.label}
                            </option>
                        ))}
                    </select>

                    {/* View CLB Chart Button */}
                    {onViewChart && (
                        <button
                            type="button"
                            onClick={() => onViewChart(currentTestType)}
                            className={styles.clbChartButton}
                            title="View CLB conversion chart"
                        >
                            <Info size={18} />
                            <span>View CLB Chart</span>
                        </button>
                    )}
                </div>
                <p style={{
                    fontSize: "0.8125rem",
                    color: "#6b7280",
                    marginTop: "0.5rem",
                    marginBottom: "0"
                }}>
                    Enter your scores and click 'View CLB Chart' to check your CLB levels right away
                </p>
            </div>

            {/* Score Inputs */}
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
                                placeholder={config.placeholder}
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                value={values[name] || ""}
                                onChange={onChange}
                                className={styles.input}
                                title={tooltip || `${config.label} score (${config.min}–${config.max})`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
