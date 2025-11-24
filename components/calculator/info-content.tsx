import React from "react";

export const INFO_CONTENT = {
    age: (
        <>
            <p>If you were already invited, enter your age on the date of the invitation.</p>
            <p>If you are creating a profile, enter your current age.</p>
        </>
    ),

    education: (
        <>
            <p>Enter the highest level of education for which you:</p>
            <ul>
                <li>earned a Canadian credential, or</li>
                <li>completed an ECA for studies done outside Canada (must be from an approved organization, issued within the last five years)</li>
            </ul>
            <p>Canadian credentials must be from an accredited Canadian school (college, university, technical, or trade).</p>
            <p>Distance learning counts for education points but not bonus points.</p>
        </>
    ),

    officialLanguages: (
        <>
            <p>English and French are Canada's official languages.</p>
            <p>Language test results must be less than two years old for Express Entry.</p>
        </>
    ),

    canadianWork: (
        <>
            <p>Last 10 years. Must be:</p>
            <ul>
                <li>paid</li>
                <li>full-time or equivalent part-time</li>
                <li>physically working in Canada for a Canadian employer (including remote)</li>
                <li>TEER 0, 1, 2, or 3 occupation</li>
            </ul>
            <p>If unsure of TEER classification, search the <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/find-national-occupation-code.html" target="_blank" rel="noopener noreferrer">NOC system</a>.</p>
        </>
    ),

    foreignWork: (
        <>
            <p>Last 10 years. Must be:</p>
            <ul>
                <li>paid</li>
                <li>full-time or equivalent part-time</li>
                <li>in one NOC TEER 0, 1, 2, or 3 occupation</li>
            </ul>
        </>
    ),

    educationInCanada: (
        <>
            <p>To answer yes, all must be true:</p>
            <ul>
                <li>ESL or FSL studies made up no more than half the program</li>
                <li>You were not funded under a scholarship requiring return to your home country</li>
                <li>The institution was inside Canada (not a foreign campus)</li>
                <li>Full-time enrollment for at least eight months</li>
                <li>Physically present in Canada for at least eight months
                    <ul>
                        <li>Except for programs completed partly or fully between March 2020 and August 2022</li>
                    </ul>
                </li>
            </ul>
        </>
    ),

    arrangedEmployment: (
        <>
            <p>A valid job offer must be:</p>
            <ul>
                <li>For full-time work for at least one year</li>
                <li>Non-seasonal</li>
                <li>Supported by a Labour Market Impact Assessment (LMIA) or exempt from needing one</li>
                <li>From an employer with a business in Canada</li>
            </ul>
            <p><strong>Note:</strong> As of March 25, 2025, LMIA-supported job offers no longer earn points in Express Entry.</p>
        </>
    ),

    certificate: (
        <>
            <p>Issued by a province, territory, or federal body for certain skilled trades.</p>
            <p>Requires:</p>
            <ul>
                <li>assessment of skills, training, and experience</li>
                <li>passing a certification exam</li>
                <li>often requires assessment in the province or territory</li>
                <li>may require Canadian experience and employer involvement</li>
            </ul>
            <p><strong>Note:</strong> This is not the same as a provincial nomination.</p>
        </>
    ),

    sibling: (
        <>
            <p>To answer yes, the sibling must:</p>
            <ul>
                <li>be 18 or older</li>
                <li>be a Canadian permanent resident or citizen</li>
                <li>be related by blood, marriage (step-sibling), or adoption</li>
                <li>share at least one parent with you or your spouse</li>
            </ul>
        </>
    ),

    nomination: (
        <>
            <p>A provincial nomination adds 600 points to your CRS score, virtually guaranteeing an invitation to apply.</p>
            <p>You must have a valid nomination certificate from a province or territory through one of their Provincial Nominee Programs (PNPs).</p>
        </>
    ),
};
