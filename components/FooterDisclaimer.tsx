// components/FooterDisclaimer.tsx
import styles from "./DisclaimerBanner.module.css"; // reuse some styles

export default function FooterDisclaimer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
      <div className="max-w-5xl mx-auto px-4 text-center text-xs sm:text-sm text-gray-600 leading-relaxed">
        <p>
          <strong className="text-amber-900">Warning: Disclaimer:</strong> This
          website is not affiliated with IRCC. All data is for informational
          purposes only and may be outdated.{" "}
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-amber-700 font-medium hover:text-amber-800"
          >
            Verify official information at IRCC.gc.ca
          </a>
        </p>
      </div>
    </footer>
  );
}
