/**
 * CRS Improvement Suggestions Engine
 * 
 * Analyzes user's CRS calculator results and provides personalized,
 * actionable recommendations to improve their score.
 */

export interface CRSFormData {
    age: number;
    maritalStatus: string;
    education: string;
    canadianEducation: string;
    firstLanguage: {
        listening: number;
        reading: number;
        writing: number;
        speaking: number;
    };
    secondLanguage?: {
        listening: number;
        reading: number;
        writing: number;
        speaking: number;
    };
    workExperience: number;
    canadianWorkExperience: number;
    certificate: boolean;
    sibling: boolean;
    nomination: boolean;
    hasLMIA: boolean;
    spouseEducation?: string;
    spouseWorkExperience?: number;
    spouseLanguage?: {
        listening: number;
        reading: number;
        writing: number;
        speaking: number;
    };
}

export interface Suggestion {
    id: string;
    category: "language" | "education" | "work" | "spouse" | "additional" | "pnp";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    potentialPoints: number;
    timeframe: string;
    actionSteps: string[];
    difficulty: "easy" | "moderate" | "challenging";
}

/**
 * Generates personalized CRS improvement suggestions
 * @param formData - User's calculator input
 * @param currentScore - Current CRS score
 * @param latestCutoff - Latest Express Entry cutoff score (optional)
 * @returns Array of prioritized suggestions
 */
export function generateCRSSuggestions(
    formData: CRSFormData,
    currentScore: number,
    latestCutoff?: number
): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Calculate gap to latest cutoff
    const gapToTarget = latestCutoff ? latestCutoff - currentScore : 0;

    // 1. Language Improvement Suggestions
    const languageSuggestions = analyzeLanguageImprovements(formData);
    suggestions.push(...languageSuggestions);

    // 2. Education Suggestions
    const educationSuggestions = analyzeEducationImprovements(formData);
    suggestions.push(...educationSuggestions);

    // 3. Work Experience Suggestions
    const workSuggestions = analyzeWorkExperience(formData);
    suggestions.push(...workSuggestions);

    // 4. Spouse Factors (if applicable)
    if (formData.maritalStatus === "married") {
        const spouseSuggestions = analyzeSpouseFactors(formData);
        suggestions.push(...spouseSuggestions);
    }

    // 5. Additional Points
    const additionalSuggestions = analyzeAdditionalPoints(formData);
    suggestions.push(...additionalSuggestions);

    // 6. Provincial Nominee Program (High Priority if gap is large)
    if (gapToTarget > 50 || currentScore < 450) {
        suggestions.push(createPNPSuggestion(formData, gapToTarget));
    }

    // Sort by priority and potential points
    return suggestions.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.potentialPoints - a.potentialPoints;
    });
}

/** Analyze language test scores for improvement opportunities */
function analyzeLanguageImprovements(formData: CRSFormData): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const { listening, reading, writing, speaking } = formData.firstLanguage;

    // Check if any skill is below CLB 9
    const skills = [
        { name: "Listening", score: listening },
        { name: "Reading", score: reading },
        { name: "Writing", score: writing },
        { name: "Speaking", score: speaking },
    ];

    const lowSkills = skills.filter((s) => s.score < 9);

    if (lowSkills.length > 0) {
        const avgScore = (listening + reading + writing + speaking) / 4;
        const potentialPoints = avgScore < 7 ? 50 : avgScore < 9 ? 30 : 15;

        suggestions.push({
            id: "improve-first-language",
            category: "language",
            priority: avgScore < 7 ? "high" : "medium",
            title: "Improve First Language Test Scores",
            description: `Your ${lowSkills.map((s) => s.name).join(", ")} score(s) can be improved. Achieving CLB 9+ in all skills significantly boosts your CRS score.`,
            potentialPoints,
            timeframe: "2-6 months",
            actionSteps: [
                "Take practice tests to identify weak areas",
                "Enroll in language preparation courses (IELTS/CELPIP)",
                "Practice daily with native speakers or tutors",
                "Retake the test when ready (aim for CLB 9+)",
            ],
            difficulty: "moderate",
        });
    }

    // Second language suggestion - only show if user hasn't added a second language
    // or if all scores are very low (below CLB 4)
    const hasValidSecondLanguage = formData.secondLanguage && (
        formData.secondLanguage.listening >= 4 ||
        formData.secondLanguage.reading >= 4 ||
        formData.secondLanguage.writing >= 4 ||
        formData.secondLanguage.speaking >= 4
    );

    if (!hasValidSecondLanguage) {
        suggestions.push({
            id: "add-second-language",
            category: "language",
            priority: "low",
            title: "Add French Language Test (TEF/TCF)",
            description: "Learning French can add up to 50 points. Even basic proficiency (CLB 5+) helps.",
            potentialPoints: 25,
            timeframe: "6-12 months",
            actionSteps: [
                "Start with beginner French courses (Duolingo, Alliance Française)",
                "Aim for CLB 5 minimum in all skills",
                "Take TEF Canada or TCF Canada test",
                "Consider French-speaking provinces for additional PNP points",
            ],
            difficulty: "challenging",
        });
    }

    return suggestions;
}

