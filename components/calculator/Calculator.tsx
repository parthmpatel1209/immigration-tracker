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

export default function Calculator() {
    // -------------------------------------------------
    // 1. Data from Supabase
    // -------------------------------------------------
    const [ieltsBenchmarks, setIeltsBenchmarks] = useState<any[]>([]);
    const [crsBreakdown, setCrsBreakdown] = useState<BreakdownRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // -------------------------------------------------
    // 2. Form state
    // -------------------------------------------------
    const [form, setForm] = useState({
        listening: "",
        reading: "",
        writing: "",
        speaking: "",
        age: "",
        education: "",
        spouse: false,
        spouse_listening: "",
        spouse_reading: "",
        spouse_writing: "",
        spouse_speaking: "",
        spouse_education: "",
        canadianWork: "",
        foreignWork: "",
        certificate: false,
        secondLanguage: false,
        second_listening: "",
        second_reading: "",
        second_writing: "",
        second_speaking: "",
        sibling: false,
        educationInCanada: "",
        arrangedEmployment: "",
        nomination: false,
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
        const skills = ["listening", "reading", "writing", "speaking"] as const;
        for (const s of skills) {
            const v = Number(form[s]);
            if (isNaN(v) || v < 0 || v > 9 || v % 0.5 !== 0) {
                setFormError(`IELTS ${s} must be 0–9 (step 0.5)`);
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

        if (form.spouse) {
            const spouseSkills = [
                "spouse_listening",
                "spouse_reading",
                "spouse_writing",
                "spouse_speaking",
            ] as const;
            for (const s of spouseSkills) {
                const v = Number(form[s]);
                if (isNaN(v) || v < 0 || v > 9 || v % 0.5 !== 0) {
                    setFormError(
                        `Spouse IELTS ${s.split("_")[1]} must be 0–9 (step 0.5)`
                    );
                    return false;
                }
            }
            if (!form.spouse_education) {
                setFormError("Select spouse education level");
                return false;
            }
        }

        if (form.secondLanguage) {
            const secondSkills = [
                "second_listening",
                "second_reading",
                "second_writing",
                "second_speaking",
            ] as const;
            for (const s of secondSkills) {
                const v = Number(form[s]);
                if (isNaN(v) || v < 0 || v > 9 || v % 0.5 !== 0) {
                    setFormError(
                        `Second Language IELTS ${s.split("_")[1]} must be 0–9 (step 0.5)`
                    );
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

        const applicantClb = convertIeltsToCLB(ieltsBenchmarks, {
            listening: form.listening,
            reading: form.reading,
            writing: form.writing,
            speaking: form.speaking,
        });
        setClb(applicantClb);

        let spouseClbResult = null;
        if (form.spouse) {
            spouseClbResult = convertIeltsToCLB(ieltsBenchmarks, {
                listening: form.spouse_listening,
                reading: form.spouse_reading,
                writing: form.spouse_writing,
                speaking: form.spouse_speaking,
            });
            setSpouseClb(spouseClbResult);
        }

        let secondClbResult = null;
        if (form.secondLanguage) {
            secondClbResult = convertIeltsToCLB(ieltsBenchmarks, {
                listening: form.second_listening,
                reading: form.second_reading,
                writing: form.second_writing,
                speaking: form.second_speaking,
            });
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
            listening: "",
            reading: "",
            writing: "",
            speaking: "",
            age: "",
            education: "",
            spouse: false,
            spouse_listening: "",
            spouse_reading: "",
            spouse_writing: "",
            spouse_speaking: "",
            spouse_education: "",
            canadianWork: "",
            foreignWork: "",
            certificate: false,
            secondLanguage: false,
            second_listening: "",
            second_reading: "",
            second_writing: "",
            second_speaking: "",
            sibling: false,
            educationInCanada: "",
            arrangedEmployment: "",
            nomination: false,
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

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            name="certificate"
                            checked={form.certificate}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span>Certificate of Qualification from a Canadian province</span>
                    </label>

                    <label className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            name="sibling"
                            checked={form.sibling}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span>Sibling in Canada who is a citizen or PR</span>
                    </label>

                    <label className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            name="nomination"
                            checked={form.nomination}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span>Valid Provincial Nomination</span>
                    </label>
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
        </div>
    );
}
