"use client";

import { useState, useEffect } from "react";
import {
    convertIeltsToCLB,
    calculateCRS,
    BreakdownRow,
} from "@/lib/crs";
import styles from "./Calculator.module.css";
import LanguageFields from "./LanguageFields";
import ResultsBreakdown from "./ResultsBreakdown";
import DisclaimerModal from "./DisclaimerModal";

export default function Calculator() {
    // -------------------------------------------------
    // 1. Data from Supabase
    // -------------------------------------------------
    const [ieltsBenchmarks, setIeltsBenchmarks] = useState<any[]>([]);
    const [crsBreakdown, setCrsBreakdown] = useState<BreakdownRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // -------------------------------------------------
    // 1.5 Disclaimer Modal
    // -------------------------------------------------
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    // -------------------------------------------------
    // 2. Form state
    // -------------------------------------------------
    const [form, setForm] = useState({
        testType: "IELTS General Training",
        listening: "",
        reading: "",
        writing: "",
        speaking: "",
        age: "",
        education: "",
        spouse: false,
        spouse_testType: "IELTS General Training",
        spouse_listening: "",
        spouse_reading: "",
        spouse_writing: "",
        spouse_speaking: "",
        spouse_education: "",
        canadianWork: "",
        foreignWork: "",
        certificate: false,
        secondLanguage: false,
        second_testType: "IELTS General Training",
        second_listening: "",
        second_reading: "",
        second_writing: "",
        second_speaking: "",
        sibling: false,
        educationInCanada: "",
        arrangedEmployment: "",
        nomination: false,
        hasLMIA: false,
    });

    // -------------------------------------------------
    // 3. Results
    // -------------------------------------------------
    const [clb, setClb] = useState<Record<string, number | null> | null>(null);
    const [spouseClb, setSpouseClb] = useState<Record<
        string,
        number | null
    > | null>(null);
    const [secondClb, setSecondClb] = useState<Record<
        string,
        number | null
    > | null>(null);
    const [result, setResult] = useState<{
        agePoints: number;
        educationPoints: number;
        languagePoints: number;
        secondLanguagePoints: number;
        canadianWorkPoints: number;
        spouseEducationPoints: number;
        spouseLanguagePoints: number;
        skillTransferabilityPoints: number;
        additionalPoints: number;
        total: number;
    } | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    // -------------------------------------------------
    // 4. Load data
    // -------------------------------------------------
    useEffect(() => {
        async function load() {
            try {
                const [benchRes, crsRes] = await Promise.all([
                    fetch("/api/language-benchmarks"),
                    fetch("/api/crs-breakdown"),
                ]);

                if (!benchRes.ok) throw new Error(`Language benchmarks failed`);
                if (!crsRes.ok) throw new Error(`CRS breakdown failed`);

                const [benchJson, crsJson] = await Promise.all([
                    benchRes.json(),
                    crsRes.json(),
                ]);

                setIeltsBenchmarks(benchJson);
                setCrsBreakdown(crsJson);
            } catch (e: any) {
                console.error(e);
                setLoadError(e.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // -------------------------------------------------
    // 5. Handlers
    // -------------------------------------------------
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
        setFormError(null);
    };

    const validate = (): boolean => {
        // Test type configurations for validation
        const TEST_RANGES: Record<string, { min: number; max: number; step: number }> = {
            "IELTS General Training": { min: 0, max: 9, step: 0.5 },
            "CELPIP-General": { min: 0, max: 12, step: 1 },
            "PTE-Core": { min: 10, max: 90, step: 1 },
            "TEF Canada": { min: 0, max: 450, step: 1 },
            "TCF Canada": { min: 0, max: 699, step: 1 },
        };

        // Validate applicant language scores
        const testType = form.testType || "IELTS General Training";
        const range = TEST_RANGES[testType];
        const skills = ["listening", "reading", "writing", "speaking"] as const;

        for (const s of skills) {
            const v = Number(form[s]);
            if (isNaN(v) || v < range.min || v > range.max) {
                setFormError(`${testType} ${s} must be ${range.min}–${range.max}`);
                return false;
            }
            // Check step validation (for IELTS 0.5 increments)
            if (range.step === 0.5 && v % 0.5 !== 0) {
                setFormError(`${testType} ${s} must be in increments of 0.5`);
                return false;
            }
        }

        const age = Number(form.age);
        if (isNaN(age) || age <= 0) {
            setFormError("Age must be a positive integer");
            return false;
        }

        if (!form.education) {
            setFormError("Select your education level");
            return false;
        }

        // Validate spouse language scores
        if (form.spouse) {
            const spouseTestType = form.spouse_testType || "IELTS General Training";
            const spouseRange = TEST_RANGES[spouseTestType];
            const spouseSkills = [
                "spouse_listening",
                "spouse_reading",
                "spouse_writing",
                "spouse_speaking",
            ] as const;

            for (const s of spouseSkills) {
                const v = Number(form[s]);
                const skillName = s.split("_")[1];
                if (isNaN(v) || v < spouseRange.min || v > spouseRange.max) {
                    setFormError(
                        `Spouse ${spouseTestType} ${skillName} must be ${spouseRange.min}–${spouseRange.max}`
                    );
                    return false;
                }
                if (spouseRange.step === 0.5 && v % 0.5 !== 0) {
                    setFormError(`Spouse ${spouseTestType} ${skillName} must be in increments of 0.5`);
                    return false;
                }
            }

            if (!form.spouse_education) {
                setFormError("Select spouse education level");
                return false;
            }
        }

        // Validate second language scores
        if (form.secondLanguage) {
            const secondTestType = form.second_testType || "IELTS General Training";
            const secondRange = TEST_RANGES[secondTestType];
            const secondSkills = [
                "second_listening",
                "second_reading",
                "second_writing",
                "second_speaking",
            ] as const;

            for (const s of secondSkills) {
                const v = Number(form[s]);
                const skillName = s.split("_")[1];
                if (isNaN(v) || v < secondRange.min || v > secondRange.max) {
                    setFormError(
                        `Second Language ${secondTestType} ${skillName} must be ${secondRange.min}–${secondRange.max}`
                    );
                    return false;
                }
                if (secondRange.step === 0.5 && v % 0.5 !== 0) {
                    setFormError(`Second Language ${secondTestType} ${skillName} must be in increments of 0.5`);
                    return false;
                }
            }
        }

        if (!form.canadianWork) {
            setFormError("Select Canadian work experience");
            return false;
        }
        if (!form.foreignWork) {
            setFormError("Select foreign work experience");
            return false;
        }

        return true;
    };

    const handleCalculate = () => {
        setFormError(null);
        if (!validate()) return;

        const applicantClb = convertIeltsToCLB(
            ieltsBenchmarks,
            {
                listening: form.listening,
                reading: form.reading,
                writing: form.writing,
                speaking: form.speaking,
            },
            form.testType
        );
        setClb(applicantClb);

        let spouseClbResult = null;
        if (form.spouse) {
            spouseClbResult = convertIeltsToCLB(
                ieltsBenchmarks,
                {
                    listening: form.spouse_listening,
                    reading: form.spouse_reading,
                    writing: form.spouse_writing,
                    speaking: form.spouse_speaking,
                },
                form.spouse_testType
            );
            setSpouseClb(spouseClbResult);
        }

        let secondClbResult = null;
        if (form.secondLanguage) {
            secondClbResult = convertIeltsToCLB(
                ieltsBenchmarks,
                {
                    listening: form.second_listening,
                    reading: form.second_reading,
                    writing: form.second_writing,
                    speaking: form.second_speaking,
                },
                form.second_testType
            );
            setSecondClb(secondClbResult);
        } else {
            setSecondClb(null);
        }

        const core = calculateCRS({
            age: Number(form.age),
            spouse: form.spouse,
            clb: applicantClb,
            spouseClb: spouseClbResult,
            education: form.education,
            spouseEducation: form.spouse_education,
            canadianWorkYears: Number(form.canadianWork),
            foreignWorkYears: Number(form.foreignWork),
            certificate: form.certificate,
            secondClb: secondClbResult,
            sibling: form.sibling,
            educationInCanada: form.educationInCanada,
            arrangedEmployment: form.arrangedEmployment,
            nomination: form.nomination,
            breakdown: crsBreakdown,
        });

        setResult({
            agePoints: core.agePoints ?? 0,
            educationPoints: core.educationPoints ?? 0,
            languagePoints: core.languagePoints ?? 0,
            secondLanguagePoints: core.secondLanguagePoints ?? 0,
            canadianWorkPoints: core.canadianWorkPoints ?? 0,
            spouseEducationPoints: core.spouseEducationPoints ?? 0,
            spouseLanguagePoints: core.spouseLanguagePoints ?? 0,
            skillTransferabilityPoints: core.skillTransferabilityPoints ?? 0,
            additionalPoints: core.additionalPoints ?? 0,
            total: core.total ?? 0,
        });
    };

    const handleReset = () => {
        setForm({
            testType: "IELTS General Training",
            listening: "",
            reading: "",
            writing: "",
            speaking: "",
            age: "",
            education: "",
            spouse: false,
            spouse_testType: "IELTS General Training",
            spouse_listening: "",
            spouse_reading: "",
            spouse_writing: "",
            spouse_speaking: "",
            spouse_education: "",
            canadianWork: "",
            foreignWork: "",
            certificate: false,
            secondLanguage: false,
            second_testType: "IELTS General Training",
            second_listening: "",
            second_reading: "",
            second_writing: "",
            second_speaking: "",
            sibling: false,
            educationInCanada: "",
            arrangedEmployment: "",
            nomination: false,
            hasLMIA: false,
        });
        setResult(null);
        setClb(null);
        setSpouseClb(null);
        setSecondClb(null);
        setFormError(null);
    };

    // -------------------------------------------------
    // 6. Render
    // -------------------------------------------------
    if (loading) return <div className={styles.container}>Loading CRS data...</div>;
    if (loadError)
        return <div className={styles.error}>{loadError}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>CRS Calculator</h1>
                <p className={styles.subtitle}>
                    Calculate your Comprehensive Ranking System score for Express Entry
                </p>
            </div>

            {/* ---------- APPLICANT FORM ---------- */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Personal Details</div>
                <div className={styles.compactGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Age</label>
                        <input
                            name="age"
                            placeholder="Age"
                            type="number"
                            min={1}
                            value={form.age}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Education</label>
                        <select
                            name="education"
                            value={form.education}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Select Education</option>
                            <option value="phd">Doctoral (PhD)</option>
                            <option value="masters">Master’s or Professional Degree</option>
                            <option value="two_or_more">
                                Two or more certificates (one 3+ years)
                            </option>
                            <option value="bachelors">Bachelor’s or 3+ year program</option>
                            <option value="college_3_year">Three-year post-secondary</option>
                            <option value="college_2_year">Two-year post-secondary</option>
                            <option value="college_1_year">One-year post-secondary</option>
                            <option value="highschool">Secondary school diploma</option>
                            <option value="less_than_secondary">
                                Less than secondary school
                            </option>
                        </select>
                    </div>
                </div>

                <div className={styles.marginTop}>
                    <label className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            name="spouse"
                            checked={form.spouse}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span>I have a spouse or common-law partner</span>
                    </label>
                </div>
            </div>

            {/* ---------- LANGUAGE ---------- */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Official Languages</div>
                <LanguageFields
                    title="First Official Language (IELTS)"
                    values={form}
                    onChange={handleChange}
                />
            </div>

            {/* ---------- SPOUSE FORM ---------- */}
            {form.spouse && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Spouse / Partner Details</div>
                    <div className={`${styles.compactGrid} ${styles.marginBottom}`}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Spouse Education</label>
                            <select
                                name="spouse_education"
                                value={form.spouse_education}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Select Spouse Education</option>
                                <option value="phd">Doctoral (PhD)</option>
                                <option value="masters">Master’s or Professional Degree</option>
                                <option value="two_or_more">
                                    Two or more certificates (one 3+ years)
                                </option>
                                <option value="bachelors">Bachelor’s or 3+ year program</option>
                                <option value="college_3_year">
                                    Three-year post-secondary
                                </option>
                                <option value="college_2_year">Two-year post-secondary</option>
                                <option value="college_1_year">One-year post-secondary</option>
                                <option value="highschool">Secondary school diploma</option>
                                <option value="less_than_secondary">
                                    Less than secondary school
                                </option>
                            </select>
                        </div>
                    </div>

                    <LanguageFields
                        title="Spouse Language (IELTS)"
                        prefix="spouse_"
                        values={form}
                        onChange={handleChange}
                    />
                </div>
            )}

            {/* ---------- WORK EXPERIENCE ---------- */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Work Experience</div>
                <div className={styles.compactGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Canadian Work Experience</label>
                        <select
                            name="canadianWork"
                            value={form.canadianWork}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Select Years</option>
                            <option value="0">None or less than 1 year</option>
                            <option value="1">1 year</option>
                            <option value="2">2 years</option>
                            <option value="3">3 years</option>
                            <option value="4">4 years</option>
                            <option value="5">5 years or more</option>
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Foreign Work Experience</label>
                        <select
                            name="foreignWork"
                            value={form.foreignWork}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Select Years</option>
                            <option value="0">None</option>
                            <option value="1">1 or 2 years</option>
                            <option value="3">3 years or more</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ---------- SECOND LANGUAGE ---------- */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Second Official Language</div>
                <div className={styles.marginBottom}>
                    <label className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            name="secondLanguage"
                            checked={form.secondLanguage}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span>I have results for a second official language</span>
                    </label>
                </div>

                {form.secondLanguage && (
                    <LanguageFields
                        prefix="second_"
                        values={form}
                        onChange={handleChange}
                        tooltip="IELTS/TEF equivalent band"
                    />
                )}
            </div>

            {/* ---------- ADDITIONAL POINTS ---------- */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Additional Points</div>
                <div className={styles.compactGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Education in Canada</label>
                        <select
                            name="educationInCanada"
                            value={form.educationInCanada}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Select Option</option>
                            <option value="none">None</option>
                            <option value="1_or_2">1 or 2 year diploma/certificate</option>
                            <option value="3_or_more">
                                Degree, diploma or certificate of 3 years or longer
                            </option>
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Arranged Employment</label>
                        <select
                            name="arrangedEmployment"
                            value={form.arrangedEmployment}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Select Option</option>
                            <option value="none">None</option>
                            <option value="noc_00">NOC 00 (Senior Management)</option>
                            <option value="noc_0_a_b">NOC 0, A or B (Other)</option>
                        </select>
                    </div>
                </div>

                {/* Additional Points - All Toggles in One Section */}
                <div className={styles.toggleSection}>
                    {/* Certificate of Qualification */}
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleLabel}>
                            Certificate of Qualification from a Canadian province
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={form.certificate}
                                onChange={(e) => setForm({ ...form, certificate: e.target.checked })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {/* Sibling in Canada */}
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleLabel}>
                            Sibling in Canada who is a citizen or PR
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={form.sibling}
                                onChange={(e) => setForm({ ...form, sibling: e.target.checked })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {/* Provincial Nomination */}
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleLabel}>
                            Valid Provincial Nomination
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={form.nomination}
                                onChange={(e) => setForm({ ...form, nomination: e.target.checked })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {/* LMIA Job Offer */}
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleLabel}>
                            Do you have a valid job offer supported by a Labour Market Impact Assessment (LMIA)?
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={form.hasLMIA}
                                onChange={(e) => setForm({ ...form, hasLMIA: e.target.checked })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {/* LMIA Note */}
                    <div className={styles.lmiaNote}>
                        <svg className={styles.infoIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z" fill="currentColor" />
                        </svg>
                        <span>
                            As of March 25, 2025, Canada has removed the points for job offers that are supported by a Labour Market Impact Assessment (LMIA) for its Express Entry system.
                        </span>
                    </div>
                </div>
            </div>

            {/* ---------- ACTIONS ---------- */}
            <div className={styles.actions}>
                <button onClick={handleCalculate} className={`${styles.button} ${styles.primaryBtn}`}>
                    Calculate CRS Score
                </button>
                <button onClick={handleReset} className={`${styles.button} ${styles.secondaryBtn}`}>
                    Reset Form
                </button>
            </div>

            {formError && <div className={styles.error}>{formError}</div>}

            {/* ---------- RESULTS ---------- */}
            {result && <ResultsBreakdown result={result} hasSpouse={form.spouse} />}

            {/* ---------- CLB LEVELS (for verification) ---------- */}
            {clb && (
                <div className={styles.section} style={{ marginTop: "1rem" }}>
                    <div className={styles.sectionTitle}>CLB Levels (First Language)</div>
                    <div className={styles.compactGrid}>
                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>Listening</span>
                            <span className={styles.clbValue}>CLB {clb.listening || "N/A"}</span>
                        </div>
                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>Reading</span>
                            <span className={styles.clbValue}>CLB {clb.reading || "N/A"}</span>
                        </div>
                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>Writing</span>
                            <span className={styles.clbValue}>CLB {clb.writing || "N/A"}</span>
                        </div>
                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>Speaking</span>
                            <span className={styles.clbValue}>CLB {clb.speaking || "N/A"}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- DISCLAIMER MODAL ---------- */}
            {showDisclaimer && (
                <DisclaimerModal onClose={() => setShowDisclaimer(false)} />
            )}
        </div>
    );
}
