export interface PolicySection {
  title: string;
  content: string | string[];
}

export interface Policy {
  id: string;
  title: string;
  effectiveDate: string;
  website: string;
  sections: PolicySection[];
}

export const policies: Policy[] = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    effectiveDate: "November 3, 2025",
    website: "https://immigration-tracker.vercel.app/",
    sections: [
      {
        title: "1. Introduction",
        content:
          'Immigration Tracker ("we," "us," or "our") operates <a href="/" className="text-blue-600 hover:underline">https://immigration-tracker.vercel.app/</a>, a website providing updates on Canada’s Express Entry system and Provincial Nominee Program (PNP) quotas. We are based in Ontario, Canada, and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect information when you visit our site. As the site is in its initial development phase, data displayed may be outdated, incomplete, or inaccurate, and users should verify information elsewhere.',
      },
      {
        title: "2. Information We Collect",
        content: [
          "<strong>Usage Data</strong>: We may collect anonymized data about your interactions with the site (e.g., page views, device type, geographic location) via Vercel’s Web Analytics, which is cookie-free and does not track personal information.",
          "<strong>No Personal Information</strong>: The site currently does not collect personal information (e.g., names, email addresses, or immigration details), as it lacks forms or user input features. If this changes, we will update this policy.",
          '<strong>Third-Party Hosting</strong>: Our site is hosted on Vercel, which may collect anonymized analytics data per their privacy practices (see <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline">Vercel Privacy Policy</a>).',
        ],
      },
      {
        title: "3. How We Use Your Information",
        content: [
          "To display and improve immigration tracking data (e.g., CRS scores, PNP quotas).",
          "To analyze site usage for performance optimization (via anonymized analytics).",
          "No personal data is collected or used, as the site is informational only.",
        ],
      },
      {
        title: "4. Data Sharing and Disclosure",
        content: [
          "We do not share or sell any data, as no personal information is collected.",
          "Anonymized analytics may be processed by Vercel, subject to their privacy terms.",
          "We may disclose data if required by law (e.g., under Canada’s Personal Information Protection and Electronic Documents Act [PIPEDA]) or to protect our legal rights.",
        ],
      },
      {
        title: "5. Data Accuracy Disclaimer",
        content:
          'The site is in its initial development phase, and data displayed (e.g., CRS scores, PNP quotas) may be outdated, incomplete, or inaccurate. Users must verify all information through official sources, such as Immigration, Refugees and Citizenship Canada (<a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" className="text-blue-600 hover:underline">IRCC</a>), before making decisions. We are not responsible for any damages or losses resulting from reliance on this site’s information. We are committed to improving data accuracy in future updates.',
      },
      {
        title: "6. Third-Party Links",
        content:
          "If our site includes links to external websites (e.g., IRCC), we are not responsible for their content or privacy practices. Please review their policies before use.",
      },
      {
        title: "7. Data Security",
        content:
          "We rely on Vercel’s security measures to protect site data. As no personal information is collected, risks to users are minimal. However, no online platform is 100% secure.",
      },
      {
        title: "8. International Users",
        content:
          "The site is hosted in the United States but operated from Ontario, Canada, and is subject to Canadian laws, including PIPEDA. By using the site, you consent to data processing in these jurisdictions, though no personal data is collected.",
      },
      {
        title: "9. Children’s Privacy",
        content:
          "The site is not intended for users under 19, the age of majority in Ontario, Canada. We do not knowingly collect data from children.",
      },
      {
        title: "10. Changes to This Policy",
        content:
          "We may update this Privacy Policy as the site evolves. Changes will be posted on this page with an updated effective date. Check periodically for updates.",
      },
      {
        title: "11. Contact Us",
        content:
          'For questions about this Privacy Policy, please contact us at: <a href="mailto:immigrationdatacanada@gmail.com" className="text-blue-600 hover:underline">immigrationdatacanada@gmail.com</a>. ',
      },
    ],
  },
];
