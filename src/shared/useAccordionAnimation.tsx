import { useState, useCallback } from 'react';

const useAccordionAnimation = (
  ref: React.RefObject<HTMLElement | null> | null,
  getClosedHeight: () => string,
) => {
  const [open, setOpen] = useState(true);
  function collapseSection(element: HTMLElement, closedHeight: string) {
    const sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';
    setTimeout(() => {
      element.style.height = closedHeight;
    }, 100);
  }
  function expandSection(element: HTMLElement) {
    const zero = performance.now();
    function animate() {
      const value = (performance.now() - zero) / 700;
      if (value < 1) {
        element.style.height = element.scrollHeight + 8 + 'px';
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }

  const toggle = useCallback(() => {
    if (!ref || !ref.current) return;
    setOpen((prev) => !prev);
    if (open) {
      collapseSection(ref.current, getClosedHeight());
    } else {
      expandSection(ref.current);
    }
  }, [open, ref, getClosedHeight]);

  return { toggle, open };
};

export default useAccordionAnimation;
