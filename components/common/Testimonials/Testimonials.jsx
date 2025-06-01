"use client";
import { useState, useEffect } from "react";
import TestimonialCard from "../TestimonialCard/TestimonialCard";
import SectionHeader from "../SectionHeader/SectionHeader";
import TestimonialService from "../../../services/api/testimonialService";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonialsPerPage = 3;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const result = await TestimonialService.getTestimonials();
        
        if (result.success) {
          setTestimonials(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= testimonialsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.ceil(testimonials.length / testimonialsPerPage) - 1;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying, testimonialsPerPage]);

  const nextSlide = () => {
    const maxIndex = Math.ceil(testimonials.length / testimonialsPerPage) - 1;
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    const maxIndex = Math.ceil(testimonials.length / testimonialsPerPage) - 1;
    setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * testimonialsPerPage;
    return testimonials.slice(startIndex, startIndex + testimonialsPerPage);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-pink-50/50 to-white">
        <div className="px-4 mx-auto max-w-7xl">
          <SectionHeader title="What Our Clients Say" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl animate-pulse">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 mx-auto mb-4 bg-gray-200 rounded"></div>
                <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="h-4 mb-6 bg-gray-200 rounded"></div>
                <div className="h-5 mb-1 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-pink-50/50 to-white">
        <div className="px-4 mx-auto max-w-7xl">
          <SectionHeader title="What Our Clients Say" />
          <div className="p-12 text-center bg-white border border-red-100 rounded-3xl">
            <div className="w-16 h-16 mx-auto mb-4 text-red-400">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Oops! Something went wrong</h3>
            <p className="mb-6 text-gray-600">Failed to load testimonials: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 font-medium text-white transition-colors bg-pink-600 rounded-xl hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-pink-50/50 to-white">
        <div className="px-4 mx-auto max-w-7xl">
          <SectionHeader title="What Our Clients Say" />
          <div className="p-12 text-center">
            <p className="text-gray-600">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const totalSlides = Math.ceil(testimonials.length / testimonialsPerPage);
  const showCarouselControls = testimonials.length > testimonialsPerPage;

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50/50 to-white">
      <div className="px-4 mx-auto max-w-7xl">
        <SectionHeader 
          title="What Our Clients Say" 
          subtitle="Don't just take our word for it - hear from our satisfied customers"
        />
        
        <div className="relative">
          {/* Testimonials Grid */}
          <div 
            className="grid grid-cols-1 gap-8 transition-all duration-500 ease-in-out md:grid-cols-3"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {getCurrentTestimonials().map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="transition-all duration-500 ease-in-out transform"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          {showCarouselControls && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 w-12 h-12 transition-all duration-200 -translate-x-4 -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-lg top-1/2 hover:shadow-xl hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 group"
                aria-label="Previous testimonials"
              >
                <svg className="w-5 h-5 mx-auto text-gray-600 transition-colors group-hover:text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 w-12 h-12 transition-all duration-200 translate-x-4 -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-lg top-1/2 hover:shadow-xl hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 group"
                aria-label="Next testimonials"
              >
                <svg className="w-5 h-5 mx-auto text-gray-600 transition-colors group-hover:text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dot Indicators */}
              <div className="flex justify-center mt-12 space-x-3">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                      index === currentIndex
                        ? 'bg-pink-600 w-8'
                        : 'bg-gray-300 hover:bg-pink-300'
                    }`}
                    aria-label={`Go to testimonial group ${index + 1}`}
                  />
                ))}
              </div>

              
            </>
          )}
        </div>

      
      </div>
    </section>
  );
}