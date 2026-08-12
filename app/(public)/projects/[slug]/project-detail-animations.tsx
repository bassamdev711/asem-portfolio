"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProjectDetailAnimations({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>{children}</motion.div>
    </motion.div>
  );
}