/** Analyze education for improvement opportunities */
function analyzeEducationImprovements(formData: CRSFormData): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Canadian education credential
    if (!formData.canadianEducation || formData.canadianEducation === "none") {
        suggestions.push({
            id: "canadian-education",
            category: "education",
            priority: "medium",
            title: "Obtain Canadian Education Credential",
            description: "A 1-year Canadian diploma adds 15 points, 2+ years adds 30 points. Also makes you eligible for PGWP.",
            potentialPoints: 30,
            timeframe: "1-2 years",
            actionSteps: [
                "Research Canadian colleges/universities for your field",
                "Apply for study permit",
                "Complete 1-2 year program at a DLI (Designated Learning Institution)",
                "Gain Canadian work experience through PGWP after graduation",
            ],
            difficulty: "challenging",
        });
    }

    // Higher education
    if (formData.education === "bachelor" || formData.education === "two_or_more") {
        suggestions.push({
            id: "masters-degree",
            category: "education",
            priority: "low",
            title: "Consider Master's Degree",
            description: "A Master's degree can add 23-30 points depending on your profile.",
            potentialPoints: 25,
            timeframe: "1-2 years",
            actionSteps: [
                "Research Master's programs (Canadian preferred)",
                "Get ECA (Educational Credential Assessment) for foreign degrees",
                "Consider online/part-time options while working",
            ],
            difficulty: "challenging",
        });
    }

    return suggestions;
}

/** Analyze work experience for improvements */
function analyzeWorkExperience(formData: CRSFormData): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Canadian work experience
    if (formData.canadianWorkExperience < 1) {
        suggestions.push({
            id: "canadian-work-experience",
            category: "work",
            priority: "high",
            title: "Gain Canadian Work Experience",
            description: "1 year of Canadian work experience adds 40-70 points. Consider work permits, PGWP, or IEC.",
            potentialPoints: 50,
            timeframe: "1-3 years",
            actionSteps: [
                "Apply for work permits (LMIA-based, IEC, or PGWP)",
                "Look for NOC TEER 0, 1, 2, or 3 positions",
                "Work full-time (30+ hours/week) for at least 1 year",
                "Keep detailed employment records and pay stubs",
            ],
            difficulty: "moderate",
        });
    }

    // Foreign work experience
    if (formData.workExperience < 3) {
        suggestions.push({
            id: "foreign-work-experience",
            category: "work",
            priority: "medium",
            title: "Accumulate More Foreign Work Experience",
            description: "3+ years of foreign work experience maximizes points in this category.",
            potentialPoints: 25,
            timeframe: "1-3 years",
            actionSteps: [
                "Continue working in your current NOC",
                "Ensure job duties match NOC requirements",
                "Collect reference letters and employment proof",
            ],
            difficulty: "easy",
        });
    }

    return suggestions;
}

