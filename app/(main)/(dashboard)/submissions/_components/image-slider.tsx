"use client"

import React, { useState } from 'react'
import { imageTypes } from '@/lib/image-types';

type Props = {}

const ImageSlider = ({ submission }: { submission: any }) => {
  
  const images = [
    submission.originalImageUrl,
    ...imageTypes.map((img) => submission[img.key]).filter(Boolean),
  ];
  const [active, setActive] = useState(0);

  if (!images.length) return null;
  return (
    <div className="relative w-[360px] h-[270px] flex items-center justify-center">
      <img
        src={images[active]}
        alt="Submission image"
        className="object-contain w-full h-full transition-all duration-300"
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full border border-black ${active === idx ? "bg-black" : "bg-white/80"}`}
              style={{ boxShadow: active === idx ? '0 0 0 2px #fff' : undefined }}
              onClick={(e) => {
                e.preventDefault();
                setActive(idx);
              }}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSlider