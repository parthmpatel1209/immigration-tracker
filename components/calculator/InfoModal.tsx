import React from "react";
import styles from "./InfoModal.module.css";

interface InfoModalProps {
    onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>CRS Calculator Guide</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Age */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>🎂</span> Age
                        </h3>
                        <p>If you were already invited, enter your age on the date of the invitation.</p>
                        <p>If you are creating a profile, enter your current age.</p>
                    </section>

                    {/* Education */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>🎓</span> Education
                        </h3>
                        <p>Enter the highest level of education for which you:</p>
                        <ul>
                            <li>earned a Canadian credential, or</li>
                            <li>completed an ECA for studies done outside Canada (must be from an approved organization, issued within the last five years)</li>
                        </ul>
                        <p>Canadian credentials must be from an accredited Canadian school (college, university, technical, or trade).</p>
                        <p>Distance learning counts for education points but not bonus points.</p>
                    </section>

                    {/* Canadian Education */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>🇨🇦</span> Have you earned a Canadian degree, diploma, or certificate?
                        </h3>
                        <p>To answer yes, all must be true:</p>
                        <ul>
                            <li>ESL or FSL studies made up no more than half the program</li>
                            <li>You were not funded under a scholarship requiring return to your home country</li>
                            <li>The institution was inside Canada (not a foreign campus)</li>
                            <li>Full-time enrollment for at least eight months</li>
                            <li>Physically present in Canada for at least eight months
                                <ul>
                                    <li>Except for programs completed partly or fully between March 2020 and August 2022</li>
                                </ul>
                            </li>
                        </ul>
                    </section>

                    {/* Official Languages */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>🗣️</span> Official Languages
                        </h3>
                        <p>English and French are Canada's official languages.</p>
                        <p>Language test results must be less than two years old for Express Entry.</p>
                    </section>

                    {/* Canadian Work Experience */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>💼</span> Canadian Skilled Work Experience
                        </h3>
                        <p>Last 10 years. Must be:</p>
                        <ul>
                            <li>paid</li>
                            <li>full-time or equivalent part-time</li>
                            <li>physically working in Canada for a Canadian employer (including remote)</li>
                            <li>TEER 0, 1, 2, or 3 occupation</li>
                        </ul>
                        <p>If unsure of TEER classification, the NOC system can be searched online at: <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/find-national-occupation-code.html" target="_blank" rel="noopener noreferrer">canada.ca/noc</a></p>
                    </section>

                    {/* Foreign Work Experience */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>🌍</span> Foreign Skilled Work Experience
                        </h3>
                        <p>Last 10 years. Must be:</p>
                        <ul>
                            <li>paid</li>
                            <li>full-time or equivalent part-time</li>
                            <li>in one NOC TEER 0, 1, 2, or 3 occupation</li>
                        </ul>
                    </section>

                    {/* Certificate of Qualification */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>🔧</span> Certificate of Qualification
                        </h3>
                        <p>Issued by a province, territory, or federal body for certain skilled trades.</p>
                        <p>Requires:</p>
                        <ul>
                            <li>assessment of skills, training, and experience</li>
                            <li>passing a certification exam</li>
                            <li>often requires assessment in the province or territory</li>
                            <li>may require Canadian experience and employer involvement</li>
                        </ul>
                        <p className={styles.note}>This is not the same as a provincial nomination.</p>
                    </section>

                    {/* Sibling in Canada */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.emoji}>👨‍👩‍👦</span> Sibling in Canada
                        </h3>
                        <p>To answer yes, the sibling must:</p>
                        <ul>
                            <li>be 18 or older</li>
                            <li>be a Canadian permanent resident or citizen</li>
                            <li>be related by:
                                <ul>
                                    <li>blood</li>
                                    <li>marriage (step-sibling)</li>
                                    <li>adoption</li>
                                </ul>
                            </li>
                            <li>share at least one parent with you or your spouse</li>
                        </ul>
                    </section>
                </div>

                <div className={styles.footer}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
