import React from "react";
import { motion } from "framer-motion";

const sentenceVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.005,
      staggerDirection: -1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const TypewriterHeading = ({ text, className }) => {
  const safeText = text || "\u00A0";

  return (
    <h1 className={className} style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      {/* Ghost Text - Reserves the exact space */}
      <span style={{ visibility: "hidden" }}>{safeText}</span>
      
      {/* Animated Text - Overlays the ghost text */}
      <motion.span
        variants={sentenceVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          display: "inline-block" 
        }}
      >
        {safeText.split("").map((char, index) => (
          <motion.span key={index} variants={letterVariants}>
            {char}
          </motion.span>
        ))}
      </motion.span>
    </h1>
  );
};
