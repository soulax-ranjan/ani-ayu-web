"use client";
import Image from "next/image";

export default function MascotCorner() {
  return (
    <div className="absolute z-20 top-4 right-4 md:top-10 md:right-8">
      <Image
        src="/assets/mascot-sketch.png" // make sure this file exists in /public/assets/
        alt="Ani & Ayu Mascot"
        width={308}
        height={308}
        className="object-contain"
      />
    </div>
  );
}
