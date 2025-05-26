import TestimonialCard from "../TestimonialCard/TestimonialCard";
import SectionHeader from "../SectionHeader/SectionHeader";

const testimonials = [
  {
    id: 1,
    name: "Ram Malla",
    text: "I got anxious about choosing the right products for my baby, but Nishimatsuya made it so easy. The quality is top-notch and delivery was super fast!",
    image: "/images/ui/male.avif",
    role: "Dad",
  },
  {
    id: 2,
    name: "Ramesh Malla",
    text: "We had several toy shops, but Nishimatsuya stands out for its variety and genuine products. Highly recommended!",
    image: "/images/ui/male.avif",
    role: "Dad",
  },
  {
    id: 3,
    name: "Dipak Chhetri",
    text: "As a pediatrician, my top concern is safety. Nishimatsuya delivers only the best and safest products for babies.",
    image: "/images/ui/male.avif",
    role: "Pediatrician",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Testimonials" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
