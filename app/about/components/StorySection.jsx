import Image from "next/image";

export function StorySection({ milestones }) {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/banners/ourstory.webp"
              alt="Our story"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              Our Journey
            </span>
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
  );
}
