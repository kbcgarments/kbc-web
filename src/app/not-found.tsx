"use client";

import Link from "next/link";
import { Home, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/stores";

export default function NotFound() {
  const { translate } = useLanguageStore();

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center px-4 py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 bg-accent/20 dark:bg-accent-light/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-sand-300/30 dark:bg-sand-700/30 rounded-full blur-3xl"
        />

        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full relative z-10"
      >
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-sand-100 dark:bg-sand-900 rounded-full text-sm font-medium text-sand-900 dark:text-sand-50 border border-sand-200 dark:border-sand-800">
            <Sparkles className="w-4 h-4 text-accent dark:text-accent-light" />
            {translate("404.errorBadge")}
          </span>
        </motion.div>

        {/* Main 404 Display */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <h1 className="text-[120px] md:text-[180px] lg:text-[220px] font-display font-bold leading-none">
              <span className="text-primary bg-clip-text text-transparent">
                404
              </span>
            </h1>

            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-accent dark:bg-accent-light rounded-full opacity-50"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4"
          >
            {translate("404.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg text-primary max-w-2xl mx-auto leading-relaxed"
          >
            {translate("404.description")}
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <Home className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{translate("404.backHome")}</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-full border-2 border-(--color-text-primary) transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{translate("404.browseCollections")}</span>
          </Link>
        </motion.div>

        {/* Popular Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="border-t border-sand-200 dark:border-sand-800 pt-12"
        >
          <h3 className="text-sm font-bold text-sand-900 dark:text-sand-50 uppercase tracking-wider text-center mb-6">
            {translate("404.popularDestinations")}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/#new-arrivals", label: translate("404.newArrivals") },
              { href: "/#best-sellers", label: translate("404.bestSellers") },
              { href: "/collections", label: translate("404.collections") },
              { href: "/track-order", label: translate("404.trackOrder") },
            ].map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block p-4 rounded-xl text-center text-sm font-medium border border-(--color-text-primary) transition-all duration-300 hover:border-(--color-text-accent) hover:text-(--color-text-accent) hover:-translate-y-1 hover:shadow-lg"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center text-sm text-sand-600 dark:text-sand-400"
        >
          <p>
            {translate("404.needHelp")}{" "}
            <a
              href="mailto:support@kbcuniverse.org"
              className="text-accent dark:text-accent-light hover:underline font-medium transition-colors"
            >
              {translate("404.contactSupport")}
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