/** Analyze spouse factors */
function analyzeSpouseFactors(formData: CRSFormData): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Spouse language
    if (!formData.spouseLanguage ||
        (formData.spouseLanguage.listening + formData.spouseLanguage.reading +
            formData.spouseLanguage.writing + formData.spouseLanguage.speaking) < 20) {
        suggestions.push({
            id: "spouse-language",
            category: "spouse",
            priority: "medium",
            title: "Improve Spouse's Language Scores",
            description: "Your spouse achieving CLB 5+ can add up to 20 points.",
            potentialPoints: 20,
            timeframe: "3-6 months",
            actionSteps: [
                "Spouse takes IELTS/CELPIP preparation course",
                "Aim for CLB 5 minimum (CLB 7+ is better)",
                "Include spouse's test results in Express Entry profile",
            ],
            difficulty: "moderate",
        });
    }

    // Spouse education
    if (!formData.spouseEducation || formData.spouseEducation === "high_school") {
        suggestions.push({
            id: "spouse-education",
            category: "spouse",
            priority: "low",
            title: "Spouse's Education Credential",
            description: "Bachelor's degree or higher for your spouse adds 8-10 points.",
            potentialPoints: 10,
            timeframe: "Varies",
            actionSteps: [
                "Get ECA for spouse's foreign credentials",
                "Consider online degree programs if needed",
            ],
            difficulty: "moderate",
        });
    }

    return suggestions;
}

/** Analyze additional points opportunities */
function analyzeAdditionalPoints(formData: CRSFormData): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Certificate of Qualification
    if (!formData.certificate) {
        suggestions.push({
            id: "certificate-qualification",
            category: "additional",
            priority: "low",
            title: "Obtain Certificate of Qualification",
            description: "For skilled trades, a provincial certificate adds 50 points.",
            potentialPoints: 50,
            timeframe: "6-12 months",
            actionSteps: [
                "Check if your occupation is a skilled trade",
                "Apply for provincial certification",
                "Complete required assessments/exams",
            ],
            difficulty: "moderate",
        });
    }

    // Sibling in Canada
    if (!formData.sibling) {
        suggestions.push({
            id: "sibling-canada",
            category: "additional",
            priority: "low",
            title: "Sibling in Canada",
            description: "Having a sibling who is a Canadian citizen or PR adds 15 points.",
            potentialPoints: 15,
            timeframe: "N/A",
            actionSteps: [
                "If you have a sibling in Canada, verify their status",
                "Gather proof of relationship (birth certificates, etc.)",
            ],
            difficulty: "easy",
        });
    }

    return suggestions;
}

/** Create PNP suggestion */
function createPNPSuggestion(formData: CRSFormData, gapToTarget: number): Suggestion {
    return {
        id: "provincial-nomination",
        category: "pnp",
        priority: "high",
        title: "Apply for Provincial Nominee Program (PNP)",
        description: `A provincial nomination adds 600 points, virtually guaranteeing an ITA. ${gapToTarget > 0 ? `You need ${gapToTarget} more points to meet the latest cutoff.` : "This is the fastest path to PR."}`,
        potentialPoints: 600,
        timeframe: "3-12 months",
        actionSteps: [
            "Research PNPs matching your profile (Ontario, BC, Alberta, etc.)",
            "Check eligibility for specific streams (Human Capital, Skilled Worker, etc.)",
            "Create EOI (Expression of Interest) in provincial systems",
            "Improve your profile to increase chances of nomination",
            "Consider job offers in target provinces",
        ],
        difficulty: "moderate",
    };
}

/**
 * Get quick wins - easiest suggestions with good ROI
 */
export function getQuickWins(suggestions: Suggestion[]): Suggestion[] {
    return suggestions
        .filter((s) => s.difficulty === "easy" || s.difficulty === "moderate")
        .filter((s) => s.potentialPoints >= 15)
        .slice(0, 3);
}

/**
 * Get high-impact suggestions
 */
export function getHighImpact(suggestions: Suggestion[]): Suggestion[] {
    return suggestions
        .filter((s) => s.potentialPoints >= 30)
        .slice(0, 3);
}
