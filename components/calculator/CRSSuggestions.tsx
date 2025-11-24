/**
 * CRS Improvement Suggestions Component
 * 
 * Displays personalized recommendations to help users improve their CRS score.
 */

"use client";

import { useState } from "react";
import { Suggestion } from "@/lib/crs-suggestions";
import {
    TrendingUp,
    BookOpen,
    Briefcase,
    Users,
    Award,
    MapPin,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    Target,
    Clock
} from "lucide-react";
import styles from "./CRSSuggestions.module.css";

interface CRSSuggestionsProps {
    suggestions: Suggestion[];
    currentScore: number;
    targetScore?: number;
}

const categoryIcons = {
    language: BookOpen,
    education: Award,
    work: Briefcase,
    spouse: Users,
    additional: Lightbulb,
    pnp: MapPin,
};

const priorityColors = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow,
};

const difficultyLabels = {
    easy: "Easy",
    moderate: "Moderate",
    challenging: "Challenging",
};

export default function CRSSuggestions({
    suggestions,
    currentScore,
    targetScore
}: CRSSuggestionsProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    if (suggestions.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Target className={styles.emptyIcon} />
                    <h3>Great Score!</h3>
                    <p>Your CRS score is competitive. Keep monitoring the latest draws!</p>
                </div>
            </div>
        );
    }

    // Separate high-priority suggestions
    const highPriority = suggestions.filter((s) => s.priority === "high");
    const otherSuggestions = suggestions.filter((s) => s.priority !== "high");

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <TrendingUp />
                </div>
                <div>
                    <h2 className={styles.title}>Personalized Improvement Plan</h2>
                    <p className={styles.subtitle}>
                        Based on your profile, here are {suggestions.length} ways to boost your CRS score
                        {targetScore && ` (Target: ${targetScore}+)`}
                    </p>
                </div>
            </div>

            {/* High Priority Section */}
            {highPriority.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.highPriorityBadge}>High Priority</span>
                        Quick Wins
                    </h3>
                    <div className={styles.suggestionsGrid}>
                        {highPriority.map((suggestion) => (
                            <SuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                isExpanded={expandedIds.has(suggestion.id)}
                                onToggle={() => toggleExpand(suggestion.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Suggestions */}
            {otherSuggestions.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Additional Opportunities</h3>
                    <div className={styles.suggestionsGrid}>
                        {otherSuggestions.map((suggestion) => (
                            <SuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                isExpanded={expandedIds.has(suggestion.id)}
                                onToggle={() => toggleExpand(suggestion.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/** Individual suggestion card */
function SuggestionCard({
    suggestion,
    isExpanded,
    onToggle
}: {
    suggestion: Suggestion;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const Icon = categoryIcons[suggestion.category];

    return (
        <div className={`${styles.card} ${priorityColors[suggestion.priority]}`}>
            {/* Card Header */}
            <div className={styles.cardHeader} onClick={onToggle}>
                <div className={styles.cardIcon}>
                    <Icon />
                </div>
                <div className={styles.cardHeaderContent}>
                    <h4 className={styles.cardTitle}>{suggestion.title}</h4>
                    <p className={styles.cardDescription}>{suggestion.description}</p>
                </div>
                <button className={styles.expandButton}>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </button>
            </div>

            {/* Card Meta */}
            <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                    <TrendingUp size={16} />
                    <span>+{suggestion.potentialPoints} points</span>
                </div>
                <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>{suggestion.timeframe}</span>
                </div>
                <div className={`${styles.difficultyBadge} ${styles[`difficulty${suggestion.difficulty}`]}`}>
                    {difficultyLabels[suggestion.difficulty]}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className={styles.cardExpanded}>
                    <h5 className={styles.actionTitle}>Action Steps:</h5>
                    <ol className={styles.actionSteps}>
                        {suggestion.actionSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}
