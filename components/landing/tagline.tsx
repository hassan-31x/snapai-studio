"use client";
import { useEffect, useRef } from "react";
export default function Tagline() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const words = ref.current?.querySelectorAll("span");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 1 },
    );
    words?.forEach((word) => observer.observe(word));
    return () => observer.disconnect();
  }, []);
  return (
    <section className="section-wrap py-16">
      <h2 ref={ref} className="max-w-[680px] text-4xl font-medium md:text-5xl">
        {"Less time arranging a shoot.".split(" ").map((word, i) => (
          <span
            key={i}
            style={{
              opacity: 0.35,
              transition: `opacity 800ms cubic-bezier(.32,.72,0,1) ${i * 80}ms`,
            }}
          >
            {word}{" "}
          </span>
        ))}
        <br />
        {"More room for the idea.".split(" ").map((word, i) => (
          <span
            key={i}
            style={{
              opacity: 0.35,
              transition: `opacity 800ms cubic-bezier(.32,.72,0,1) ${(i + 5) * 80}ms`,
            }}
          >
            {word}{" "}
          </span>
        ))}
      </h2>
    </section>
  );
}
