"use client";

import { useEffect } from "react";

type AdSenseAdProps = {
  adSlot: string; // data-ad-slot value
  style?: React.CSSProperties;
  className?: string;
  test?: boolean; // true => data-adtest="on"
};

export default function AdSenseAd({
  adSlot,
  style,
  className,
  test = false,
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // push ad slot (adsbygoogle may be undefined during SSR)
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        try {
          (window as any).adsbygoogle.push({});
        } catch (e) {
          // ignore duplicate push errors
        }
      }
    } catch (err) {
      console.error("AdSense push error", err);
    }
  }, [adSlot]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", ...style }}
      className={className}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", maxWidth: "100%" }}
        data-ad-client="ca-pub-4445802556511218"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(test ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
}
