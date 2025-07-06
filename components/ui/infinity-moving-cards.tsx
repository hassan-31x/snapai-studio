"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  restaurantLogo?: string;
};

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: TestimonialItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    // We need to add a small delay to ensure proper rendering before animation starts
    const timeoutId = setTimeout(() => {
      addAnimation();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      // Clone the scroller content
      const scrollerContent = Array.from(scrollerRef.current.children);
      
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      // Set the CSS variables directly on the DOM element
      const style = document.createElement('style');
      style.textContent = `
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.5rem));
          }
        }
      `;
      document.head.appendChild(style);
      
      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      style={{
        // Set default CSS variables directly on the element
        "--animation-duration": speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s",
        "--animation-direction": direction === "left" ? "forwards" : "reverse"
      } as React.CSSProperties}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          // These inline styles help ensure the animation works correctly
          willChange: "transform"
        }}
      >
        {items.map((item, idx) => (
          <li
            className="w-[300px] max-w-full relative rounded-lg border border-gray-200 shadow-sm bg-white shrink-0 px-4 py-3"
            key={item.name + idx}
          >
            <blockquote className="flex flex-col h-full">
              <p className="text-xs leading-relaxed text-gray-700 line-clamp-2 flex-grow mb-2">
                &quot;{item.quote}&quot;
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#4CAF50]/20 to-[#2196F3]/20 flex items-center justify-center">
                    <span className="text-[#4CAF50] font-medium text-[10px]">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xs tracking-tight font-medium text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-gray-500">{item.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-tight font-medium text-gray-800">{item.company}</p>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}; 