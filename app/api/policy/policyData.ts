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
    effectiveDate: "January 31, 2026",
    website: "https://immigration-tracker.vercel.app/",
    sections: [
      {
        title: "Definitions",
        content: [
          'For purposes of this Privacy Policy:',
          '<ul><li><strong>"Site" or "Service"</strong> refers to Immigration Tracker (immigration-tracker.vercel.app)</li><li><strong>"We," "us," "our"</strong> refers to Immigration Tracker and its operators</li><li><strong>"You," "your"</strong> refers to users of the Site</li><li><strong>"Personal Information"</strong> means information that identifies you as an individual</li></ul>',
        ],
      },
      {
        title: "1. Introduction",
        content:
          'Immigration Tracker ("we," "us," or "our") operates <a href="/" className="text-blue-600 hover:underline">https://immigration-tracker.vercel.app/</a>, a website providing updates on Canada\'s Express Entry system and Provincial Nominee Program (PNP) quotas. Immigration Tracker is operated from Ontario, Canada, and we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect information when you visit our site. <strong>We do not sell any user data.</strong> The site is for informational purposes only and is currently free to use.',
      },
      {
        title: "2. Information We Collect",
        content: [
          "<strong>User Account Information</strong>: If you create an account, we collect: <ul><li>Email address (for authentication and communication)</li><li>Password (stored as encrypted hash)</li><li>Profile preferences and settings</li><li>Immigration tracking data you choose to save</li><li>Document expiry dates and reminders you set</li></ul>This data is stored securely in our database (hosted by Supabase) and is used solely to provide you with personalized features and save your progress.",
          "<strong>Voluntary Waitlist Information</strong>: If you choose to join our Early Access Waitlist, we collect your email address. This information is provided voluntarily by you for the sole purpose of receiving updates about our new features.",
          "<strong>Usage Data</strong>: We collect anonymized data about your interactions (page views, device type, approximate geographic location based on IP address) via Vercel's Web Analytics. This data: <ul><li>Is NOT tied to individual users</li><li>Does NOT include cookies or tracking pixels</li><li>Is used ONLY to improve site performance</li><li>Is governed by Vercel's Privacy Policy: <a href='https://vercel.com/legal/privacy-policy' class='text-blue-600 hover:underline'>https://vercel.com/legal/privacy-policy</a></li></ul>",
          "<strong>Chatbot & AI-Generated Content</strong>: If you interact with our chatbot feature, we currently: <ul><li>Do NOT store your messages or questions</li><li>Do NOT use your inputs to train our models</li><li>Do NOT collect identifying information from your prompts</li></ul>However, we recommend <strong>NOT sharing sensitive immigration case details</strong> (personal names, dates of birth, passport numbers, case numbers) with the chatbot, as best practice. <strong>AI Disclaimer</strong>: Our chatbot uses artificial intelligence and may produce inaccurate or incomplete information. All AI-generated responses should be independently verified.",
        ],
      },
      {
        title: "3. How We Use Your Information",
        content: [
          "<strong>Account Services</strong>: Your account information is used to: <ul><li>Authenticate your identity and secure your account</li><li>Save your immigration tracking progress</li><li>Provide personalized reminders and alerts</li><li>Enable cross-device synchronization</li></ul>",
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
          "<strong>Infrastructure Providers</strong>: We use the following trusted third-party services to operate the Site: <ul><li><strong>Vercel</strong> (hosting and analytics) - <a href='https://vercel.com/legal/privacy-policy' class='text-blue-600 hover:underline'>Privacy Policy</a></li><li><strong>Supabase</strong> (database and authentication) - <a href='https://supabase.com/privacy' class='text-blue-600 hover:underline'>Privacy Policy</a></li></ul>These providers have access to data only as necessary to perform their services and are contractually obligated to protect your information.",
          "We may disclose data strictly if required by law (e.g., under Canada's Personal Information Protection and Electronic Documents Act [PIPEDA]) or to protect our legal rights.",
        ],
      },
      {
        title: "6. Data Security",
        content:
          "We employ industry-standard security measures including: <ul><li>Encrypted data transmission (HTTPS/TLS)</li><li>Encrypted password storage (industry-standard hashing)</li><li>Row-level security policies in our database</li><li>Regular security audits and updates</li><li>Secure authentication protocols</li></ul>However, no method of transmission over the Internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        title: "7. Data Retention and Deletion",
        content: [
          "<strong>Account Data</strong>: We retain your account information for as long as your account is active or as needed to provide services.",
          "<strong>Right to Deletion</strong>: You may request deletion of your account and all associated data at any time by: <ul><li>Using the account deletion feature in your profile settings, OR</li><li>Emailing us at <a href='mailto:contact@peakshift.ca' class='text-blue-600 hover:underline'>contact@peakshift.ca</a></li></ul>Upon request, we will delete your data within 30 days, except where retention is required by law.",
          "<strong>Waitlist Data</strong>: Waitlist email addresses are retained until you unsubscribe or request deletion.",
          "<strong>Inactive Accounts</strong>: Accounts inactive for 24 months may be automatically deleted after email notification.",
        ],
      },
      {
        title: "8. Your Privacy Rights",
        content: [
          "Under Canadian privacy law (PIPEDA), you have the right to:",
          "<ul><li><strong>Access</strong>: Request a copy of the personal information we hold about you</li><li><strong>Correction</strong>: Request correction of inaccurate information</li><li><strong>Deletion</strong>: Request deletion of your personal information</li><li><strong>Portability</strong>: Request your data in a portable format</li><li><strong>Withdraw Consent</strong>: Opt out of non-essential communications</li></ul>",
          "To exercise these rights, contact us at <a href='mailto:contact@peakshift.ca' class='text-blue-600 hover:underline'>contact@peakshift.ca</a>. We will respond within 30 days.",
        ],
      },
      {
        title: "9. Data Accuracy Disclaimer",
        content:
          'The site is in active development, and data displayed (e.g., CRS scores, PNP quotas) should be treated as informational estimates. <strong>We are an independent platform and not affiliated with the Government of Canada.</strong> Users must verify all information through official sources, such as Immigration, Refugees and Citizenship Canada (<a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" className="text-blue-600 hover:underline">IRCC</a>), before making decisions. We are not responsible for any damages or losses resulting from reliance on this site\'s information.',
      },
      {
        title: "10. International Users",
        content:
          "The site is hosted on Vercel's infrastructure (United States) with database services provided by Supabase (United States region). The Site is operated from Ontario, Canada, and is subject to Canadian laws, including PIPEDA (<a href='https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/' class='text-blue-600 hover:underline'>Learn more</a>). By using the site, you consent to data processing in these jurisdictions.",
      },
      {
        title: "11. Children's Privacy",
        content:
          "The site is not intended for users under 19. We do not knowingly collect data from children.",
      },
      {
        title: "12. Notification of Changes",
        content: [
          "We may update this Privacy Policy from time to time. We will:",
          "<ul><li>Post updates with new effective dates on this page</li><li>Notify email subscribers and account holders of material changes via email</li><li>Provide 30-day notice before enforcement of significant changes</li></ul>",
          "Continued use of the Site after changes constitutes acceptance of the updated Privacy Policy.",
        ],
      },
      {
        title: "13. Contact Us",
        content:
          'For questions about this Privacy Policy, to exercise your privacy rights, or to request removal from our waitlist, please contact us at: <a href="mailto:contact@peakshift.ca" className="text-blue-600 hover:underline">contact@peakshift.ca</a>',
      },
      {
        title: "14. Important Disclaimer – Not Legal Advice",
        content: `
    <strong>Immigration Tracker is NOT a law firm, immigration consultancy, or government agency.</strong><br/>
    The owner, developer, and contributors are <strong>not licensed</strong> to provide legal or immigration advice.
    All information, including AI-generated chatbot responses and deadline features, is for <strong>informational purposes only</strong>.<br/><br/>
    <strong>We strongly recommend you:</strong>
    <ul class="list-disc pl-6 mt-2">
      <li>Verify every detail with the official <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" class="text-blue-600 hover:underline">IRCC website</a></li>
      <li>Consult a <strong>Regulated Canadian Immigration Consultant (RCIC)</strong> or immigration lawyer before making any immigration decision</li>
    </ul>
    <br/>
    <em>Relying on this site is at your own risk. We are not liable for any consequences, delays, or rejections resulting from use of this site.</em>
  `.trim(),
      },
    ],
  },
];
