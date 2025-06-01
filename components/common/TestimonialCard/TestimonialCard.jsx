import Image from "next/image";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="flex flex-col items-center p-8 text-center transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-xl hover:border-pink-200 hover:-translate-y-1">
      <div className="relative w-20 h-20 mb-6">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover border-4 border-pink-100 rounded-full shadow-md"
          onError={(e) => {
            e.target.src = "/images/ui/default-avatar.png";
          }}
        />
      </div>
      
      {/* Quote Icon */}
      <div className="mb-4 text-pink-400">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
        </svg>
      </div>
      
      <p className="mb-6 text-base italic leading-relaxed text-gray-700">
        "{testimonial.comment}"
      </p>
      
      <div className="mt-auto">
        <div className="mb-1 text-lg font-bold text-gray-900">
          {testimonial.name}
        </div>
        <div className="text-sm font-medium tracking-wide text-pink-600 uppercase">
          {testimonial.designation}
        </div>
      </div>
      
      {/* Rating stars if available */}
      {testimonial.rating && (
        <div className="flex mt-3 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>
      )}
    </div>
  );
}