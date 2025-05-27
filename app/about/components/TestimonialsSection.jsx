
import { Star } from "lucide-react";
import { SectionHeading  } from "../components";

export function TestimonialsSection({ testimonials, activeTestimonial, setActiveTestimonial }) {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          badge="What Parents Say"
          title="Customer Testimonials"
          description="Don't just take our word for it. Here's what parents who shop with us have to say."
        />
        
        <div className="relative bg-white rounded-2xl shadow-md p-8 md:p-12 mb-12">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          
          <div className="pt-6">
            <blockquote className="text-xl text-center italic text-gray-700 mb-6">
              "{testimonials[activeTestimonial].quote}"
            </blockquote>
            
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <div className="text-center">
              <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</p>
              <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full ${
                activeTestimonial === index ? "bg-pink-500" : "bg-gray-300"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
