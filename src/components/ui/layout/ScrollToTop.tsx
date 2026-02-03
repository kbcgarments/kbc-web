"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          onClick={scrollToTop}
          className="
            fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-50
            w-12 h-12 lg:w-14 lg:h-14 bg-(--color-text-primary)
            rounded-2xl shadow-2xl
            hover:shadow-accent/20 hover:shadow-2xl
            hover:scale-110 hover:-translate-y-1
            active:scale-95
            transition-all duration-300
            flex items-center justify-center
            group
            overflow-hidden
          "
          aria-label="Scroll to top"
        >
          {/* Shine Effect */}
          <div
            className="
              absolute inset-0 
              bg-linear-to-r from-transparent via-white/20 to-transparent
              -translate-x-full group-hover:translate-x-full  
              transition-transform duration-1000
            "
          />

          {/* Arrow */}
          <ArrowUp
            className="
              relative z-10
              w-5 h-5 lg:w-6 lg:h-6
              text-(--color-bg-primary)
              group-hover:text-accent
              transition-transform duration-300
              group-hover:scale-110
            "
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
