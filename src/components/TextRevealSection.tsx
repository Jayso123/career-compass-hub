import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TextRevealSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;
    const counter = counterRef.current;

    if (!section) return;

    // Pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=200%",
      pin: true,
    });

    // Text reveal animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=200%",
        scrub: 1,
      },
    });

    if (line1 && line2 && line3) {
      // Line 1
      tl.fromTo(
        line1,
        { opacity: 0, y: 100, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1 }
      )
        // Line 2
        .fromTo(
          line2,
          { opacity: 0, y: 100, rotateX: -90 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1 },
          "-=0.5"
        )
        // Line 3
        .fromTo(
          line3,
          { opacity: 0, y: 100, rotateX: -90 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1 },
          "-=0.5"
        );
    }

    // Counter animation
    if (counter) {
      const numbers = counter.querySelectorAll(".counter-item");
      gsap.fromTo(
        numbers,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate counter values
      numbers.forEach((num) => {
        const valueEl = num.querySelector(".counter-value");
        if (valueEl) {
          const target = parseInt(valueEl.getAttribute("data-target") || "0");
          gsap.fromTo(
            { val: 0 },
            { val: target },
            {
              duration: 2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 30%",
                toggleActions: "play none none reverse",
              },
              onUpdate: function () {
                valueEl.textContent = Math.round(this.targets()[0].val).toLocaleString();
              },
            }
          );
        }
      });
    }

    return () => {
      pinTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-background overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      {/* Animated background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-border/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-border/40 rounded-full" />
      </div>

      <div ref={textRef} className="relative z-10 text-center px-4" style={{ perspective: "1000px" }}>
        <div
          ref={line1Ref}
          className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground leading-tight"
          style={{ transformStyle: "preserve-3d" }}
        >
          Your Career Journey
        </div>
        <div
          ref={line2Ref}
          className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-highlight to-accent">
            Starts Here
          </span>
        </div>
        <div
          ref={line3Ref}
          className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto"
          style={{ transformStyle: "preserve-3d" }}
        >
          Join the community of ambitious professionals who've transformed their careers with expert mentorship
        </div>

        {/* Counters */}
        <div ref={counterRef} className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-16">
          <div className="counter-item text-center">
            <div
              className="counter-value text-4xl sm:text-5xl font-bold text-accent"
              data-target="5000"
            >
              0
            </div>
            <div className="text-muted-foreground mt-2">Students Mentored</div>
          </div>
          <div className="counter-item text-center">
            <div
              className="counter-value text-4xl sm:text-5xl font-bold text-highlight"
              data-target="98"
            >
              0
            </div>
            <div className="text-muted-foreground mt-2">% Success Rate</div>
          </div>
          <div className="counter-item text-center">
            <div
              className="counter-value text-4xl sm:text-5xl font-bold text-accent"
              data-target="150"
            >
              0
            </div>
            <div className="text-muted-foreground mt-2">Partner Companies</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextRevealSection;
