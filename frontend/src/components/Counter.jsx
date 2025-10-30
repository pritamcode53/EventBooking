import React, { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const Counter = ({ from, to, label }) => {
  const count = useMotionValue(from);
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const controls = animate(count, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [count, to]);

  return (
    <motion.div
      className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl border border-green-800/40 bg-white/10 backdrop-blur-md shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.span className="text-3xl sm:text-5xl font-bold text-emerald-600 drop-shadow-md">
        {displayValue}+
      </motion.span>
      <p className="text-gray-700 mt-1 font-medium text-sm sm:text-base">
        {label}
      </p>
    </motion.div>
  );
};

export default Counter;
