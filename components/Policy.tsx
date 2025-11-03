import Link from "next/link";
import { policies, type Policy } from "@/app/api/policy/policyData";

export default function Policy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Policies for Immigration Tracker
      </h1>

      {/* Navigation Links */}
      <nav className="flex justify-center gap-4 mb-8">
        {policies.map((policy) => (
          <a
            key={policy.id}
            href={`#${policy.id}`}
            className="text-blue-600 hover:underline"
          >
            {policy.title}
          </a>
        ))}
      </nav>

      {/* Policy Sections */}
      {policies.map((policy: Policy) => (
        <section key={policy.id} id={policy.id} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{policy.title}</h2>
          <p className="text-sm text-gray-600 mb-4">
            Effective Date: {policy.effectiveDate}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Website:{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              {policy.website}
            </Link>
          </p>

          {policy.sections.map((section, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium mt-4">{section.title}</h3>
              {Array.isArray(section.content) ? (
                <ul className="list-disc pl-6 mb-2">
                  {section.content.map((item, idx) => (
                    <li
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: item }}
                      className="mb-2"
                    />
                  ))}
                </ul>
              ) : (
                <p
                  className="mb-2"
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
