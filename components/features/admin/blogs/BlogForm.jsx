import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogService } from '../../../../services/api/blogService';

const BlogForm = ({ blog = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meta_title: '',
    meta_description: '',
    thumbnail_image: null,
    thumbnail_image_alt_description: '',
    category_id: '', 
    tags: [],
  });
  
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]); 
  const [selectedTagObjects, setSelectedTagObjects] = useState([]); 
  const [errors, setErrors] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // New state for tag creation
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = Boolean(blog);

  // ReactQuill configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'script', 'indent', 'direction',
    'color', 'background', 'font', 'align',
    'link', 'image', 'video', 'blockquote', 'code-block'
  ];

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setIsInitialLoading(true);
        await fetchCategoriesAndTags();

        if (isEditMode && blog) {
          const existingBlogTags = blog.tags || [];
          const existingTagIds = existingBlogTags.map(tag => tag.id).filter(id => id != null);

          setFormData({
            title: blog.title || '',
            description: blog.description || '',
            meta_title: blog.meta_title || '',
            meta_description: blog.meta_description || '',
            thumbnail_image: null,
            thumbnail_image_alt_description: blog.thumbnail_image_alt_description || '',
            category_id: blog.category?.id || '',
            tags: existingTagIds,
          });
          setSelectedTagObjects(existingBlogTags);
        } else {
          setFormData({
            title: '',
            description: '',
            meta_title: '',
            meta_description: '',
            thumbnail_image: null,
            thumbnail_image_alt_description: '',
            category_id: '',
            tags: [],
          });
          setSelectedTagObjects([]);
        }
      } catch (error) {
        console.error('Error initializing form:', error);
        setErrors(prev => ({ ...prev, formInit: 'Failed to load initial form data.' }));
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeForm();
  }, [blog, isEditMode]);

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        blogService.getCategories(),
        blogService.getTags()
      ]);

      const categoriesData = categoriesRes?.results || categoriesRes?.data || categoriesRes || [];
      const tagsData = tagsRes?.results || tagsRes?.data || tagsRes || [];

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setAllTags(Array.isArray(tagsData) ? tagsData : []);
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
      setCategories([]);
      setAllTags([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle ReactQuill description change
  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
    
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handleTagChange = (tagId) => {
    const currentSelectedTagIds = formData.tags;
    const isSelected = currentSelectedTagIds.includes(tagId);

    const updatedTagIds = isSelected
      ? currentSelectedTagIds.filter(id => id !== tagId)
      : [...currentSelectedTagIds, tagId];

    setFormData(prev => ({
      ...prev,
      tags: updatedTagIds,
    }));

    const updatedSelectedTagObjects = allTags.filter(tag => updatedTagIds.includes(tag.id));
    setSelectedTagObjects(updatedSelectedTagObjects);
  };

  // New function to create a tag
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setErrors(prev => ({ ...prev, newTag: 'Tag name is required' }));
      return;
    }

    // Check if tag already exists
    const existingTag = allTags.find(tag => 
      (tag.title || tag.name).toLowerCase() === newTagName.trim().toLowerCase()
    );
    
    if (existingTag) {
      setErrors(prev => ({ ...prev, newTag: 'Tag already exists' }));
      return;
    }

    try {
      setIsCreatingTag(true);
      setErrors(prev => ({ ...prev, newTag: '' }));
      
      const newTag = await blogService.createTag({ 
        title: newTagName.trim(),
        name: newTagName.trim() // Include both fields in case API expects either
      });
      
      // Add new tag to allTags list
      setAllTags(prev => [...prev, newTag]);
      
      // Auto-select the newly created tag
      const newTagId = newTag.id;
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTagId]
      }));
      setSelectedTagObjects(prev => [...prev, newTag]);
      
      // Reset tag input
      setNewTagName('');
      setShowTagInput(false);
      
    } catch (error) {
      console.error('Error creating tag:', error);
      setErrors(prev => ({ 
        ...prev, 
        newTag: error.message || 'Failed to create tag' 
      }));
    } finally {
      setIsCreatingTag(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Check if description is empty (ReactQuill returns '<p><br></p>' for empty content)
    const descriptionText = formData.description?.replace(/<[^>]*>/g, '').trim();
    if (!descriptionText) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
    if (formData.meta_title && formData.meta_title.length > 60) {
      newErrors.meta_title = 'Meta title should be under 60 characters';
    }
    
    if (formData.meta_description && formData.meta_description.length > 160) {
      newErrors.meta_description = 'Meta description should be under 160 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      title: formData.title,
      description: formData.description,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      thumbnail_image_alt_description: formData.thumbnail_image_alt_description,
      category_id: formData.category_id,
      tags_id: formData.tags,
    };

    if (formData.thumbnail_image) {
      submitData.thumbnail_image = formData.thumbnail_image;
    }
    
    console.log("Submitting data:", JSON.stringify(submitData, null, 2)); 
    onSubmit(submitData); 
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      meta_title: '',
      meta_description: '',
      thumbnail_image: null,
      thumbnail_image_alt_description: '',
      category_id: '',
      tags: [],
    });
    setSelectedTagObjects([]);
    setErrors({});
    setNewTagName('');
    setShowTagInput(false);
  };

  if (isInitialLoading) {
    return (
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading form...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter blog title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description with ReactQuill */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Description *
          </label>
          <div className={`border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Write your blog description here..."
              style={{
                minHeight: '200px',
              }}
            />
          </div>
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="meta_title" className="block mb-1 text-sm font-medium text-gray-700">
              Meta Title
              <span className="ml-1 text-xs text-gray-500">(Recommended: under 60 characters)</span>
            </label>
            <input
              type="text"
              id="meta_title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.meta_title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="SEO title"
            />
            {errors.meta_title && <p className="mt-1 text-sm text-red-500">{errors.meta_title}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.meta_title.length}/60 characters</p>
          </div>
          
          <div>
            <label htmlFor="meta_description" className="block mb-1 text-sm font-medium text-gray-700">
              Meta Description
              <span className="ml-1 text-xs text-gray-500">(Recommended: under 160 characters)</span>
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.meta_description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="SEO description"
            />
            {errors.meta_description && <p className="mt-1 text-sm text-red-500">{errors.meta_description}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.meta_description.length}/160 characters</p>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div>
          <label htmlFor="thumbnail_image" className="block mb-1 text-sm font-medium text-gray-700">
            Thumbnail Image
            {isEditMode && blog?.thumbnail_image && (
              <span className="ml-1 text-xs text-gray-500">(Leave empty to keep current image)</span>
            )}
          </label>
          <input
            type="file"
            id="thumbnail_image"
            name="thumbnail_image"
            onChange={handleInputChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {isEditMode && blog?.thumbnail_image && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Current image:</p>
              <img 
                src={blog.thumbnail_image} 
                alt={blog.thumbnail_image_alt_description || 'Current thumbnail'} 
                className="object-cover w-32 h-32 mt-1 rounded-md"
              />
            </div>
          )}
          
          <div className="mt-2">
            <label htmlFor="thumbnail_image_alt_description" className="block mb-1 text-sm font-medium text-gray-700">
              Alt Description
            </label>
            <input
              type="text"
              id="thumbnail_image_alt_description"
              name="thumbnail_image_alt_description"
              value={formData.thumbnail_image_alt_description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Image alt description for accessibility"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block mb-1 text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.title || category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
        </div>

        {/* Enhanced Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Tags <span className="ml-1 text-xs text-gray-500">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowTagInput(!showTagInput)}
              className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Add New Tag
            </button>
          </div>

          {/* New Tag Creation Input */}
          {showTagInput && (
            <div className="p-3 mb-3 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => {
                    setNewTagName(e.target.value);
                    if (errors.newTag) {
                      setErrors(prev => ({ ...prev, newTag: '' }));
                    }
                  }}
                  placeholder="Enter new tag name"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={isCreatingTag || !newTagName.trim()}
                  className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingTag ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTagInput(false);
                    setNewTagName('');
                    setErrors(prev => ({ ...prev, newTag: '' }));
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
              {errors.newTag && <p className="mt-1 text-xs text-red-500">{errors.newTag}</p>}
            </div>
          )}
          
          {/* Selected Tags Display (Pills) */}
          {selectedTagObjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTagObjects.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
                >
                  {tag.title || tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagChange(tag.id)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    aria-label={`Remove ${tag.title || tag.name} tag`}
                  >×</button>
                </span>
              ))}
            </div>
          )}
          
          {/* Tags Selection (Checkboxes) */}
          <div className="p-2 space-y-2 overflow-y-auto border border-gray-300 rounded-md max-h-40">
            {allTags.length > 0 ? (
              allTags.map(tag => (
                <label key={tag.id} className="flex items-center p-1 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{tag.title || tag.name}</span>
                </label>
              ))
            ) : (
              <div className="py-4 text-center">
                <p className="mb-2 text-sm text-gray-500">No tags available yet.</p>
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Create your first tag
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-6 space-x-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          
          {!isEditMode && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Reset
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 mr-2 border-2 border-white border-dashed rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              `${isEditMode ? 'Update' : 'Create'} Blog`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;