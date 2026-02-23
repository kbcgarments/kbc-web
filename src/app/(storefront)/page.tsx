"use client";

import HeroSection from "@/components/storefront/home/HeroSection";
import ShopByCategories from "@/components/storefront/home/ShopByCategories";
import NewArrivals from "@/components/storefront/home/NewArrivals";
import BestSellersSection from "@/components/storefront/home/BestSellersSection";
import WhyChooseUsSection from "@/components/storefront/home/WhyChooseUsSection";
import TestimonialsSection from "@/components/storefront/home/TestimonialsSection";
import FeaturedProductsSection from "@/components/storefront/home/FeaturedProductsSection";
import BannerCarousel from "@/components/storefront/home/BannerCarousel";

import {
  useGetCategories,
  useHomepageHero,
  useHomepageBanners,
  useHomepageFeaturedProducts,
  useHomepageNewArrivals,
  useHomepageBestSellers,
  useHomepageTestimonials,
  useHomepageWhyChooseUs,
} from "@/hooks";
import {
  BannerPublic,
  HeroPublic,
  Product,
  TestimonialPublic,
  WhyChooseUsPublic,
} from "@/types";

export default function HomePage() {
  const { data: hero, isLoading: heroLoading } = useHomepageHero();
  const { data: banners = [], isLoading: bannersLoading } =
    useHomepageBanners();
  const { data: featured = [], isLoading: featuredLoading } =
    useHomepageFeaturedProducts(8);
  const { data: newArrivals = [], isLoading: newArrivalsLoading } =
    useHomepageNewArrivals(12);
  const { data: bestSellers = [], isLoading: bestSellersLoading } =
    useHomepageBestSellers(8);
  const { data: testimonials = [], isLoading: testimonialsLoading } =
    useHomepageTestimonials(6);
  const { data: whyChooseUs = [], isLoading: whyChooseUsLoading } =
    useHomepageWhyChooseUs();

  const { data: categoriesData = [], isLoading: categoriesLoading } =
    useGetCategories();

  return (
    <main className="w-full space-y-10">
      <HeroSection
        hero={(hero as HeroPublic) ?? null}
        isLoading={heroLoading}
      />

      <ShopByCategories
        categories={categoriesData}
        isLoading={categoriesLoading}
      />

      <section id="featured-products" className="min-h-175">
        <FeaturedProductsSection
          featuredProducts={featured as Product[]}
          isLoading={featuredLoading}
        />
      </section>

      <section id="new-arrivals">
        <NewArrivals
          newArrivals={newArrivals as Product[]}
          isLoading={newArrivalsLoading}
        />
      </section>

      <section id="best-sellers">
        <BestSellersSection
          bestSellers={bestSellers as Product[]}
          isLoading={bestSellersLoading}
        />
      </section>

      <section id="testimonials">
        <TestimonialsSection
          testimonials={testimonials as TestimonialPublic[]}
          isLoading={testimonialsLoading}
        />
      </section>

      <section id="banners">
        <BannerCarousel banners={banners as BannerPublic[]} />
      </section>

      <section id="why-choose-us">
        <WhyChooseUsSection
          whyChooseUs={whyChooseUs as WhyChooseUsPublic[]}
          isLoading={whyChooseUsLoading}
        />
      </section>
    </main>
  );
}
