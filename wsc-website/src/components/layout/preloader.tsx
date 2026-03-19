"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { easing } from "@/lib/motion";

const CRITICAL_IMAGES = [
  "/shark.avif",
  "/UC-HILL.avif",
  "/TORONTO.avif",
  "/MIDDLESEX.avif",
];

const TIMEOUT_MS = 3000;

interface PreloaderProps {
  onLoadComplete: () => void;
}

export default function Preloader({ onLoadComplete }: PreloaderProps) {
  useEffect(() => {
    const imagePromises = CRITICAL_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // proceed even on failure
        })
    );

    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, TIMEOUT_MS)
    );

    Promise.race([Promise.all(imagePromises), timeout]).then(() => {
      onLoadComplete();
    });
  }, [onLoadComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        background: "var(--color-bg-base)",
      }}
      exit={{
        y: "-100vh",
        opacity: 0,
        transition: {
          duration: 0.85,
          ease: easing.easeInOutQuart,
        },
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src="/shark.avif"
          alt="Western Sales Club"
          width={80}
          height={80}
          priority
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
