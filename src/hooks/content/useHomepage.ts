"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, useMutationHelpers } from "@/lib";

import {
  HomepageResponse,
  DashboardMetrics,
  HeroAdmin,
  BannerAdmin,
  WhyChooseUsAdmin,
  CustomerFeedbackAdmin,
  TestimonialAdmin,
  FeedbackStatus,
} from "@/types";

/* ======================================================
   QUERY KEYS
====================================================== */

const KEYS = {
  homepage: ["homepage"],
  heroes: ["admin", "heroes"],
  banners: ["admin", "banners"],
  whyChooseUs: ["admin", "why-choose-us"],
  feedback: ["admin", "feedback"],
  testimonials: ["admin", "testimonials"],
  metrics: ["admin", "metrics"],
} as const;

/* ======================================================
   🌍 PUBLIC HOMEPAGE
====================================================== */

export function useHomepage() {
  return useQuery({
    queryKey: KEYS.homepage,
    queryFn: () => apiClient.get<HomepageResponse>("/commerce/homepage"),
    staleTime: 1000 * 60 * 5,
  });
}

/* ======================================================
   🔐 ADMIN — HERO
====================================================== */

export function useListHeroes() {
  return useQuery({
    queryKey: KEYS.heroes,
    queryFn: () => apiClient.get<HeroAdmin[]>("/admin/homepage/hero"),
  });
}

export function useCreateHero() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.postForm<HeroAdmin>("/admin/homepage/hero", formData),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: KEYS.heroes });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.heroes });
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Hero created");
    },

    onError: () => error("Failed to create hero"),
  });
}

export function useUpdateHero() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiClient.patchForm<HeroAdmin>(`/admin/homepage/hero/${id}`, formData),

    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: KEYS.heroes });

      const previous = queryClient.getQueryData<HeroAdmin[]>(KEYS.heroes);

      if (previous) {
        queryClient.setQueryData<HeroAdmin[]>(KEYS.heroes, (old) =>
          old?.map((h) =>
            h.id === id ? { ...h, ...Object.fromEntries(formData) } : h,
          ),
        );
      }

      return { previous };
    },

    onError: (err, _v, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(KEYS.heroes, ctx.previous);
      }
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update hero";
      error(errorMessage);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Hero updated");
    },
  });
}

export function useDeleteHero() {
  const qc = useQueryClient();
  const toast = useMutationHelpers();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/homepage/hero/${id}`),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEYS.heroes });

      const previous = qc.getQueryData<HeroAdmin[]>(KEYS.heroes);

      qc.setQueryData<HeroAdmin[]>(KEYS.heroes, (old) =>
        old?.filter((h) => h.id !== id),
      );

      return { previous };
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(KEYS.heroes, ctx.previous);
      }
      toast.error("Failed to delete hero");
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.homepage });
      toast.success("Hero deleted");
    },
  });
}

/* ======================================================
   🔐 ADMIN — BANNERS
====================================================== */

export function useListBanners() {
  return useQuery({
    queryKey: KEYS.banners,
    queryFn: () => apiClient.get<BannerAdmin[]>("/admin/homepage/banner"),
  });
}

export function useCreateBanner() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.postForm<BannerAdmin>("/admin/homepage/banner", formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.banners });
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Banner created");
    },

    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create banner";
      error(errorMessage || "Failed to create banner");
    },
  });
}

export function useUpdateBanner() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiClient.patchForm<BannerAdmin>(
        `/admin/homepage/banner/${id}`,
        formData,
      ),

    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: KEYS.banners });

      const previous = queryClient.getQueryData<BannerAdmin[]>(KEYS.banners);

      queryClient.setQueryData<BannerAdmin[]>(KEYS.banners, (old) =>
        old?.map((b) =>
          b.id === id ? { ...b, ...Object.fromEntries(formData) } : b,
        ),
      );

      return { previous };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(KEYS.banners, ctx.previous);
      error("Failed to update banner");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Banner updated");
    },
  });
}

export function useDeleteBanner() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/homepage/banner/${id}`),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: KEYS.banners });

      const previous = queryClient.getQueryData<BannerAdmin[]>(KEYS.banners);

      queryClient.setQueryData<BannerAdmin[]>(KEYS.banners, (old) =>
        old?.filter((b) => b.id !== id),
      );

      return { previous };
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(KEYS.banners, ctx.previous);
      error("Failed to delete banner");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Banner deleted");
    },
  });
}

/* ======================================================
   🔐 ADMIN — WHY CHOOSE US
====================================================== */

