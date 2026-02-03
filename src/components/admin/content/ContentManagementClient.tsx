"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Megaphone, Star, MessageSquare, Quote } from "lucide-react";

import {
  useListHeroes,
  useListBanners,
  useListWhyChooseUs,
  useListCustomerFeedback,
  useListTestimonials,
} from "@/hooks";
import BannerManager from "./BannerManager";
import FeedbackReview from "./FeedbackReview";
import HeroSectionManager from "./HeroSectionManager";
import TestimonialsManager from "./TestimonialsManager";
import WhyChooseUsManager from "./WhyChooseUsManager";

type TabId = "hero" | "banners" | "features" | "feedback" | "testimonials";

export default function AdminHomepagePage() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");

  // Fetch counts
  const { data: heroes = [] } = useListHeroes();
  const { data: banners = [] } = useListBanners();
  const { data: features = [] } = useListWhyChooseUs();
  const { data: feedback = [] } = useListCustomerFeedback();
  const { data: testimonials = [] } = useListTestimonials();

  const pendingFeedbackCount = feedback.filter(
    (f) => f.status === "PENDING",
  ).length;
  const activeTestimonialsCount = testimonials.filter((t) => t.isActive).length;

  const tabs = [
    {
      id: "hero" as const,
      label: "Hero Sections",
      icon: ImageIcon,
      count: heroes.length,
    },
    {
      id: "banners" as const,
      label: "Banners",
      icon: Megaphone,
      count: banners.length,
    },
    {
      id: "features" as const,
      label: "Features",
      icon: Star,
      count: features.length,
    },
    {
      id: "feedback" as const,
      label: "Feedback",
      icon: MessageSquare,
      count: feedback.length,
      badge: pendingFeedbackCount > 0 ? pendingFeedbackCount : undefined,
    },
    {
      id: "testimonials" as const,
      label: "Testimonials",
      icon: Quote,
      count: activeTestimonialsCount,
    },
  ];

  return (
    <div className="min-h-screen bg-primary pb-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Homepage Management
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Manage hero sections, banners, features, and customer testimonials
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-primary/10 mb-8">
          <nav className="flex gap-1 sm:gap-2 overflow-x-auto pb-px scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-all whitespace-nowrap
                    ${
                      isActive
                        ? "border-accent text-accent"
                        : "border-transparent text-secondary hover:text-primary hover:border-primary/20"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span
                    className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}
                  >
                    {tab.label}
                  </span>

                  {/* Count Badge */}
                  {tab.badge !== undefined ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                      {tab.badge}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/30 text-tertiary">
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "hero" && <HeroSectionManager />}
            {activeTab === "banners" && <BannerManager />}
            {activeTab === "features" && <WhyChooseUsManager />}
            {activeTab === "feedback" && <FeedbackReview />}
            {activeTab === "testimonials" && <TestimonialsManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
