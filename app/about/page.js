
"use client";

import { useState } from "react";
import {
  Heart,
  Shield,
  Truck,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
} from "lucide-react";
import { 
  HeroSection,
  ValuesSection,
  StorySection,
  TestimonialsSection,
  TeamSection,
  ContactInfoSection,
  CTASection 
} from "./components";

export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Core values data
  const values = [
    {
      icon: <Heart className="w-10 h-10 text-pink-500" />,
      title: "Love & Care",
      description: "Every product is created with the same love and care we'd want for our own children.",
    },
    {
      icon: <Shield className="w-10 h-10 text-pink-500" />,
      title: "Safety First",
      description: "We ensure all our products meet the highest safety standards for your little ones.",
    },
    {
      icon: <Truck className="w-10 h-10 text-pink-500" />,
      title: "Reliable Service",
      description: "Fast and reliable delivery to your doorstep, because we know time matters.",
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-pink-500" />,
      title: "Quality Promise",
      description: "We stand behind every product with our 100% satisfaction guarantee.",
    },
  ];

  // Team members data
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Mother of two, passionate about providing the best for babies.",
      image: "/images/team/member2.avif",
      socials: [
        { icon: <Instagram className="w-5 h-5" />, link: "#" },
        { icon: <Twitter className="w-5 h-5" />, link: "#" },
      ],
    },
    {
      name: "Michael Chen",
      role: "Product Director",
      bio: "15+ years of experience in baby product development.",
      image: "/images/team/member1.avif",
      socials: [
        { icon: <Instagram className="w-5 h-5" />, link: "#" },
        { icon: <Twitter className="w-5 h-5" />, link: "#" },
      ],
    },
    {
      name: "Emma Davis",
      role: "Customer Care",
      bio: "Dedicated to ensuring every parent has a great shopping experience.",
      image: "/images/team/member2.avif",
      socials: [
        { icon: <Instagram className="w-5 h-5" />, link: "#" },
        { icon: <Twitter className="w-5 h-5" />, link: "#" },
      ],
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Jessica P.",
      role: "Mother of twins",
      quote: "I can't imagine my parenting journey without their products. The quality is outstanding, and the customer service is exceptional!",
      rating: 5
    },
    {
      name: "Thomas L.",
      role: "First-time dad",
      quote: "As a new father, I was overwhelmed with choices until I found this shop. Their curated selection made finding the right products so much easier.",
      rating: 5
    },
    {
      name: "Maria S.",
      role: "Grandmother of three",
      quote: "I purchase gifts for my grandchildren here regularly. The products are always high-quality and thoughtfully designed.",
      rating: 5
    }
  ];

  // Company milestones
  const milestones = [
    { year: "2010", event: "Founded in a small home office" },
    { year: "2013", event: "Opened our first physical store" },
    { year: "2015", event: "Launched our exclusive baby essentials line" },
    { year: "2018", event: "Expanded nationwide with 10+ locations" },
    { year: "2020", event: "Introduced our eco-friendly product range" },
    { year: "2023", event: "Reached 100,000 happy families milestone" }
  ];

  // Contact info
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-pink-500" />,
      title: "Visit Us",
      details: ["123 Baby Avenue, Suite 101", "New York, NY 10001"]
    },
    {
      icon: <Phone className="w-6 h-6 text-pink-500" />,
      title: "Call Us",
      details: ["Customer Support", "(800) 123-4567"]
    },
    {
      icon: <Mail className="w-6 h-6 text-pink-500" />,
      title: "Email Us",
      details: ["General Inquiries", "hello@babyshop.com"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <ValuesSection values={values} />
      <StorySection milestones={milestones} />
      <TestimonialsSection 
        testimonials={testimonials}
        activeTestimonial={activeTestimonial}
        setActiveTestimonial={setActiveTestimonial}
      />
      <TeamSection team={team} />
      <ContactInfoSection contactInfo={contactInfo} />
      <CTASection />
    </div>
  );
}

