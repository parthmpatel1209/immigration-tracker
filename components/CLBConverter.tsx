"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, Award, X, RotateCcw } from "lucide-react";

type TestType = "CELPIP" | "IELTS" | "PTE" | "TEF" | "TCF";
const TESTS: TestType[] = ["IELTS", "CELPIP", "PTE", "TEF", "TCF"];

// --- Logic Helpers --- (Unchanged logic for stability)
const getCelpipScore = (val: string): number => {
    if (["10+", "12", "11", "10"].includes(val)) return 10;
    if (["M", "3-"].includes(val)) return 0;
    const p = parseInt(val);
    return isNaN(p) ? 0 : p;
};

const getIeltsCLB = (type: 'R' | 'L' | 'W' | 'S', score: number): number => {
    if (type === 'R') {
        if (score >= 8.0) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.0) return 6; return 4;
    }
    if (type === 'L') {
        if (score >= 8.5) return 10; if (score >= 8.0) return 9; if (score >= 7.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; return 4;
    }
    if (score >= 7.5) return 10; if (score >= 7.0) return 9; if (score >= 6.5) return 8; if (score >= 6.0) return 7; if (score >= 5.5) return 6; return 4;
};

const getPteCLB = (type: 'R' | 'L' | 'W' | 'S', score: number): number => {
    // Exact IRCC 2024 mapping for PTE Core
    if (type === 'R') { if (score >= 88) return 10; if (score >= 78) return 9; if (score >= 69) return 8; if (score >= 60) return 7; return 5; }
    if (type === 'W') { if (score >= 90) return 10; if (score >= 88) return 9; if (score >= 79) return 8; if (score >= 69) return 7; return 5; }
    if (type === 'L') { if (score >= 89) return 10; if (score >= 82) return 9; if (score >= 71) return 8; if (score >= 60) return 7; return 5; }
    if (score >= 89) return 10; if (score >= 84) return 9; if (score >= 76) return 8; if (score >= 68) return 7; return 5;
};

const getTefCLB = (val: number): number => {
    if (val >= 400) return 10;
    if (val >= 370) return 9;
    if (val >= 310) return 7;
    return 5;
};

