import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentLanguage = 'en' } = useLanguage();

  const testimonials = [
    {
      name: 'Rajesh Patel',
      location: 'Gujarat, India',
      image: '👨‍🌾',
      quote: 'AgriSmart helped me transition from chemical to organic farming. My yield increased 45% and my soil is regenerating.',
      crop: 'Cotton & Mustard',
      change: '+45% Yield',
      rating: 5,
    },
    {
      name: 'Maria Santos',
      location: 'Baja, Mexico',
      image: '👩‍🌾',
      quote: 'The disease detection AI saved my entire corn crop from blight. Two weeks of early warning made all the difference.',
      crop: 'Corn & Beans',
      change: '+$8,000 saved',
      rating: 5,
    },
    {
      name: 'James Kipchoge',
      location: 'Nairobi, Kenya',
      image: '👨‍🌾',
      quote: 'Consulting with Dr. Omondi from AgriSmart changed everything. Now I grow drought-resistant crops profitably.',
      crop: 'Maize & Sorghum',
      change: '+60% Income',
      rating: 5,
    },
    {
      name: 'Lin Chen',
      location: 'Sichuan, China',
      image: '👩‍🌾',
      quote: 'The crop prediction engine knows my farm better than I do. Premium organic prices are now realistic.',
      crop: 'Rice & Tea',
      change: '2.5x Premium',
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Farmers Are Already <span className="text-emerald-700">Thriving</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Real stories from real farmers who switched to natural, AI-powered farming
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative">
            {/* Testimonial Card */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-12 border-2 border-emerald-200 shadow-xl min-h-96 flex flex-col justify-between">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-2xl font-semibold text-gray-900 mb-8 italic leading-relaxed">
                "{current.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-8 border-t-2 border-emerald-100">
                <div className="text-5xl">{current.image}</div>
                <div>
                  <p className="font-bold text-lg text-gray-900">{current.name}</p>
                  <p className="text-emerald-700 font-semibold mb-2">{current.location}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{current.crop}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">{current.change}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between absolute -left-6 -right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <button
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="group pointer-events-auto p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="group pointer-events-auto p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-emerald-600 w-8'
                    : 'bg-emerald-200 hover:bg-emerald-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <div className="text-center p-8 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 transition-all duration-300">
            <p className="text-4xl font-bold text-emerald-700 mb-2">50K+</p>
            <p className="text-gray-700 font-semibold">Happy Farmers</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 transition-all duration-300">
            <p className="text-4xl font-bold text-emerald-700 mb-2">45%</p>
            <p className="text-gray-700 font-semibold">Avg. Yield Increase</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 transition-all duration-300">
            <p className="text-4xl font-bold text-emerald-700 mb-2">2.5M+</p>
            <p className="text-gray-700 font-semibold">Acres Regenerated</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 transition-all duration-300">
            <p className="text-4xl font-bold text-emerald-700 mb-2">4.9★</p>
            <p className="text-gray-700 font-semibold">Average Rating</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-8 font-semibold">
            Join thousands of farmers earning more while healing the planet
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Your Success Story
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
