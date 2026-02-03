"use client";
import HeroSection from "@/components/storefront/home/HeroSection";
import ShopByCategories from "@/components/storefront/home/ShopByCategories";
import NewArrivals from "@/components/storefront/home/NewArrivals";
import BestSellersSection from "@/components/storefront/home/BestSellersSection";
import WhyChooseUsSection from "@/components/storefront/home/WhyChooseUsSection";
import TestimonialsSection from "@/components/storefront/home/TestimonialsSection";
import FeaturedProductsSection from "@/components/storefront/home/FeaturedProductsSection";
import BannerCarousel from "@/components/storefront/home/BannerCarousel";
import { useGetCategories, useHomepage } from "@/hooks";

export default function HomePage() {
  const { data, isLoading } = useHomepage();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategories();
  return (
    <main className="w-full space-y-10">
      <HeroSection hero={data?.hero ?? null} isLoading={isLoading} />
      <ShopByCategories
        categories={categoriesData ?? []}
        isLoading={categoriesLoading}
      />
      <section id="featured-products" className="min-h-175">
        <FeaturedProductsSection
          featuredProducts={data?.featuredProducts ?? []}
          isLoading={isLoading}
        />
      </section>
      <section id="new-arrivals">
        <NewArrivals
          newArrivals={data?.newArrivals ?? []}
          isLoading={isLoading}
        />
      </section>
      <section id="best-sellers">
        <BestSellersSection
          bestSellers={data?.bestSellers ?? []}
          isLoading={isLoading}
        />
      </section>
      <section id="testimonials">
        <TestimonialsSection
          testimonials={data?.testimonials ?? []}
          isLoading={isLoading}
        />
      </section>
      <section id="banners">
        <BannerCarousel banners={data?.banners ?? []} />
      </section>
      <section id="why-choose-us">
        <WhyChooseUsSection
          whyChooseUs={data?.whyChooseUs ?? []}
          isLoading={isLoading}
        />
      </section>
    </main>
  );
}
