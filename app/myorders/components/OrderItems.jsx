import { Package } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import reviewService from '../../../services/api/reviewService';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { useToast } from '../../../hooks/use-toast';

const OrderItems = ({ items }) => {
  const { toast } = useToast();
  const [reviewData, setReviewData] = useState({
    product_id: null,
    rating: 0,
    review: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialogId, setOpenDialogId] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    }));
  };

  const submitReview = async (productId) => {
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      toast({
        title: 'Error',
        description: 'Please select a rating between 1 and 5 stars',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        product_id: productId,
        rating: reviewData.rating,
        review: reviewData.review,
      });

      toast({
        title: 'Success',
        description: 'Your review has been submitted successfully!',
      });
      setOpenDialogId(null);
      setReviewData({
        product_id: null,
        rating: 0,
        review: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-2 mb-4 sm:mb-6 sm:px-0">
      <h4 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">Order Items</h4>
      <div className="space-y-3 sm:space-y-4">
        {items?.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg sm:gap-4 sm:p-4 bg-gray-50">
            {/* Product Image */}
            <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-white border border-gray-200 rounded-lg sm:w-16 sm:h-16 md:w-20 md:h-20">
              {item.product_thumbnail_image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.product_thumbnail_image}`}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Package className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              {/* Product Name with Review Button */}
              <div className="flex items-start justify-between mb-2">
                <h5 className="flex-1 pr-2 text-sm font-semibold leading-tight text-gray-900 sm:text-base line-clamp-2">
                  {item.product_name}
                </h5>
                
                <Dialog 
                  open={openDialogId === item.product_id} 
                  onOpenChange={(open) => setOpenDialogId(open ? item.product_id : null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-shrink-0 text-xs sm:text-sm">
                      Add Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Review {item.product_name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1">Rating (1-5 stars)</label>
                        <Input
                          type="number"
                          name="rating"
                          min="1"
                          max="5"
                          value={reviewData.rating}
                          onChange={handleReviewChange}
                          placeholder="Enter rating (1-5)"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Review</label>
                        <Textarea
                          name="review"
                          value={reviewData.review}
                          onChange={handleReviewChange}
                          placeholder="Share your experience with this product..."
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={() => submitReview(item.product_id)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Mobile Layout */}
              <div className="space-y-2 sm:hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 text-xs font-medium bg-white border rounded">
                    Qty: {item.quantity}
                  </span>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  Unit Price: {formatCurrency(item.price / item.quantity)}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="flex-col hidden gap-2 sm:flex md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-2 py-1 font-medium bg-white border rounded">
                    Qty: {item.quantity}
                  </span>
                  <span>
                    Unit Price: {formatCurrency(item.price / item.quantity)}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(item.price)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;