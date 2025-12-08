// components/waitlist/utils.ts
export const simulateWaitlistSignup = async (email: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // For now, just store in localStorage for testing
            const existing = JSON.parse(localStorage.getItem('waitlist_emails') || '[]');
            if (!existing.includes(email)) {
                existing.push(email);
                localStorage.setItem('waitlist_emails', JSON.stringify(existing));
            }

            resolve({
                success: true,
                message: `Added ${email} to waitlist! We'll notify you when we launch.`
            });
        }, 1500);
    });
};