"use client";

import { useRef, useEffect, useState } from "react";

interface FitTitleProps {
  children: string;
  maxFontSize?: number;
  minFontSize?: number;
  className?: string;
}

export default function FitTitle({
  children,
  maxFontSize = 36,
  minFontSize = 20,
  className = "",
}: FitTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fit = () => {
      // Use container width to pick a sensible starting size
      const width = el.clientWidth;
      let start = maxFontSize;
      if (width < 640) {
        // Small screens: start from a proportionally smaller size
        start = Math.min(maxFontSize, Math.max(minFontSize, width * 0.07));
      }

      let size = start;
      el.style.fontSize = `${size}px`;

      while (el.scrollWidth > el.clientWidth && size > minFontSize) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, maxFontSize, minFontSize]);

  return (
    <h1
      ref={containerRef}
      className={className}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {children}
    </h1>
  );
}
