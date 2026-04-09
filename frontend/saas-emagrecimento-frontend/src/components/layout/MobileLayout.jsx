"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import MobileHeader from "./MobileHeader";

const mobileScreenMotion = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: "easeOut",
    },
  },
};

function MobileLayoutComponent({
  title = "Hoje",
  subtitle = "",
  scoreDia = null,
  streakDias = null,
  indicatorLabel = "",
  children,
}) {
  return (
    <div className="min-h-full lg:contents">
      <MobileHeader
        title={title}
        subtitle={subtitle}
        scoreDia={scoreDia}
        streakDias={streakDias}
        indicatorLabel={indicatorLabel}
      />

      <motion.div
        className="mx-auto w-full max-w-3xl px-3 pb-[calc(env(safe-area-inset-bottom)+6.75rem)] pt-4 sm:px-4 lg:max-w-7xl lg:px-0 lg:pb-8 lg:pt-0"
        variants={mobileScreenMotion}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full">{children}</div>
      </motion.div>
    </div>
  );
}

const MobileLayout = memo(MobileLayoutComponent);

export default MobileLayout;
