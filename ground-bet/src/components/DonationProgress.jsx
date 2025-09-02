"use client";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { CircleDollarSign, Target, Hourglass } from "lucide-react";

export default function DonationProgress({ collected = 32000, target = 56000 }) {
  const progress = Math.min((collected / target) * 100, 100);

  // Smooth animated progress (springy effect)
  const spring = useSpring(0, { stiffness: 80, damping: 20 });

  const [displayCollected, setDisplayCollected] = useState(0);
  const [displayRemaining, setDisplayRemaining] = useState(0);

  useEffect(() => {
    spring.set(progress);

    // animate collected
    const controlsCollected = animate(0, collected, {
      duration: 2.5,
      onUpdate(value) {
        setDisplayCollected(value);
      },
    });

    // animate remaining
    const controlsRemaining = animate(0, target - collected, {
      duration: 2.5,
      onUpdate(value) {
        setDisplayRemaining(value);
      },
    });

    return () => {
      controlsCollected.stop();
      controlsRemaining.stop();
    };
  }, [progress, collected, target, spring]);

  const width = useTransform(spring, (p) => `${p}%`);

  return (
    <div
      className="w-full p-6 rounded-xl shadow-xl backdrop-blur-md bg-white/40 border border-white/20"
      style={{ borderRadius: "1rem" }}
    >
      {/* 💰 Donation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Collected */}
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
          <motion.div
            className="shrink-0"
            animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CircleDollarSign className="w-10 h-10 text-yellow-500" />
          </motion.div>
          <div>
            <p className="text-2xl font-bold text-gray-500">Collected</p>
            <p className="text-2xl font-extrabold text-yellow-500">
              Rs. {displayCollected.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Target */}
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
          <motion.div
            className="shrink-0"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Target className="w-10 h-10 text-black" />
          </motion.div>
          <div>
            <p className="text-2xl font-bold text-gray-600">Target</p>
            <p className="text-2xl font-extrabold text-black">
              Rs. {target.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Remaining */}
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
          <motion.div
            className="shrink-0"
            animate={{ y: [0, -6, 0], rotate: [0, -6, 6, 0] }}
            transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
          >
            <Hourglass className="w-10 h-10 text-red-800" />
          </motion.div>
          <div>
            <p className="text-2xl font-bold text-gray-500">Remaining</p>
            <p className="text-2xl font-extrabold text-red-800">
              Rs. {displayRemaining.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Gradient Progress Bar with shimmer */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-red-600 rounded-r-xl"
          style={{ width }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
        />

        {/* Shimmer overlay */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1/3 bg-white/30 blur-md"
          animate={{ x: ["-100%", "150%"] }}
          transition={{ duration: 3.0, repeat: Infinity, ease: "easeIn" }}
        />
      </div>

      {/* Collected + Percentage */}
      <div className="flex justify-between mt-2 text-sm font-medium text-gray-700">
        <span />
        <motion.span>{spring.get().toFixed(1)}%</motion.span>
      </div>
    </div>
  );
}
