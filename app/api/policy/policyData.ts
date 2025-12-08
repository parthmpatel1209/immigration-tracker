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
    effectiveDate: "December 8, 2025",
    website: "https://immigration-tracker.vercel.app/",
    sections: [
      {
        title: "1. Introduction",
        content:
          'Immigration Tracker ("we," "us," or "our") operates <a href="/" className="text-blue-600 hover:underline">https://immigration-tracker.vercel.app/</a>, a website providing updates on Canada’s Express Entry system and Provincial Nominee Program (PNP) quotas. We are based in Ontario, Canada, and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect information when you visit our site. <strong>We do not sell any user data.</strong> The site is for informational purposes only and is completely free to use.',
      },
      {
        title: "2. Information We Collect",
        content: [
          "<strong>Voluntary Waitlist Information</strong>: If you choose to join our Early Access Waitlist, we collect your email address. This information is provided voluntarily by you for the sole purpose of receiving updates about our new features.",
          "<strong>Email Retention</strong>: We retain your waitlist email address only as long as needed to deliver feature updates and early access notifications. You may request deletion of your email at any time by emailing <a href='mailto:immigrationdatacanada@gmail.com' class='text-blue-600 hover:underline'>immigrationdatacanada@gmail.com</a>. Upon request, we will remove your email within 30 days.",
          "<strong>Usage Data</strong>: We collect anonymized data about your interactions (page views, device type, approximate geographic location based on IP address) via Vercel's Web Analytics. This data: <ul><li>Is NOT tied to individual users</li><li>Does NOT include cookies or tracking pixels</li><li>Is used ONLY to improve site performance</li><li>Is governed by Vercel's Privacy Policy: <a href='https://vercel.com/legal/privacy-policy' class='text-blue-600 hover:underline'>https://vercel.com/legal/privacy-policy</a></li></ul>",
          "<strong>Chatbot & AI-Generated Content</strong>: If you interact with our chatbot feature, we currently: <ul><li>Do NOT store your messages or questions</li><li>Do NOT use your inputs to train our models</li><li>Do NOT collect identifying information from your prompts</li></ul>However, we recommend <strong>NOT sharing sensitive immigration case details</strong> (personal names, dates of birth, passport numbers, case numbers) with the chatbot, as best practice.",
        ],
      },
      {
        title: "3. How We Use Your Information",
        content: [
          "<strong>Waitlist Communication</strong>: Your email address is used <strong>strictly</strong> to notify you about product launches, early access availability, and new features (e.g., Document Expiry Alerts, Smart Checklists).",
          "<strong>Site Improvement</strong>: Anonymized usage data helps us optimize site performance and improve user experience.",
          "<strong>No Commercial Sales</strong>: We do not use your information for third-party advertising, and we <strong>never</strong> sell, rent, or trade your email address to data brokers, immigration consultants, or any other third parties.",
        ],
      },
      {
        title: "4. Cookie & Analytics Policy",
        content: [
          "We use Vercel's Web Analytics, which: <ul><li>Does NOT use cookies</li><li>Does NOT create tracking profiles</li><li>Collects anonymized data only</li><li>Does NOT share data with third parties for advertising</li></ul>",
          "Analytics Policy Details: <a href='https://vercel.com/legal/privacy-policy' class='text-blue-600 hover:underline'>https://vercel.com/legal/privacy-policy</a>",
          "You can disable analytics in your browser settings if desired.",
        ],
      },
      {
        title: "5. Data Sharing and Disclosure",
        content: [
          "We do not share your personal information with third parties for marketing purposes.",
          "Data may be securely stored using third-party infrastructure providers (e.g., Vercel, database providers) solely for the purpose of operating the website.",
          "We may disclose data strictly if required by law (e.g., under Canada’s Personal Information Protection and Electronic Documents Act [PIPEDA]) or to protect our legal rights.",
        ],
      },
      {
        title: "6. Data Accuracy Disclaimer",
        content:
          'The site is in active development, and data displayed (e.g., CRS scores, PNP quotas) should be treated as informational estimates. <strong>We are an independent platform and not affiliated with the Government of Canada.</strong> Users must verify all information through official sources, such as Immigration, Refugees and Citizenship Canada (<a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" className="text-blue-600 hover:underline">IRCC</a>), before making decisions. We are not responsible for any damages or losses resulting from reliance on this site’s information.',
      },
      {
        title: "7. Data Security",
        content:
          "We employ industry-standard security measures to protect your email address and site data. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.",
      },
      {
        title: "8. International Users",
        content:
          "The site is hosted in the United States and operated from Ontario, Canada. It is subject to Canadian laws, including PIPEDA (<a href='https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/' class='text-blue-600 hover:underline'>https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/</a>). By using the site, you consent to data processing in these jurisdictions.",
      },
      {
        title: "9. Children’s Privacy",
        content:
          "The site is not intended for users under 19. We do not knowingly collect data from children.",
      },
      {
        title: "10. Notification of Changes",
        content: [
          "We may update these policies. We will:",
          "<ul><li>Post updates with new effective dates</li><li>Notify email subscribers of material changes via email</li><li>Provide 30-day notice before enforcement of significant changes</li></ul>",
          "Continued use of the Site after changes = acceptance of new terms.",
        ],
      },
      {
        title: "11. Contact Us",
        content:
          'For questions about this Privacy Policy or to request removal from our waitlist, please contact us at: <a href="mailto:immigrationdatacanada@gmail.com" className="text-blue-600 hover:underline">immigrationdatacanada@gmail.com</a>.',
      },
      {
        title: "12. Important Disclaimer – Not Legal Advice",
        content: `
    <strong>Immigration Tracker is NOT a law firm, immigration consultancy, or government agency.</strong><br/>
    The owner, developer, and contributors are <strong>not licensed</strong> to provide legal or immigration advice.
    All information, including AI-generated chatbot responses and deadlines features, is for **informational purposes only**.<br/><br/>
    <strong>We strongly recommend you:</strong>
    <ul class="list-disc pl-6 mt-2">
      <li>Verify every detail with the official <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" class="text-blue-600 hover:underline">IRCC website</a>.</li>
      <li>Consult a <strong>Regulated Canadian Immigration Consultant (RCIC)</strong> or lawyer before making any immigration decision.</li>
    </ul>
    <br/>
    <em>Relying on this site is at your own risk. We are not liable for any consequences, delays, or rejections.</em>
  `.trim(),
      },
    ],
  },
];
