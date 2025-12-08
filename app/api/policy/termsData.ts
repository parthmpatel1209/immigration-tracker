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
    effectiveDate: "December 8, 2025",
    website: "https://immigration-tracker.vercel.app/",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content:
          'By accessing or using Immigration Tracker ("the Site"), including joining our Waitlist, you agree to these Terms of Use ("Terms"). If you do not agree, strictly do not use the Site. We reserve the right to modify these Terms at any time. We are based in Ontario, Canada.',
      },
      {
        title: "2. Description of Service",
        content:
          "Immigration Tracker provides informational tools, news aggregates, and tracking dashboards for Canada’s Express Entry and PNP systems. The Site is currently free to use. We may introduce new features (e.g., Document Expiry Alerts) via our Early Access program.",
      },
      {
        title: "3. Early Access Waitlist",
        content: [
          "<strong>Voluntary Participation</strong>: You may voluntarily join our Waitlist to receive updates on new features. Participation does not guarantee immediate access to features.",
          "<strong>Accurate Information</strong>: You agree to provide a valid email address if you join the Waitlist.",
          "<strong>Unsubscribe</strong>: You may unsubscribe from the Waitlist at any time by clicking an \"Unsubscribe\" link in any email we send, or by emailing us directly at <a href='mailto:immigrationdatacanada@gmail.com' class='text-blue-600 hover:underline'>immigrationdatacanada@gmail.com</a> with subject line \"Unsubscribe.\"",
          "<strong>No Obligation</strong>: Joining the Waitlist creates no financial obligation. We do not sell subscriptions or charge fees for Waitlist entry.",
        ],
      },
      {
        title: "4. User Responsibilities",
        content: [
          '<strong>Verify Information</strong>: You must independently verify all data (e.g., scores, draws, news) through official sources like <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" class="text-blue-600 hover:underline">IRCC</a>.',
          "<strong>No Professional Relationship</strong>: Use of this Site does not create a lawyer-client or consultant-client relationship.",
          "<strong>Compliance</strong>: You agree to use the Site in compliance with all applicable laws of Ontario and Canada.",
        ],
      },
      {
        title: "5. Disclaimer of Warranties",
        content: [
          'The Site and its features (including Beta/Early Access tools) are provided "as is" without warranties of any kind.',
          "We do not guarantee that the data (CRS scores, PNP draws) is real-time, error-free, or exhaustive.",
          "Calculators and estimators are for rough guidance only and should not be relied upon for legal applications.",
        ],
      },
      {
        title: "6. Limitation of Liability",
        content: [
          "Under no circumstances shall Immigration Tracker or its operators be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Site.",
          "This includes liability for missed deadlines, rejected applications, or reliance on inaccurate data.",
          "This limitation applies to the fullest extent permitted by the laws of Ontario, Canada.",
        ],
      },
      {
        title: "7. Data Security & Breach Notification",
        content:
          "We use industry-standard security measures to protect your email address. If a security breach occurs that affects your information, we will notify you via email within 30 days, as required by Canadian privacy law.",
      },
      {
        title: "8. Intellectual Property",
        content:
          "All Site content (code, design, text, datasets) is the property of Immigration Tracker. You may use it for personal, non-commercial informational purposes only. Automated scraping or commercial redistribution is prohibited.",
      },
      {
        title: "9. Third-Party Links",
        content: [
          "We may link to external sites (e.g., provincial government sites, news outlets). We are not responsible for their content or accuracy.",
          "Hosting is provided by Vercel: <a href='https://vercel.com/legal/terms' class='text-blue-600 hover:underline'>https://vercel.com/legal/terms</a>",
        ],
      },
      {
        title: "10. Termination",
        content:
          "We reserve the right to terminate access or discontinue the Site (or any part of it) at any time without notice.",
      },
      {
        title: "11. Governing Law",
        content:
          "These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada. Any disputes arising from these Terms shall be resolved exclusively in the courts of Ontario, Canada.",
      },
      {
        title: "12. Contact Us",
        content:
          'For questions regarding these Terms, please contact: <a href="mailto:immigrationdatacanada@gmail.com" class="text-blue-600 hover:underline">immigrationdatacanada@gmail.com</a>',
      },
      {
        title: "13. Critical Disclaimer – Not Immigration Advice",
        content: `
    <strong>Immigration Tracker is NOT a government agency, law firm, or immigration consultancy.</strong>
    <br/><br/>
    The tools, chatbots, and content on this site are informational aids only. They are NOT a substitute for professional advice from a <strong>Regulated Canadian Immigration Consultant (RCIC)</strong> or an immigration lawyer.
    <br/><br/>
    <strong>You are solely responsible for your immigration applications.</strong> Always verify requirements with <a href='https://www.canada.ca/en/immigration-refugees-citizenship.html' class='text-blue-600 hover:underline'>IRCC</a>.
  `.trim(),
      },
    ],
  },
];
