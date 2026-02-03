"use client";

import Link from "next/link";
import { useLanguageStore } from "@/stores/useLanguageStore";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Loader,
  Shield,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { useToastStore } from "@/stores/useToastStore";
import { cn } from "@/utils";
import Image from "next/image";

export default function Footer() {
  const { translate } = useLanguageStore();
  const { success, error } = useToastStore();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      error(translate("footer.invalidEmail") || "Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      success(translate("footer.newsletter.success"));
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com",
      color: "hover:bg-[#1877F2]",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com",
      color: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:to-[#E1306C]",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com",
      color: "hover:bg-[#1DA1F2]",
    },
  ];

  return (
    <footer className="bg-primary border-t border-primary mt-auto relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Section - Logo + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-12 border-b border-primary">
          {/* Brand Section */}
          <div>
            <div className="flex gap-4">
              <Link href="/" className="flex justify-start items-start">
                <Image
                  src="https://res.cloudinary.com/ddi3mvlj4/image/upload/kbc-logo_mhy39q.png"
                  alt="KBC Universe logo"
                  width={256}
                  height={83}
                  className="h-7 w-auto object-contain"
                  sizes="(max-width: 768px) 80px, 120px"
                  priority
                />
              </Link>
              <p className="text-sm text-secondary leading-relaxed max-w-md mb-6">
                {translate("footer.tagline")}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                  className={cn(
                    "w-10 h-10 rounded-full bg-secondary/50 hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group",
                    social.color,
                  )}
                >
                  <social.icon className="w-4 h-4 text-secondary group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">
              {translate("footer.newsletter.title")}
            </h3>
            <p className="text-sm text-secondary mb-4">
              {translate("footer.newsletter.description")}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
                  <input
                    type="email"
                    title={translate("footer.newsletter.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translate(
                      "footer.newsletter.emailPlaceholder",
                    )}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-primary rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-accent text-white  text-sm font-semibold rounded-lg hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">
                        {translate("common.loading")}
                      </span>
                    </>
                  ) : (
                    translate("footer.newsletter.subscribe")
                  )}
                </button>
              </div>

              <p className="text-xs text-tertiary">
                {translate("footer.newsletter.privacy")}
              </p>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 py-12">
          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              {translate("footer.links.shop")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#new-arrivals"
                  title={translate("sections.newArrivals.title")}
                  aria-label={translate("sections.newArrivals.title")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("sections.newArrivals.title")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="#best-sellers"
                  title={translate("sections.bestSellers.title")}
                  aria-label={translate("sections.bestSellers.title")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("sections.bestSellers.title")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  title={translate("navigation.primary.collections")}
                  aria-label={translate("navigation.primary.collections")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("navigation.primary.collections")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              {translate("footer.links.customerService")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/order/track"
                  title={translate("navigation.primary.trackOrder")}
                  aria-label={translate("navigation.primary.trackOrder")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("navigation.primary.trackOrder")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  title={translate("navigation.primary.contact")}
                  aria-label={translate("navigation.primary.contact")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("navigation.primary.contact")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  title={translate("navigation.primary.sizeGuide")}
                  aria-label={translate("navigation.primary.sizeGuide")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("navigation.primary.sizeGuide")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              {translate("footer.links.company")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  title={translate("navigation.primary.about")}
                  aria-label={translate("navigation.primary.about")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("navigation.primary.about")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  title={translate("navigation.primary.contact")}
                  aria-label={translate("navigation.primary.contact")}
                  className="text-sm text-secondary hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {translate("navigation.primary.contact")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              {translate("footer.links.helpCenter")}
            </h4>

            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+27707643281"
                  className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors group"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    +27 70 764 3281
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:hello@kbcuniverse.org"
                  className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors group"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform break-all">
                    hello@kbcuniverse.org
                  </span>
                </a>
              </li>

              <li>
                <div className="flex items-start gap-2 text-sm text-secondary">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Lagos, Nigeria</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <p className="text-sm text-secondary">
                © {currentYear}{" "}
                <span className="font-semibold text-primary">KBC Universe</span>
                . {translate("footer.legal.copyright")}.
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  title={translate("footer.legal.privacyPolicy")}
                  aria-label={translate("footer.legal.privacyPolicy")}
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  {translate("footer.legal.privacyPolicy")}
                </Link>
                <span className="text-tertiary">•</span>
                <Link
                  href="/terms"
                  title={translate("footer.legal.termsOfService")}
                  aria-label={translate("footer.legal.termsOfService")}
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  {translate("footer.legal.termsOfService")}
                </Link>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-6">
              {/* Security Badge */}
              <div className="flex items-center gap-2 text-xs text-tertiary">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {translate("footer.securePayment") || "Secure Payment"}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-tertiary" />
                <div className="flex items-center gap-1.5 opacity-70">
                  <span className="text-xs font-semibold text-secondary">
                    VISA
                  </span>
                  <span className="text-xs text-tertiary">•</span>
                  <span className="text-xs font-semibold text-secondary">
                    MC
                  </span>
                  <span className="text-xs text-tertiary">•</span>
                  <span className="text-xs font-semibold text-secondary">
                    AMEX
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
