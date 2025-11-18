// app/calculator/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  convertIeltsToCLB,
  calculateCRS,
  BreakdownRow,
  LanguagePointsRow,
} from "@/lib/crs";

export default function CalculatorPage() {
  // -------------------------------------------------
  // 1. Data from Supabase
  // -------------------------------------------------
  const [ieltsBenchmarks, setIeltsBenchmarks] = useState<any[]>([]);
  const [crsBreakdown, setCrsBreakdown] = useState<BreakdownRow[]>([]);
  const [languagePoints, setLanguagePoints] = useState<LanguagePointsRow[]>([]);
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
  });

  // -------------------------------------------------
  // 3. Results
  // -------------------------------------------------
  const [clb, setClb] = useState<Record<string, number | null> | null>(null);
  const [spouseClb, setSpouseClb] = useState<Record<
    string,
    number | null
  > | null>(null);
  const [result, setResult] = useState<{
    agePoints: number;
    educationPoints: number;
    languagePoints: number;
    spousePoints: number;
    total: number;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // -------------------------------------------------
  // 4. Load data — 3 tables
  // -------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const [benchRes, crsRes, langRes] = await Promise.all([
          fetch("/api/language-benchmarks"),
          fetch("/api/crs-breakdown"),
          fetch("/api/crs-language-points"),
        ]);

        if (!benchRes.ok) throw new Error(`Language benchmarks failed`);
        if (!crsRes.ok) throw new Error(`CRS breakdown failed`);
        if (!langRes.ok) throw new Error(`Language points failed`);

        const [benchJson, crsJson, langJson] = await Promise.all([
          benchRes.json(),
          crsRes.json(),
          langRes.json(),
        ]);

        setIeltsBenchmarks(benchJson);
        setCrsBreakdown(crsJson);
        setLanguagePoints(langJson);
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

    return true;
  };

  // -------------------------------------------------
  // 6. Dynamic Language Points
  // -------------------------------------------------
  const getLanguagePoints = (clbLevel: number, spouse: boolean): number => {
    const row = languagePoints.find((r) => r.clb_level === clbLevel);
    if (!row) {
      console.warn(`No points for CLB ${clbLevel}`);
      return 0;
    }
    return spouse ? row.points_with_spouse : row.points_no_spouse;
  };

  const calculateLanguagePoints = (
    clb: Record<string, number | null>,
    spouse: boolean
  ): number => {
    let total = 0;
    for (const skill of ["listening", "reading", "writing", "speaking"]) {
      const level = clb[skill];
      if (level) total += getLanguagePoints(level, spouse);
    }
    return total;
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

    const core = calculateCRS({
      age: Number(form.age),
      spouse: form.spouse,
      clb: applicantClb,
      education: form.education,
      breakdown: crsBreakdown,
    });

    const applicantLangPoints = calculateLanguagePoints(
      applicantClb,
      form.spouse
    );
    const spouseLangPoints =
      form.spouse && spouseClbResult
        ? calculateLanguagePoints(spouseClbResult, true)
        : 0;

    setResult({
      agePoints: core.agePoints,
      educationPoints: core.educationPoints,
      languagePoints: applicantLangPoints,
      spousePoints: spouseLangPoints,
      total:
        core.agePoints +
        core.educationPoints +
        applicantLangPoints +
        spouseLangPoints,
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
    });
    setResult(null);
    setClb(null);
    setSpouseClb(null);
    setFormError(null);
  };

  // -------------------------------------------------
  // 7. Render
  // -------------------------------------------------
  if (loading) return <div style={{ padding: 20 }}>Loading CRS data…</div>;
  if (loadError)
    return <div style={{ padding: 20, color: "red" }}>{loadError}</div>;

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        CRS Eligibility Calculator
      </h1>

      {/* ---------- APPLICANT FORM ---------- */}
      <h3 style={{ marginBottom: 12 }}>Applicant</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {(["listening", "reading", "writing", "speaking"] as const).map(
          (skill) => (
            <Tooltip key={skill} text="IELTS band (0–9, step 0.5)">
              <input
                name={skill}
                placeholder={`IELTS ${
                  skill.charAt(0).toUpperCase() + skill.slice(1)
                }`}
                type="number"
                min={0}
                max={9}
                step={0.5}
                value={form[skill]}
                onChange={handleChange}
                style={inputStyle}
              />
            </Tooltip>
          )
        )}

        <Tooltip text="Your age on profile submission">
          <input
            name="age"
            placeholder="Age"
            type="number"
            min={1}
            value={form.age}
            onChange={handleChange}
            style={inputStyle}
          />
        </Tooltip>

        <Tooltip text="Highest education completed">
          <select
            name="education"
            value={form.education}
            onChange={handleChange}
            style={selectStyle}
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
        </Tooltip>

        <label
          style={{
            gridColumn: "span 2",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          <input
            type="checkbox"
            name="spouse"
            checked={form.spouse}
            onChange={handleChange}
          />
          I have a spouse / common-law partner
        </label>
      </div>

      {/* ---------- SPOUSE FORM ---------- */}
      {form.spouse && (
        <>
          <h3 style={{ marginBottom: 12 }}>Spouse / Partner</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {(["listening", "reading", "writing", "speaking"] as const).map(
              (skill) => (
                <Tooltip key={skill} text="Spouse IELTS band (0–9, step 0.5)">
                  <input
                    name={`spouse_${skill}`}
                    placeholder={`Spouse ${
                      skill.charAt(0).toUpperCase() + skill.slice(1)
                    }`}
                    type="number"
                    min={0}
                    max={9}
                    step={0.5}
                    value={form[`spouse_${skill}` as keyof typeof form] || ""}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Tooltip>
              )
            )}

            <Tooltip text="Spouse's highest education">
              <select
                name="spouse_education"
                value={form.spouse_education}
                onChange={handleChange}
                style={{ ...selectStyle, gridColumn: "span 2" }}
              >
                <option value="">Select Education</option>
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
            </Tooltip>
          </div>
        </>
      )}

      {/* ---------- BUTTONS ---------- */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={handleCalculate} style={primaryBtn}>
          Calculate CRS
        </button>
        <button onClick={handleReset} style={dangerBtn}>
          Reset
        </button>
      </div>

      {formError && (
        <p style={{ color: "#d32f2f", marginBottom: 16 }}>{formError}</p>
      )}

      {/* ---------- RESULTS ---------- */}
      {result && (
        <div
          style={{
            padding: 20,
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <h2 style={{ marginBottom: 12 }}>CRS Score Breakdown</h2>

          <p>
            Age Points: <strong>{result.agePoints}</strong>{" "}
            {form.spouse && "(with spouse)"}
          </p>
          <p>
            Education Points: <strong>{result.educationPoints}</strong>{" "}
            {form.spouse && "(with spouse)"}
          </p>
          <p>
            Language Points (You): <strong>{result.languagePoints}</strong>
          </p>
          {result.spousePoints > 0 && (
            <p>
              Spouse Language Points: <strong>{result.spousePoints}</strong>
            </p>
          )}

          <hr style={{ margin: "16px 0", borderColor: "#e0e0e0" }} />

          <p style={{ fontSize: 20 }}>
            Total CRS: <strong>{result.total}</strong>
          </p>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Your CLB Levels</h3>
            <CLBTable clb={clb} />

            {spouseClb && (
              <>
                <h3 style={{ marginTop: 20, marginBottom: 8 }}>
                  Spouse CLB Levels
                </h3>
                <CLBTable clb={spouseClb} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------
   Reusable CLB Table
   ------------------------------------------------- */
function CLBTable({ clb }: { clb: Record<string, number | null> | null }) {
  if (!clb) return null;
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Skill</th>
          <th style={thStyle}>CLB</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(clb).map(([skill, level]) => (
          <tr key={skill}>
            <td style={tdStyle}>
              {skill.charAt(0).toUpperCase() + skill.slice(1)}
            </td>
            <td style={tdStyle}>{level ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* -------------------------------------------------
   Tooltip
   ------------------------------------------------- */
function Tooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  return (
    <div
      style={{ position: "relative", display: "inline-block", width: "100%" }}
    >
      {children}
      <span className="tooltip" style={tooltipStyle}>
        {text}
      </span>
      <style jsx>{`
        div:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  visibility: "hidden",
  width: "max-content",
  backgroundColor: "#333",
  color: "#fff",
  textAlign: "center",
  borderRadius: 4,
  padding: "4px 8px",
  position: "absolute",
  zIndex: 1,
  bottom: "125%",
  left: "50%",
  marginLeft: "-80px",
  opacity: 0,
  transition: "opacity 0.2s",
  fontSize: 13,
  pointerEvents: "none",
};

/* -------------------------------------------------
   Styles
   ------------------------------------------------- */
const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 15,
  borderRadius: 6,
  border: "1px solid #ccc",
  width: "100%",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 16,
};

const dangerBtn: React.CSSProperties = { ...primaryBtn, background: "#d32f2f" };

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 15,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 6px",
  borderBottom: "2px solid #ddd",
  background: "#f5f5f5",
};

const tdStyle: React.CSSProperties = {
  padding: "6px",
  borderBottom: "1px solid #eee",
};