const CELPIP_OPTS = ["12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "M"];
const IELTS_OPTS = ["9.0", "8.5", "8.0", "7.5", "7.0", "6.5", "6.0", "5.5", "5.0", "4.5", "4.0"];

interface CLBConverterProps {
    isOpen: boolean;
    onClose: () => void;
    isDark?: boolean; // Optional to prevent strict TS err if missing
}

export default function CLBConverter({ isOpen, onClose, isDark = false }: CLBConverterProps) {
    const [test, setTest] = useState<TestType>("IELTS");
    const [scores, setScores] = useState({ r: "0", w: "0", l: "0", s: "0" });

    // Defaults
    const setDefaults = (t: TestType) => {
        if (t === "IELTS") setScores({ r: "7.0", w: "7.0", l: "7.5", s: "7.0" });
        if (t === "CELPIP") setScores({ r: "9", w: "9", l: "9", s: "9" });
        if (t === "PTE") setScores({ r: "78", w: "88", l: "82", s: "84" });
        if (t === "TEF") setScores({ r: "248", w: "371", l: "298", s: "371" });
        if (t === "TCF") setScores({ r: "500", w: "10", l: "500", s: "10" });
    };

    useEffect(() => {
        setDefaults(test);
    }, [test]);

    useEffect(() => {
        if (isOpen) { document.body.style.overflow = "hidden"; }
        else { document.body.style.overflow = "unset"; }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    const getClb = (f: 'r' | 'w' | 'l' | 's') => {
        const val = scores[f];
        if (test === "CELPIP") return getCelpipScore(val);
        if (test === "IELTS") {
            const types = { r: 'R', w: 'W', l: 'L', s: 'S' } as const;
            return getIeltsCLB(types[f], parseFloat(val));
        }
        if (test === "PTE") {
            const types = { r: 'R', w: 'W', l: 'L', s: 'S' } as const;
            return getPteCLB(types[f], parseInt(val) || 0);
        }
        return getTefCLB(parseInt(val) || 0);
    };

    const rCLB = getClb('r');
    const wCLB = getClb('w');
    const lCLB = getClb('l');
    const sCLB = getClb('s');
    const minCLB = Math.min(rCLB, wCLB, lCLB, sCLB);
    const isNine = minCLB >= 9;

    // --- THEME CONSTANTS ---
    const colors = {
        bg: isDark ? '#111827' : '#ffffff',
        text: isDark ? '#f9fafb' : '#111827',
        textSoft: isDark ? '#9ca3af' : '#6b7280',
        headerBg: isDark ? '#1f2937' : '#f9fafb',
        border: isDark ? '#374151' : '#e5e7eb',
        inputBg: isDark ? '#374151' : '#f9fafb',
        inputBorder: isDark ? '#4b5563' : '#d1d5db',
        inputText: isDark ? '#ffffff' : '#111827',
        accent: '#2563eb',
        accentText: '#ffffff',
        tabInactiveBg: isDark ? '#374151' : '#f3f4f6',
        tabInactiveText: isDark ? '#d1d5db' : '#4b5563',
        footerBg: isDark ? (isNine ? '#064e3b' : '#1f2937') : (isNine ? '#ecfdf5' : '#f9fafb'),
        footerBorder: isDark ? (isNine ? '#065f46' : '#374151') : (isNine ? '#d1fae5' : '#e5e7eb'),
        resetBg: isDark ? '#374151' : '#e0e7ff',
        resetIcon: isDark ? '#d1d5db' : '#4f46e5',
        resultGood: isDark ? '#34d399' : '#059669',
        resultNorm: isDark ? '#60a5fa' : '#2563eb'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)'
            }} onClick={onClose} />

            <div style={{
                position: 'relative', width: '100%', maxWidth: '750px',
                backgroundColor: colors.bg,
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
                border: `1px solid ${colors.border}`
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: `1px solid ${colors.border}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: colors.headerBg
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => setDefaults(test)}
                            title="Reset Scores"
                            style={{
                                padding: '8px', background: colors.resetBg,
                                borderRadius: '8px', color: colors.resetIcon,
                                border: 'none', cursor: 'pointer', transition: 'transform 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'rotate(-180deg)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'rotate(0deg)'}
                        >
                            <RotateCcw size={20} />
                        </button>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: colors.text }}>Language Converter</h2>
                            <p style={{ margin: 0, fontSize: '13px', color: colors.textSoft }}>Official CLB Benchmark Tool</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: colors.textSoft }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', padding: '24px', flexWrap: 'wrap' }}>
                    {TESTS.map(t => (
                        <button key={t} onClick={() => setTest(t)} style={{
                            padding: '8px 16px', borderRadius: '20px', border: 'none',
                            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                            backgroundColor: test === t ? colors.accent : colors.tabInactiveBg,
                            color: test === t ? colors.accentText : colors.tabInactiveText,
                        }}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Inputs Grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '20px', padding: '0 24px 24px', overflowY: 'auto'
                }}>
                    {(['Reading', 'Writing', 'Listening', 'Speaking'] as const).map((f, i) => {
                        const keyMap = { Reading: 'r', Writing: 'w', Listening: 'l', Speaking: 's' } as const;
                        const field = keyMap[f];
                        const isDropdown = (test === "CELPIP" || test === "IELTS");
                        const clbVal = getClb(field);

                        return (
                            <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: colors.textSoft, letterSpacing: '0.05em' }}>
                                    {f}
                                </label>
                                {isDropdown ? (
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={scores[field]}
                                            onChange={e => setScores({ ...scores, [field]: e.target.value })}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: '8px',
                                                border: `1px solid ${colors.inputBorder}`,
                                                fontSize: '16px', fontWeight: '600',
                                                backgroundColor: colors.inputBg,
                                                color: colors.inputText, outline: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            {(test === "CELPIP" ? CELPIP_OPTS : IELTS_OPTS).map(o => (
                                                <option key={o} value={o}>{o}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '14px', pointerEvents: 'none', color: colors.textSoft }} />
                                    </div>
                                ) : (
                                    <input
                                        type="number"
                                        value={scores[field]}
                                        onChange={e => setScores({ ...scores, [field]: e.target.value })}
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: '8px',
                                            border: `1px solid ${colors.inputBorder}`,
                                            fontSize: '16px', fontWeight: '600',
                                            backgroundColor: colors.inputBg,
                                            color: colors.inputText, outline: 'none'
                                        }}
                                        placeholder="Score"
                                    />
                                )}
                                <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px', color: clbVal >= 9 ? colors.resultGood : colors.resultNorm }}>
                                    CLB {clbVal}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 24px',
                    backgroundColor: colors.footerBg,
                    borderTop: `1px solid ${colors.footerBorder}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '12px', color: isDark && isNine ? '#a7f3d0' : colors.textSoft, textTransform: 'uppercase', fontWeight: '700' }}>Overall Level</div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: isNine ? colors.resultGood : colors.text }}>CLB {minCLB}</div>
                    </div>
                    {isNine && (
                        <div style={{
                            display: 'flex', gap: '6px', alignItems: 'center',
                            background: isDark ? 'rgba(5, 150, 105, 0.2)' : '#d1fae5',
                            padding: '8px 16px', borderRadius: '20px',
                            color: isDark ? '#34d399' : '#047857',
                            fontSize: '13px', fontWeight: '700'
                        }}>
                            <Award size={18} /> <span>CRS Boost!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
