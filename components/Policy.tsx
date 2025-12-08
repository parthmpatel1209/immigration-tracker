import Link from "next/link";
import { policies, type Policy } from "@/app/api/policy/policyData";

export default function Policy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
      {/* Policy Sections */}
      {policies.map((policy: Policy) => (
        <section key={policy.id} id={policy.id} className="mb-12">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Effective Date: {policy.effectiveDate}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Website:{" "}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              {policy.website}
            </Link>
          </p>

          {policy.sections.map((section, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium mt-4 text-gray-900 dark:text-gray-100">{section.title}</h3>
              {Array.isArray(section.content) ? (
                <ul className="list-disc pl-6 mb-2 text-gray-700 dark:text-gray-300">
                  {section.content.map((item, idx) => (
                    <li
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: item }}
                      className="mb-2 [&>a]:text-blue-600 [&>a]:dark:text-blue-400 [&>a]:hover:underline"
                    />
                  ))}
                </ul>
              ) : (
                <p
                  className="mb-2 text-gray-700 dark:text-gray-300 [&>a]:text-blue-600 [&>a]:dark:text-blue-400 [&>a]:hover:underline"
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
