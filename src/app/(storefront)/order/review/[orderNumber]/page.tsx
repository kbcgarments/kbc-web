"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MessageSquare,
  Globe,
  CheckCircle2,
  Mail,
  Loader2,
} from "lucide-react";
import { useSubmitFeedback } from "@/hooks";
import { Input } from "@/components/ui/Input";
import { useAuthStore, useLanguageStore } from "@/stores/";

export default function ReviewOrderPage() {
  const router = useRouter();
  const { translate } = useLanguageStore();
  const { orderNumber } = useParams() as { orderNumber: string };
  const submitFeedback = useSubmitFeedback();

  // If logged in → auto-fill email (optional)
  const customer = useAuthStore((s) => s.user);
  const loggedInEmail = customer?.email ?? "";

  const [email, setEmail] = useState(loggedInEmail);
  const [rating, setRating] = useState<number>();
  const [hoveredRating, setHoveredRating] = useState<number>();
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");

  const handleSubmit = () => {
    if (!rating || !message.trim() || !email.trim()) return;

    submitFeedback.mutate(
      {
        orderNumber,
        email,
        language,
        rating,
        message,
      },
      {
        onSuccess: () => {
          setTimeout(() => router.push("/collections"), 1500);
        },
      },
    );
  };

  /* -----------------------------------------------------------
     SUCCESS VIEW
  ----------------------------------------------------------- */
  if (submitFeedback.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-secondary/10">
        <div className="w-full max-w-md bg-secondary/20 border border-primary/10 rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
              <div className="relative p-4 rounded-full bg-green-500/10">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-3">
            {translate("review.successTitle")}
          </h2>
          <p className="text-secondary mb-8">
            {translate("review.successDescription")}
          </p>

          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-accent text-white font-semibold py-3.5 rounded-lg hover:bg-accent-dark transition"
          >
            {translate("review.successButton")}
          </button>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------------
     FORM VIEW
  ----------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-secondary/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {translate("review.pageTitle")}
          </h1>
          <p className="text-secondary">
            {translate("review.pageSubtitle")}{" "}
            <span className="text-primary font-semibold">#{orderNumber}</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-8 shadow-xl">
          <div className="space-y-10">
            {/* 📧 EMAIL FIELD (Guest or logged-in) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-primary">
                  {translate("review.emailLabel")}
                </span>
              </div>

              <Input
                type="email"
                placeholder="Enter the email used for this order"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!loggedInEmail}
              />
            </div>

            {/* ⭐ RATING */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-primary">
                  {translate("review.ratingLabel")}
                </span>
              </div>

              <div className="flex gap-3 justify-center py-6 bg-white rounded-xl border border-primary/10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    title={translate("review.ratingLabel")}
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(undefined)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating || 0)
                          ? "fill-yellow-400 text-yellow-400 drop-shadow"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 📝 MESSAGE */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-primary">
                  {translate("review.messageLabel")}
                </span>
              </div>

              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the product quality, delivery, packaging..."
                className="w-full p-4 border-2 border-primary/10 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
              <p className="text-xs text-secondary pt-1">
                {message.length} / 500
              </p>
            </div>

            {/* 🌍 LANGUAGE */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-primary">
                  {translate("review.languageLabel")}
                </span>
              </div>

              <select
                title={translate("review.languageLabel")}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border-2 border-primary/10 rounded-xl bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              >
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 French</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="zu">🇿🇦 Zulu</option>
              </select>
            </div>

            {/* 🚀 SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={
                !email.trim() ||
                !rating ||
                !message.trim() ||
                submitFeedback.isPending
              }
              className="w-full bg-accent text-white font-semibold py-4 rounded-xl transition hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {submitFeedback.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  {translate("review.submitting")}
                </>
              ) : (
                translate("review.submitButton")
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-secondary mt-6">
          {translate("review.footerNote")}
        </p>
      </div>
    </div>
  );
}
