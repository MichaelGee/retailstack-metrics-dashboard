import { useRef, useState, useCallback, useEffect } from 'react';

interface ScrollIndicatorState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export function useHorizontalScrollIndicator<T extends HTMLElement = HTMLDivElement>() {
  const scrollContainerRef = useRef<T>(null);
  const [scrollState, setScrollState] = useState<ScrollIndicatorState>({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // 1px threshold to handle sub-pixel rounding
    const canScrollLeft = scrollLeft > 1;
    const canScrollRight = scrollLeft + clientWidth < scrollWidth - 1;

    setScrollState(prev => {
      if (prev.canScrollLeft === canScrollLeft && prev.canScrollRight === canScrollRight) {
        return prev;
      }
      return { canScrollLeft, canScrollRight };
    });
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener('scroll', updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    // Also observe the table child for size changes (data loading, column toggles)
    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  return { scrollContainerRef, ...scrollState };
}
