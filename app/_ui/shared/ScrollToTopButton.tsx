"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  triggerRef: React.RefObject<HTMLElement | null>;
}

export default function ScrollToTopButton({
  triggerRef,
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = triggerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0 },
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [triggerRef]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-6 bottom-6 z-50 cursor-pointer rounded-full border border-emerald-600 bg-white p-3 text-emerald-600 opacity-70 shadow-lg transition-colors hover:bg-gray-100"
      aria-label="맨 위로 이동"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
