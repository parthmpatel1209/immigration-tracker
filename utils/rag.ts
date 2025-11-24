/**
 * RAG (Retrieval-Augmented Generation) Utilities
 * 
 * Provides document retrieval and context-aware suggestions for the AI chatbot.
 * Uses keyword-based matching - can be upgraded to vector similarity search.
 */

/**
 * IRCC Knowledge Base
 * Contains official immigration information with topics, content, and keywords.
 * TODO: Replace with vector database (Pinecone/Supabase) for production.
 */
const IRCC_KNOWLEDGE_BASE = [
    {
        topic: "Express Entry",
        content: `Express Entry is Canada's application management system for three federal economic immigration programs:
    - Federal Skilled Worker Program (FSWP)
    - Federal Skilled Trades Program (FSTP)
    - Canadian Experience Class (CEC)
    
    The Comprehensive Ranking System (CRS) scores candidates based on age, education, work experience, and language ability.
    Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html`,
        keywords: ["express entry", "crs", "federal skilled worker", "cec", "comprehensive ranking"],
    },
    {
        topic: "CRS Score",
        content: `The CRS score ranges from 0 to 1,200 points. Key factors:
    - Core human capital factors (max 500 points with spouse, 600 without)
    - Spouse factors (max 40 points)
    - Skill transferability (max 100 points)
    - Additional points (max 600 points for PNP, job offer, Canadian education, etc.)
    
    Recent cut-off scores vary by draw type. Check latest draws at IRCC website.
    Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html`,
        keywords: ["crs score", "points", "ranking", "cutoff", "draw"],
    },
    {
        topic: "Provincial Nominee Program",
        content: `Provincial Nominee Programs (PNPs) allow provinces to nominate individuals for permanent residence.
    A provincial nomination adds 600 points to your CRS score, virtually guaranteeing an ITA.
    
    Each province has different streams targeting specific skills, occupations, or demographics.
    Popular PNPs: Ontario (OINP), British Columbia (BC PNP), Alberta (AAIP), Saskatchewan (SINP).
    Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html`,
        keywords: ["pnp", "provincial nominee", "nomination", "oinp", "bc pnp", "600 points"],
    },
    {
        topic: "Language Tests",
        content: `Approved language tests for Express Entry:
    English: IELTS General Training, CELPIP-General, PTE Core
    French: TEF Canada, TCF Canada
    
    Scores are converted to Canadian Language Benchmark (CLB) levels.
    Higher CLB levels (9+) significantly increase CRS points.
    Test results are valid for 2 years from the test date.
    Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-requirements.html`,
        keywords: ["ielts", "celpip", "pte", "tef", "tcf", "language test", "clb"],
    },
    {
        topic: "Study Permit",
        content: `To study in Canada, you need:
    - Acceptance letter from a Designated Learning Institution (DLI)
    - Proof of funds (tuition + living expenses)
    - No criminal record
    - Medical exam (if required)
    
    Study permit holders can work part-time (20 hrs/week during studies, full-time during breaks).
    After graduation, you may be eligible for a Post-Graduation Work Permit (PGWP).
    Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html`,
        keywords: ["study permit", "student visa", "dli", "pgwp", "post-graduation work permit"],
    },
    {
        topic: "Work Permit",
        content: `Types of work permits:
    1. Employer-specific: Tied to one employer, requires LMIA (Labour Market Impact Assessment)
    2. Open work permit: Work for any employer (PGWP, spousal, IEC)
    
    As of March 25, 2025, LMIA-supported job offers no longer provide additional CRS points in Express Entry.
    Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada.html`,
        keywords: ["work permit", "lmia", "job offer", "open work permit", "pgwp"],
    },
    {
        topic: "Family Sponsorship",
        content: `Canadian citizens and PRs can sponsor:
    - Spouse or common-law partner
    - Dependent children
    - Parents and grandparents (through lottery system)
    
    Sponsors must meet income requirements (LICO) and commit to supporting the sponsored person.
    Processing times vary: spousal sponsorship typically 12 months, parents/grandparents 20-24 months.
    Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html`,
        keywords: ["family sponsorship", "spouse", "parents", "grandparents", "super visa"],
    },
];

/**
 * Retrieves relevant IRCC documents based on user query
 * @param query - User's question or search term
 * @param topK - Number of top documents to return (default: 3)
 * @returns Array of relevant document content strings
 */
export async function getRelevantDocs(query: string, topK: number = 3): Promise<string[]> {
    const queryLower = query.toLowerCase();

    const scored = IRCC_KNOWLEDGE_BASE.map((doc) => {
        let score = 0;

        for (const keyword of doc.keywords) {
            if (queryLower.includes(keyword)) {
                score += 2;
            }
        }

        if (queryLower.includes(doc.topic.toLowerCase())) {
            score += 3;
        }

        return { ...doc, score };
    });

    const topDocs = scored
        .filter((doc) => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    return topDocs.map((doc) => doc.content);
}

/**
 * Generates context-aware follow-up suggestions based on conversation
 * @param lastMessage - The last bot message in the conversation
 * @returns Array of suggested follow-up questions
 */
export function getSuggestions(lastMessage: string): string[] {
    const msgLower = lastMessage.toLowerCase();

    if (msgLower.includes("express entry") || msgLower.includes("crs")) {
        return [
            "How to improve my CRS score?",
            "What are Provincial Nominee Programs?",
            "Language test requirements",
        ];
    }

    if (msgLower.includes("study") || msgLower.includes("student")) {
        return [
            "Can I work while studying?",
            "What is PGWP?",
            "How to apply for study permit?",
        ];
    }

    if (msgLower.includes("work permit") || msgLower.includes("job")) {
        return [
            "Types of work permits",
            "Do I need LMIA?",
            "Open work permit eligibility",
        ];
    }

    if (msgLower.includes("sponsor") || msgLower.includes("family")) {
        return [
            "Spousal sponsorship timeline",
            "Income requirements for sponsorship",
            "Super visa for parents",
        ];
    }

    // Default suggestions
    return [
        "What is Express Entry and how does it work?",
        "How can I improve my CRS score?",
        "What are the language test requirements?",
        "Tell me about Provincial Nominee Programs",
        "Can I work while studying in Canada?",
        "What is the processing time for PR?",
    ];
}
