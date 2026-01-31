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
    effectiveDate: "January 31, 2026",
    website: "https://immigration-tracker.vercel.app/",
    sections: [
      {
        title: "Definitions",
        content: [
          'For purposes of these Terms of Use:',
          '<ul><li><strong>"Site" or "Service"</strong> refers to Immigration Tracker (immigration-tracker.vercel.app)</li><li><strong>"We," "us," "our"</strong> refers to Immigration Tracker and its operators</li><li><strong>"You," "your"</strong> refers to users of the Site</li><li><strong>"Content"</strong> means all text, data, information, software, graphics, or other materials</li></ul>',
        ],
      },
      {
        title: "1. Acceptance of Terms",
        content:
          'By accessing or using Immigration Tracker ("the Site"), including creating an account or joining our Waitlist, you agree to these Terms of Use ("Terms"). If you do not agree, you must not use the Site. We reserve the right to modify these Terms at any time. Immigration Tracker is operated from Ontario, Canada.',
      },
      {
        title: "2. Description of Service",
        content:
          "Immigration Tracker provides informational tools, news aggregates, and tracking dashboards for Canada's Express Entry and PNP systems. The Site is currently free to use. We reserve the right to introduce paid features or subscriptions in the future, with 60 days' advance notice to users. Existing free features will remain free unless otherwise communicated with 60 days' notice.",
      },
      {
        title: "3. Early Access Waitlist",
        content: [
          "<strong>Voluntary Participation</strong>: You may voluntarily join our Waitlist to receive updates on new features. Participation does not guarantee immediate access to features.",
          "<strong>Accurate Information</strong>: You agree to provide a valid email address if you join the Waitlist.",
          "<strong>Unsubscribe</strong>: You may unsubscribe from the Waitlist at any time by clicking an \"Unsubscribe\" link in any email we send, or by emailing us directly at <a href='mailto:contact@peakshift.ca' class='text-blue-600 hover:underline'>contact@peakshift.ca</a> with subject line \"Unsubscribe.\"",
          "<strong>No Obligation</strong>: Joining the Waitlist creates no financial obligation. We do not sell subscriptions or charge fees for Waitlist entry.",
        ],
      },
      {
        title: "4. User Accounts and Responsibilities",
        content: [
          '<strong>Account Creation</strong>: To access certain features, you may need to create an account. You agree to provide accurate, current, and complete information during registration.',
          '<strong>Account Security</strong>: You are responsible for: <ul><li>Maintaining the confidentiality of your password</li><li>All activities that occur under your account</li><li>Notifying us immediately of any unauthorized access at <a href="mailto:contact@peakshift.ca" class="text-blue-600 hover:underline">contact@peakshift.ca</a></li></ul>We are not liable for losses arising from unauthorized use of your account.',
          '<strong>Verify Information</strong>: You must independently verify all data (e.g., scores, draws, news) through official sources like <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" class="text-blue-600 hover:underline">IRCC</a>.',
          "<strong>No Professional Relationship</strong>: Use of this Site does not create a lawyer-client or consultant-client relationship.",
          "<strong>Compliance</strong>: You agree to use the Site in compliance with all applicable laws of Ontario and Canada.",
        ],
      },
      {
        title: "5. User Content and Conduct",
        content: [
          "<strong>Your Content</strong>: You retain ownership of any data or information you input into the Site. By using the Site, you grant us a limited license to store and process this data solely to provide services to you.",
          "<strong>Prohibited Uses</strong>: You agree not to: <ul><li>Use the Site for any unlawful purpose</li><li>Attempt to gain unauthorized access to our systems</li><li>Interfere with the proper functioning of the Site</li><li>Use automated tools to scrape or extract data without permission</li><li>Impersonate others or provide false information</li><li>Upload malicious code or viruses</li></ul>",
          "<strong>Termination for Violation</strong>: We reserve the right to suspend or terminate accounts that violate these terms without prior notice.",
        ],
      },
      {
        title: "6. Disclaimer of Warranties",
        content: [
          'The Site and its features (including Beta/Early Access tools) are provided "as is" without warranties of any kind, either express or implied.',
          "We do not guarantee that the data (CRS scores, PNP draws) is real-time, error-free, or exhaustive.",
          "Calculators and estimators are for rough guidance only and should not be relied upon for legal applications.",
          "We do not warrant that the Site will be uninterrupted, secure, or error-free.",
        ],
      },
      {
        title: "7. Limitation of Liability",
        content: [
          "Under no circumstances shall Immigration Tracker or its operators be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Site.",
          "This includes liability for missed deadlines, rejected applications, or reliance on inaccurate data.",
          "To the maximum extent permitted by law, our total liability to you for all claims shall not exceed CAD $100 or the amount you paid us in the past 12 months (whichever is greater).",
          "This limitation applies to the fullest extent permitted by the laws of Ontario, Canada.",
        ],
      },
      {
        title: "8. Indemnification",
        content:
          "You agree to indemnify and hold harmless Immigration Tracker, its operators, and affiliates from any claims, damages, losses, liabilities, or expenses (including reasonable legal fees) arising from: <ul><li>Your use of the Site</li><li>Your violation of these Terms</li><li>Your violation of any third-party rights</li><li>Any immigration decisions you make based on Site information</li><li>Your account or content</li></ul>",
      },
      {
        title: "9. Data Security & Breach Notification",
        content:
          "We use industry-standard security measures to protect your information. If a security breach occurs that affects your information, we will notify you via email within 30 days, as required by Canadian privacy law.",
      },
      {
        title: "10. Intellectual Property",
        content:
          "All Site content (code, design, text, datasets, logos) is the property of Immigration Tracker or its licensors and is protected by Canadian and international copyright laws. You may use it for personal, non-commercial informational purposes only. Automated scraping, commercial redistribution, or reproduction without written permission is prohibited.",
      },
      {
        title: "11. Third-Party Links and Services",
        content: [
          "We may link to external sites (e.g., provincial government sites, news outlets, IRCC). We are not responsible for their content, accuracy, or privacy practices.",
          "Hosting is provided by Vercel: <a href='https://vercel.com/legal/terms' class='text-blue-600 hover:underline'>https://vercel.com/legal/terms</a>",
          "Database services provided by Supabase: <a href='https://supabase.com/terms' class='text-blue-600 hover:underline'>https://supabase.com/terms</a>",
        ],
      },
      {
        title: "12. Termination",
        content: [
          "We reserve the right to terminate or suspend your access to the Site (or any part of it) at any time, with or without cause, with or without notice.",
          "You may terminate your account at any time by using the account deletion feature or contacting us at <a href='mailto:contact@peakshift.ca' class='text-blue-600 hover:underline'>contact@peakshift.ca</a>.",
          "Upon termination, your right to use the Site will immediately cease. Sections of these Terms that by their nature should survive termination will survive.",
        ],
      },
      {
        title: "13. Governing Law and Dispute Resolution",
        content: [
          "These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada, without regard to conflict of law principles.",
          "Any disputes arising from these Terms or your use of the Site shall be resolved exclusively in the courts of Ontario, Canada.",
          "You agree to submit to the personal jurisdiction of such courts.",
        ],
      },
      {
        title: "14. Severability",
        content:
          "If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.",
      },
      {
        title: "15. Entire Agreement",
        content:
          "These Terms, together with our Privacy Policy, constitute the entire agreement between you and Immigration Tracker regarding use of the Site, superseding any prior agreements or understandings.",
      },
      {
        title: "16. Changes to Terms",
        content: [
          "We may update these Terms from time to time. We will:",
          "<ul><li>Post updates with new effective dates on this page</li><li>Notify account holders of material changes via email</li><li>Provide 30-day notice before enforcement of significant changes</li></ul>",
          "Continued use of the Site after changes constitutes acceptance of the updated Terms.",
        ],
      },
      {
        title: "17. Contact Us",
        content:
          'For questions regarding these Terms, please contact: <a href="mailto:contact@peakshift.ca" class="text-blue-600 hover:underline">contact@peakshift.ca</a>',
      },
      {
        title: "18. Critical Disclaimer – Not Immigration Advice",
        content: `
    <strong>Immigration Tracker is NOT a government agency, law firm, or immigration consultancy.</strong>
    <br/><br/>
    The tools, chatbots, and content on this site are informational aids only. They are NOT a substitute for professional advice from a <strong>Regulated Canadian Immigration Consultant (RCIC)</strong> or an immigration lawyer.
    <br/><br/>
    <strong>AI-Generated Content</strong>: Our chatbot uses artificial intelligence and may produce inaccurate or incomplete information. All AI-generated responses should be independently verified. We are not responsible for errors in AI-generated content.
    <br/><br/>
    <strong>You are solely responsible for your immigration applications.</strong> Always verify requirements with <a href='https://www.canada.ca/en/immigration-refugees-citizenship.html' class='text-blue-600 hover:underline'>IRCC</a>.
    <br/><br/>
    <em>Use of this site is at your own risk. We are not liable for any immigration consequences, application delays, or rejections.</em>
  `.trim(),
      },
    ],
  },
];