export function useListWhyChooseUs() {
  return useQuery({
    queryKey: KEYS.whyChooseUs,
    queryFn: () =>
      apiClient.get<WhyChooseUsAdmin[]>("/admin/homepage/why-choose-us"),
  });
}

export function useCreateWhyChooseUs() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: Partial<WhyChooseUsAdmin>) =>
      apiClient.post<WhyChooseUsAdmin>(
        "/admin/homepage/why-choose-us",
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.whyChooseUs });
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Feature created");
    },

    onError: () => error("Failed to create feature"),
  });
}

export function useUpdateWhyChooseUs() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: Partial<WhyChooseUsAdmin> & { id: string }) =>
      apiClient.patch<WhyChooseUsAdmin>(
        `/admin/homepage/why-choose-us/${id}`,
        payload,
      ),

    onMutate: async ({ id, ...payload }) => {
      await queryClient.cancelQueries({ queryKey: KEYS.whyChooseUs });

      const previous = queryClient.getQueryData<WhyChooseUsAdmin[]>(
        KEYS.whyChooseUs,
      );

      queryClient.setQueryData<WhyChooseUsAdmin[]>(KEYS.whyChooseUs, (old) =>
        old?.map((f) => (f.id === id ? { ...f, ...payload } : f)),
      );

      return { previous };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(KEYS.whyChooseUs, ctx.previous);
      error("Failed to update feature");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Feature updated");
    },
  });
}

export function useDeleteWhyChooseUs() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/homepage/why-choose-us/${id}`),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: KEYS.whyChooseUs });

      const previous = queryClient.getQueryData<WhyChooseUsAdmin[]>(
        KEYS.whyChooseUs,
      );

      queryClient.setQueryData<WhyChooseUsAdmin[]>(KEYS.whyChooseUs, (old) =>
        old?.filter((f) => f.id !== id),
      );

      return { previous };
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(KEYS.whyChooseUs, ctx.previous);
      error("Failed to delete feature");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Feature deleted");
    },
  });
}

/* ======================================================
   🔐 ADMIN — FEEDBACK & TESTIMONIALS
====================================================== */

export function useListCustomerFeedback() {
  return useQuery({
    queryKey: KEYS.feedback,
    queryFn: () =>
      apiClient.get<CustomerFeedbackAdmin[]>("/admin/homepage/feedback"),
  });
}

export function useReviewFeedback() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: ({
      feedbackId,
      status,
    }: {
      feedbackId: string;
      status: FeedbackStatus;
    }) =>
      apiClient.patch(`/admin/homepage/feedback/${feedbackId}/review`, {
        status,
      }),

    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.feedback });
      success(`Feedback ${status.toLowerCase()}`);
    },

    onError: () => error("Failed to review feedback"),
  });
}

export function usePromoteFeedbackToTestimonial() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: { feedbackId: string; customerName?: string }) =>
      apiClient.post<TestimonialAdmin>(
        "/admin/homepage/testimonial/promote",
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.feedback });
      queryClient.invalidateQueries({ queryKey: KEYS.testimonials });
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success("Feedback promoted to testimonial");
    },

    onError: () => error("Failed to promote feedback"),
  });
}

export function useListTestimonials() {
  return useQuery({
    queryKey: KEYS.testimonials,
    queryFn: () =>
      apiClient.get<TestimonialAdmin[]>("/admin/homepage/testimonial"),
    staleTime: 1000 * 60 * 2,
  });
}

export function useToggleTestimonial() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/admin/homepage/testimonial/${id}/toggle`, { isActive }),

    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: KEYS.testimonials });

      const previous = queryClient.getQueryData<TestimonialAdmin[]>(
        KEYS.testimonials,
      );

      queryClient.setQueryData<TestimonialAdmin[]>(KEYS.testimonials, (old) =>
        old?.map((t) => (t.id === id ? { ...t, isActive } : t)),
      );

      return { previous };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(KEYS.testimonials, ctx.previous);
      error("Failed to toggle testimonial");
    },

    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.homepage });
      success(`Testimonial ${isActive ? "activated" : "deactivated"}`);
    },
  });
}

/* ======================================================
   🔐 ADMIN — METRICS
====================================================== */

export function useDashboardMetrics() {
  return useQuery({
    queryKey: KEYS.metrics,
    queryFn: () => apiClient.get<DashboardMetrics>("/admin/homepage/metrics"),
    refetchOnWindowFocus: false,
  });
}
