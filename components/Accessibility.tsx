import { accessibilityData } from "@/app/api/policy/accessibilityData";

export default function Accessibility() {
    const { sections } = accessibilityData;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
            <section className="mb-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-900 dark:text-gray-100">{section.title}</h3>
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
        </div>
    );
}
