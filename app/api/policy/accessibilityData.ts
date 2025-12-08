export interface AccessibilitySection {
    title: string;
    content: string | string[];
}

export interface AccessibilityPolicy {
    id: string;
    title: string;
    sections: AccessibilitySection[];
}

export const accessibilityData: AccessibilityPolicy = {
    id: "accessibility-statement",
    title: "Accessibility Statement",
    sections: [
        {
            title: "Commitment to Accessibility",
            content: "Immigration Tracker is committed to making our website accessible to all users, including those with disabilities, in compliance with the Accessibility for Ontarians with Disabilities Act (AODA).",
        },
        {
            title: "Our Website Aims to Meet",
            content: [
                "WCAG 2.0 Level AA accessibility standards",
                "Keyboard navigation without a mouse",
                "Screen reader compatibility (JAWS, NVDA, VoiceOver)",
                "Sufficient color contrast for readability",
                "Resizable text and adjustable font sizes",
            ],
        },
        {
            title: "Accessibility Issues?",
            content: "If you encounter barriers, email: <a href='mailto:immigrationdatacanada@gmail.com' class='text-blue-600 hover:underline'>immigrationdatacanada@gmail.com</a>.<br/>We will respond within 7 business days.",
        },
        {
            title: "Resources",
            content: [
                "Learn more about AODA: <a href='https://www.ontario.ca/page/about-accessibility-laws' class='text-blue-600 hover:underline'>https://www.ontario.ca/page/about-accessibility-laws</a>",
                "Learn more about WCAG: <a href='https://www.w3.org/WAI/standards-guidelines/wcag/' class='text-blue-600 hover:underline'>https://www.w3.org/WAI/standards-guidelines/wcag/</a>",
            ],
        },
    ],
};
