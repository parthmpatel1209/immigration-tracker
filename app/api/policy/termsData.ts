export interface TermsSection {
  title: string;
  content: string | string[];
}

export interface Terms {
  id: string;
  title: string;
  effectiveDate: string;
  website: string;
  sections: TermsSection[];
}

/** All terms documents */
export const termsList: Terms[] = [
  {
    id: "terms-of-use",
    title: "Terms of Use",
    effectiveDate: "November 3, 2025",
    website: "https://immigration-tracker.vercel.app/",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content:
          'By accessing or using Immigration Tracker ("the Site"), you agree to these Terms of Use ("Terms"). If you do not agree, do not use the Site. We reserve the right to modify these Terms at any time, with changes posted on this page. We are based in Ontario, Canada.',
      },
      {
        title: "2. Purpose and Scope of the Site",
        content:
          "Immigration Tracker provides informational updates on Canada’s Express Entry system and Provincial Nominee Program (PNP) quotas. The Site is in its initial development phase, and all information (e.g., CRS scores, draw updates) may be outdated, incomplete, or inaccurate. The Site is for informational purposes only and does not provide legal, immigration, or professional advice.",
      },
      {
        title: "3. User Responsibilities",
        content: [
          '<strong>Verify Information</strong>: You must independently verify all data on the Site through official sources (e.g., <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" class="text-blue-600 hover:underline">IRCC</a>) before relying on it for immigration or other decisions.',
          "<strong>Use at Your Own Risk</strong>: You acknowledge that use of the Site is at your sole risk, and we are not liable for any inaccuracies or consequences of your reliance on the information.",
          "<strong>Compliance</strong>: You agree to use the Site in compliance with all applicable laws, including those of Ontario, Canada.",
        ],
      },
      {
        title: "4. Disclaimer of Warranties",
        content: [
          'The Site is provided "as is" with no warranties, express or implied, regarding accuracy, completeness, or availability.',
          "As the Site is in its initial phase, we are actively working to improve data accuracy but make no guarantees about current or future reliability.",
          "We do not guarantee uninterrupted access to the Site or compatibility with your devices.",
        ],
      },
      {
        title: "5. Limitation of Liability",
        content: [
          "Immigration Tracker, its operators, and affiliates are not liable for any direct, indirect, incidental, or consequential damages arising from:",
          '<ul class="list-disc pl-6"><li>Inaccurate, outdated, or incomplete data on the Site.</li><li>Decisions made based on Site information.</li><li>Site unavailability or technical issues.</li></ul>',
          "This limitation applies to the fullest extent permitted by the laws of Ontario, Canada.",
        ],
      },
      {
        title: "6. Intellectual Property",
        content:
          "All content on the Site (e.g., text, icons, data displays) is owned by Immigration Tracker or its licensors. You may not reproduce, distribute, or modify content without permission, except for personal, non-commercial use.",
      },
      {
        title: "7. Third-Party Services and Links",
        content: [
          'The Site is hosted on Vercel, subject to their terms (see <a href="https://vercel.com/legal/terms" class="text-blue-600 hover:underline">Vercel Terms</a>).',
          "Any external links (e.g., to IRCC) are provided for convenience, and we are not responsible for their content or accuracy.",
        ],
      },
      {
        title: "8. Prohibited Conduct",
        content: [
          "Use the Site for illegal purposes.",
          "Attempt to hack, reverse-engineer, or disrupt the Site.",
          "Scrape or misuse Site data for commercial purposes.",
        ],
      },
      {
        title: "9. Termination",
        content:
          "We may suspend or terminate access to the Site at our discretion, without notice, for any reason, including violation of these Terms.",
      },
      {
        title: "10. Governing Law",
        content:
          "These Terms are governed by the laws of the Province of Ontario, Canada, and applicable federal laws of Canada. Any disputes will be resolved in the courts of Ontario, Canada.",
      },
      {
        title: "11. Contact Us",
        content:
          'For questions about these Terms, email: <a href="mailto:immigrationdatacanada@gmail.com" class="text-blue-600 hover:underline">immigrationdatacanada@gmail.com</a>',
      },
      {
        title: "12. Critical Disclaimer – Not Immigration Advice",
        content: `
    <strong>Immigration Tracker, its owner, coder, editor, and any contributors are NOT certified immigration consultants, lawyers, or authorized representatives of IRCC.</strong>
    <br/><br/>
    The **chatbot** that appears on various pages is **AI-generated** and may provide **inaccurate, outdated, unverified, or irrelevant information**.
    <br/><br/>
    <strong>You must:</strong>
    <ul class="list-disc pl-6 mt-2">
      <li>Always double-check data with the official <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" class="text-blue-600 hover:underline">IRCC website</a>.</li>
      <li>Seek advice from a <strong>Regulated Canadian Immigration Consultant (RCIC)</strong> or licensed lawyer before acting.</li>
    </ul>
    <br/>
    <em>We provide this site to help you find information as accurately as possible, but we are not responsible for any decisions made based on its content.</em>
  `.trim(),
      },
    ],
  },
];
