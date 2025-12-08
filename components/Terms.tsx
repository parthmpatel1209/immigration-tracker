// src/components/Terms.tsx
import Link from "next/link";
import { termsList, Terms as TermsType } from "@/app/api/policy/termsData";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
      {/* Render each term */}
      {termsList.map((term: TermsType) => (
        <section key={term.id} id={term.id} className="mb-12">

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Effective Date: {term.effectiveDate}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Website:{" "}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              {term.website}
            </Link>
          </p>

          {term.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-medium mt-4 text-gray-900 dark:text-gray-100">{section.title}</h3>

              {Array.isArray(section.content) ? (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  {section.content.map((item, i) => (
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{ __html: item }}
                      className="leading-relaxed [&>a]:text-blue-600 [&>a]:dark:text-blue-400 [&>a]:hover:underline"
                    />
                  ))}
                </ul>
              ) : (
                <p
                  className="leading-relaxed text-gray-700 dark:text-gray-300 [&>a]:text-blue-600 [&>a]:dark:text-blue-400 [&>a]:hover:underline"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
