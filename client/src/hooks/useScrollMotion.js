import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal]";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function useScrollMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const header = root.querySelector(".site-header");
    const heroMedia = root.querySelector(".hero-banner-media");
    const heroCopy = root.querySelector(".hero-copy");
    const heroVisual = root.querySelector(".hero-visual");

    if (prefersReducedMotion()) {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        el.classList.add("is-revealed");
      });
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
    );

    const observeReveals = () => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (!el.classList.contains("is-revealed")) io.observe(el);
      });
    };

    observeReveals();
    const mutations = new MutationObserver(observeReveals);
    mutations.observe(root, { childList: true, subtree: true });

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        header?.classList.toggle("is-scrolled", y > 12);
        if (heroMedia) {
          heroMedia.style.setProperty("--hero-parallax", `${Math.round(y * 0.22)}px`);
        }
        if (heroCopy) {
          heroCopy.style.setProperty("--hero-shift", `${Math.round(y * 0.06)}px`);
        }
        if (heroVisual) {
          heroVisual.style.setProperty("--hero-shift", `${Math.round(y * 0.1)}px`);
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [rootRef]);
}
