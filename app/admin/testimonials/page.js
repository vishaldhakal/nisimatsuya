'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import testimonialService from '../../../services/api/testimonialService';
import {
  TestimonialsHeader,
  TestimonialsTable,
  TestimonialModal
} from '../../../components/features/admin/testimonials';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await testimonialService.getTestimonials();
      if (response.success) {
        setTestimonials(response.data);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Failed to fetch testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await testimonialService.deleteTestimonial(id);
      if (response.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        toast.success('Testimonial deleted successfully');
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingTestimonial) {
        response = await testimonialService.updateTestimonial(editingTestimonial.id, formData);
      } else {
        response = await testimonialService.createTestimonial(formData);
      }

      if (response.success) {
        toast.success(
          editingTestimonial 
            ? 'Testimonial updated successfully' 
            : 'Testimonial created successfully'
        );
        setIsModalOpen(false);
        setEditingTestimonial(null);
        fetchTestimonials(); // Refresh the list
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container with responsive padding */}
      <div className="container px-3 py-4 mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8 sm:py-6">
        {/* Header Section */}
        <TestimonialsHeader 
          onAdd={handleAdd}
          testimonialsCount={testimonials.length}
        />
        
        {/* Content Card with responsive design */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm sm:shadow">
          <TestimonialsTable
            testimonials={testimonials}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>

        {/* Modal */}
        <TestimonialModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          testimonial={editingTestimonial}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}