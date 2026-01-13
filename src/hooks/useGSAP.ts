import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGSAPScrollTrigger = () => {
  useEffect(() => {
    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
};

export const useFadeInOnScroll = (
  selector: string,
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
  }
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: options?.y ?? 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: options?.start ?? "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, options]);
};

export const useParallax = (
  selector: string,
  speed: number = 0.5
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      gsap.to(element, {
        yPercent: -100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, speed]);
};

export const useTextReveal = (selector: string) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      const text = element.textContent || "";
      element.innerHTML = "";
      
      // Create wrapper
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      
      const inner = document.createElement("span");
      inner.textContent = text;
      inner.style.display = "inline-block";
      inner.style.transform = "translateY(100%)";
      
      wrapper.appendChild(inner);
      element.appendChild(wrapper);

      gsap.to(inner, {
        y: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector]);
};

export { gsap, ScrollTrigger };
