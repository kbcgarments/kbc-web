"use client";

import { useEffect } from "react";

export default function FixThirdPartyIframes() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector(
        'iframe[src*="flutterwave.com"]',
      ) as HTMLIFrameElement | null;

      if (iframe && !iframe.title) {
        iframe.setAttribute("title", "Secure payment checkout");
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
