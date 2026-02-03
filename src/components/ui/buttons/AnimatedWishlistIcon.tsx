"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface AnimatedWishlistIconProps {
  isInWishlist: boolean;
  className?: string;
}

export default function AnimatedWishlistIcon({
  isInWishlist,
  className,
}: AnimatedWishlistIconProps) {
  return (
    <span className={`relative flex items-center justify-center ${className}`}>
      {/* Glow pulse */}
      <AnimatePresence>
        {isInWishlist && (
          <motion.span
            key="pulse"
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-accent/30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Heart icon */}
      <AnimatePresence mode="wait" initial={false}>
        {isInWishlist ? (
          <motion.div
            key="filled"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Heart className="w-6 h-6 text-accent fill-accent" />
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Heart className="w-6 h-6 icon-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
