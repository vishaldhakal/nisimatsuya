import Image from "next/image";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      <div className="w-16 h-16 relative mb-3">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover rounded-full border-2 border-pink-200"
        />
      </div>
      <p className="text-gray-700 text-sm mb-3">"{testimonial.text}"</p>
      <div className="font-semibold text-gray-900">{testimonial.name}</div>
      <div className="text-xs text-pink-600">{testimonial.role}</div>
    </div>
  );
}
