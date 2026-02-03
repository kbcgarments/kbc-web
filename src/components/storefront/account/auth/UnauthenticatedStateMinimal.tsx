"use client";

import { useLanguageStore } from "@/stores";
import { motion } from "framer-motion";
import { Lock, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function UnauthenticatedStateMinimal() {
  const { translate } = useLanguageStore();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Card */}
        <div className="relative bg-secondary/20 border border-primary/10 rounded-2xl p-8 sm:p-10 overflow-hidden">
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 opacity-50"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, rgba(196, 165, 116, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(196, 165, 116, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 0%, rgba(196, 165, 116, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1,
              }}
              className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Lock className="w-10 h-10 text-accent" strokeWidth={1.5} />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-center text-primary mb-3"
            >
              {translate("auth.unauthenticatedState.title")}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center text-secondary mb-8"
            >
              {translate("auth.unauthenticatedState.description")}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Link href="/account/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 mb-4 px-6 py-3.5 bg-accent text-white rounded-xl font-semibold hover:scale-105 duration-500 transition-all shadow-lg hover:shadow-xl"
                >
                  <LogIn className="w-5 h-5" strokeWidth={2} />
                  {translate("auth.login.signIn.submit")}
                </motion.button>
              </Link>

              <Link href="/account/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent hover:scale-105 duration-500 transition-all"
                >
                  <UserPlus className="w-5 h-5" strokeWidth={2} />
                  {translate("auth.login.newCustomer.cta")}
                </motion.button>
              </Link>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-tertiary mt-6"
            >
              <Link href="/" className="hover:text-accent transition-colors">
                {translate("cart.actions.continueShopping")}
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
