"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Heart,
  Shield,
  Truck,
  RefreshCw,
  Star,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";

export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Core values data - easily modifiable
  const values = [
    {
      icon: <Heart className="w-10 h-10 text-pink-500" />,
      title: "Love & Care",
      description:
        "Every product is created with the same love and care we'd want for our own children.",
    },
    {
      icon: <Shield className="w-10 h-10 text-pink-500" />,
      title: "Safety First",
      description:
        "We ensure all our products meet the highest safety standards for your little ones.",
    },
    {
      icon: <Truck className="w-10 h-10 text-pink-500" />,
      title: "Reliable Service",
      description:
        "Fast and reliable delivery to your doorstep, because we know time matters.",
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-pink-500" />,
      title: "Quality Promise",
      description:
        "We stand behind every product with our 100% satisfaction guarantee.",
    },
  ];

  // Team members data - easily updatable
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Mother of two, passionate about providing the best for babies.",
      image: "/team/member2.avif",
      socials: [
        { icon: <Instagram className="w-5 h-5" />, link: "#" },
        { icon: <Twitter className="w-5 h-5" />, link: "#" },
      ],
    },
    {
      name: "Michael Chen",
      role: "Product Director",
      bio: "15+ years of experience in baby product development.",
      image: "/team/member1.avif",
      socials: [
        { icon: <Instagram className="w-5 h-5" />, link: "#" },
        { icon: <Twitter className="w-5 h-5" />, link: "#" },
      ],
    },
    {
      name: "Emma Davis",
      role: "Customer Care",
      bio: "Dedicated to ensuring every parent has a great shopping experience.",
      image: "/team/member2.avif",
      socials: [
        { icon: <Instagram className="w-5 h-5" />, link: "#" },
        { icon: <Twitter className="w-5 h-5" />, link: "#" },
      ],
    },
  ];

  // Testimonials data - easily modifiable
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

  // Company milestones - easily updatable
  const milestones = [
    { year: "2010", event: "Founded in a small home office" },
    { year: "2013", event: "Opened our first physical store" },
    { year: "2015", event: "Launched our exclusive baby essentials line" },
    { year: "2018", event: "Expanded nationwide with 10+ locations" },
    { year: "2020", event: "Introduced our eco-friendly product range" },
    { year: "2023", event: "Reached 100,000 happy families milestone" }
  ];

  // Contact info - easily updatable
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

  // Reusable components
  const SectionHeading = ({ badge, title, description }) => (
    <div className="text-center mb-16">
      <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium inline-block">
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );

  const TeamMemberCard = ({ member }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-80">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-pink-600 font-medium mb-4">{member.role}</p>
        <p className="text-gray-600 mb-5">{member.bio}</p>
        <div className="flex justify-center space-x-4">
          {member.socials.map((social, index) => (
            <a key={index} href={social.link} className="text-gray-500 hover:text-pink-600 transition-colors duration-300">
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const ValueCard = ({ value }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="mb-6 bg-pink-50 p-3 rounded-xl inline-block">{value.icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {value.title}
      </h3>
      <p className="text-gray-600">{value.description}</p>
    </div>
  );

  const ContactCard = ({ info }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
      <div className="bg-pink-100 p-3 rounded-full mb-4">
        {info.icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
      <p className="text-gray-600">
        {info.details.map((detail, i) => (
          <span key={i}>
            {detail}
            {i < info.details.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="mb-2">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Home className="w-4 h-4" />
                <span className="ml-1">Home</span>
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-900 font-medium">About Us</li>
          </ol>
        </nav>
      </div> */}

      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">Our Mission</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Caring for Your Little Ones Since 2010
              </h1>
              <p className="text-lg text-gray-600">
                We're more than just a baby shop. We're a community of parents,
                caregivers, and baby product experts dedicated to making your
                parenting journey easier and more enjoyable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 flex items-center"
                >
                  Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/aboutusimage/happyfamilybabe.webp"
                alt="Happy family with baby"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            badge="What We Stand For"
            title="Our Core Values"
            description="These principles guide everything we do, from product selection to customer service and beyond."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} value={value} />
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/aboutusimage/ourstory.webp"
                alt="Our story"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">Our Journey</span>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-600">
                It all began in 2010 when our founder, Sarah, struggled to find
                high-quality, safe baby products for her first child. Frustrated
                by the lack of options, she decided to create a one-stop shop
                for parents who care about quality and safety.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to serve thousands of families across the
                country, offering carefully curated products that meet our
                strict standards for quality, safety, and value.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center p-6 bg-pink-50 rounded-xl">
                  <div className="text-4xl font-bold text-pink-500">15+</div>
                  <div className="text-gray-700 font-medium">Years of Experience</div>
                </div>
                <div className="text-center p-6 bg-pink-50 rounded-xl">
                  <div className="text-4xl font-bold text-pink-500">100k+</div>
                  <div className="text-gray-700 font-medium">Happy Families</div>
                </div>
              </div>
              
              <div className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Our Milestones</h3>
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-pink-500 font-bold w-16">{milestone.year}</span>
                      <div className="w-3 h-3 bg-pink-500 rounded-full mx-3"></div>
                      <span className="text-gray-700">{milestone.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
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

      {/* Team Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-pink-600">Experts</span>
            </h2>
            <div className="w-20 h-1 bg-pink-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The talented professionals who make everything possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <ContactCard key={index} info={info} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Our Growing Family
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the difference of shopping with a company that truly
            cares about your baby's well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
