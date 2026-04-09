"use client";

import { motion } from "framer-motion";

export default function FadeIn({
  children,
  delay = 0,
  y = 18,
  duration = 0.45,
  className = "",
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}