"use client";

import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: ScrollDirection;
}

interface ScrollDirectionResult {
  scrollDirection: ScrollDirection;
  isScrolledTop: boolean;
  scrollY: number;
}

export function useScrollDirection({
  threshold = 10,
  initialDirection = null,
}: UseScrollDirectionOptions = {}): ScrollDirectionResult {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(initialDirection);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledTop, setIsScrolledTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolledTop(currentScrollY < 50);

      // Only detect direction if scrolled past threshold
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }

      const direction = currentScrollY > lastScrollY ? "down" : "up";
      
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }

      setLastScrollY(currentScrollY);
    };

    // Set initial scroll position
    setLastScrollY(window.scrollY);
    setScrollY(window.scrollY);
    setIsScrolledTop(window.scrollY < 50);

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, scrollDirection, threshold]);

  return { scrollDirection, isScrolledTop, scrollY };
}
