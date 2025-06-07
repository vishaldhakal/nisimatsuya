"use client";
import { useState, useEffect } from "react";
import { Star, MessageCircle, Camera } from "lucide-react";
import reviewService from "@/services/api/reviewService";
const ProductReviewsSection = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.slug) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch reviews and stats
        const [reviewsData, statsData] = await Promise.all([
          reviewService.getReviewsBySlug(product.slug),
        ]);

        setReviews(reviewsData || []);
        setReviewStats(statsData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [product?.slug]);

  const renderStars = (rating, size = "w-4 h-4", showEmpty = true) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : showEmpty
            ? "text-gray-300"
            : "hidden"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  if (loading) {
    return (
      <div className="p-4 mt-6 bg-white shadow-sm rounded-2xl lg:p-6">
        <div className="animate-pulse">
          <div className="w-48 h-6 mb-4 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center mb-2 space-x-2">
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mt-6 bg-white shadow-sm rounded-2xl lg:p-6">
        <div className="py-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Unable to Load Reviews
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white shadow-sm rounded-2xl lg:mt-8">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100 lg:p-6">
        <h2 className="text-xl font-bold text-gray-900 lg:text-2xl">
          Product Reviews
        </h2>
      </div>

      {/* Review Statistics */}
      {reviewStats && reviewStats.totalReviews > 0 && (
        <div className="p-4 lg:p-6">
          <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-8">
            {/* Overall Rating - Mobile/Desktop Responsive */}
            <div className="flex flex-col items-center lg:items-start lg:min-w-0 lg:flex-shrink-0">
              <div className="font-bold text-gray-900 lg:text-2xl">
                {reviewStats.averageRating}
                <span className="font-normal text-gray-500 lg:text-xl">/5</span>
              </div>
              <div className="flex mt-2 mb-2">
                {renderStars(
                  Math.round(reviewStats.averageRating),
                  "w-5 h-5 lg:w-6 lg:h-6"
                )}
              </div>
              <p className="text-sm text-gray-600 lg:text-base">
                {reviewStats.totalReviews} Rating
                {reviewStats.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviewStats.ratingDistribution[rating] || 0;
                const percentage =
                  reviewStats.totalReviews > 0
                    ? (count / reviewStats.totalReviews) * 100
                    : 0;

                return (
                  <div className="w-full sm:w-1/2 lg:w-1/4">
                    <div
                      key={rating}
                      className="flex items-center mb-2 space-x-3"
                    >
                      <div className="flex items-center flex-shrink-0 min-w-0 space-x-1">
                        <span className="text-sm font-medium text-gray-900">
                          {rating}
                        </span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div
                          className="h-full transition-all duration-500 ease-out bg-yellow-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="flex-shrink-0 w-6 min-w-0 text-sm font-medium text-right text-gray-900">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="p-4 lg:p-6">
        {reviews.length === 0 ? (
          <div className="py-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Reviews Yet
            </h3>
            <p className="text-gray-500">
              Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {displayedReviews.map((review, index) => (
              <div
                key={review.id || index}
                className="p-4 transition-shadow duration-200 border border-gray-200 rounded-xl lg:p-6 hover:shadow-md"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-sm font-semibold text-white">
                        {(review.username || review.first_name || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                        <p className="font-semibold text-gray-900 truncate">
                          {review.username ||
                            review.user?.first_name ||
                            "Anonymous User"}
                        </p>
                        {review.verified_purchase && (
                          <span className="inline-flex items-center self-start px-2 py-1 mt-1 text-xs font-medium text-green-700 bg-green-100 rounded-full sm:mt-0">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <div className="flex">
                          {renderStars(review.rating, "w-4 h-4")}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.created_at
                            ? formatDate(review.created_at)
                            : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                {review.review && (
                  <div className="mb-4">
                    <p className="leading-relaxed text-gray-700">
                      {review.review}
                    </p>
                  </div>
                )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex mb-4 space-x-2">
                    {review.images.slice(0, 3).map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={image}
                          alt={`Review image ${imgIndex + 1}`}
                          className="object-cover w-16 h-16 border-2 border-gray-200 rounded-lg"
                        />
                      </div>
                    ))}
                    {review.images.length > 3 && (
                      <div className="flex items-center justify-center w-16 h-16 text-xs font-medium text-gray-500 bg-gray-100 border-2 border-gray-200 rounded-lg">
                        <div className="text-center">
                          <Camera className="w-4 h-4 mx-auto mb-1" />+
                          {review.images.length - 3}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Show More/Less Button */}
            {reviews.length > 3 && (
              <div className="pt-4 text-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="px-6 py-3 text-sm font-semibold text-blue-600 transition-all duration-200 transform rounded-xl bg-blue-50 hover:bg-blue-100 hover:scale-105"
                >
                  {showAllReviews
                    ? "Show Less Reviews"
                    : `Show All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviewsSection;


