// components/calculator/ShareScoreButton.tsx
"use client";

export default function ShareScoreButton({
  score,
  bestMatch,
}: {
  score: number;
  bestMatch?: string;
}) {
  const share = () => {
    const text = `My Express Entry CRS score is ${score}!\n${
      bestMatch ? `Best match: ${bestMatch}` : ""
    }\nCheck yours → https://yourdomain.com`;

    navigator.clipboard.writeText(text);
    alert("Copied to clipboard! Share with friends");
  };

  return (
    <button
      onClick={share}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        <path d="M6 8a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1V9a1 1 0 00-1-1H6z" />
      </svg>
      <span>Copy My Score & Share</span>
    </button>
  );
}
