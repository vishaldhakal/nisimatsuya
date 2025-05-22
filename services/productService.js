import axiosInstance from '../lib/axiosInstance';

export const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get('/api/categories/');
    return res.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchProducts = async () => {
  const res = await axiosInstance.get('/api/products/');
  return res.data;
};

export const addProduct = async (data) => {
  try {
    console.log('=== DEBUGGING PRODUCT SUBMISSION ===');
    console.log('Original data received:', data);
    
    // Separate images from other data
    const { images, id, ...productData } = data; // Remove id from submission
    
    console.log('Images found:', images?.length || 0);
    console.log('Images data:', images);
    
    // Clean the product data
    const cleanData = {
      name: String(productData.name || '').trim(),
      description: String(productData.description || '').trim(),
      market_price: parseFloat(productData.market_price) || 0,
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 0,
      category: parseInt(productData.category) || null,
      is_popular: Boolean(productData.is_popular),
      is_featured: Boolean(productData.is_featured),
      is_active: Boolean(productData.is_active),
      discount: parseFloat(productData.discount) || 0,
      slug: String(productData.slug || '').trim(),
    };

    console.log('Cleaned product data:', cleanData);

    // Check if we have images and they contain actual files
    const hasValidImages = images && images.length > 0 && 
      images.some(img => img.file || (img.image && img.image.startsWith('data:')));
    
    console.log('Has valid images:', hasValidImages);

    if (hasValidImages) {
      console.log('Creating FormData for multipart submission...');
      const formData = new FormData();
      
      // Append all product fields to FormData
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] !== null && cleanData[key] !== undefined) {
          formData.append(key, String(cleanData[key]));
          console.log(`Added to FormData: ${key} = ${cleanData[key]}`);
        }
      });
      
      // Process and append images
      let imageCount = 0;
      for (let i = 0; i < images.length; i++) {
        const imageObj = images[i];
        console.log(`Processing image ${i}:`, {
          hasFile: !!imageObj.file,
          hasDataUrl: !!(imageObj.image && imageObj.image.startsWith('data:')),
          name: imageObj.name,
          type: imageObj.type
        });

        if (imageObj.file) {
          // Use original file object
          formData.append('images', imageObj.file);
          imageCount++;
          console.log(`Added file to FormData: ${imageObj.file.name} (${imageObj.file.size} bytes)`);
        } else if (imageObj.image && imageObj.image.startsWith('data:')) {
          // Convert base64 to blob
          try {
            const base64Data = imageObj.image.split(',')[1];
            const mimeType = imageObj.image.split(',')[0].split(':')[1].split(';')[0];
            const blob = base64ToBlob(base64Data, mimeType);
            const fileName = imageObj.name || `image_${i}.jpg`;
            formData.append('images', blob, fileName);
            imageCount++;
            console.log(`Added blob to FormData: ${fileName} (${blob.size} bytes)`);
          } catch (blobError) {
            console.error(`Error converting image ${i} to blob:`, blobError);
          }
        }
      }

      console.log(`Total images added to FormData: ${imageCount}`);

      // Log FormData contents (for debugging)
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File || pair[1] instanceof Blob) {
          console.log(pair[0], ':', `File/Blob - ${pair[1].name || 'unnamed'} (${pair[1].size} bytes)`);
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

      const res = await axiosInstance.post('/api/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for file uploads
      });
      
      console.log('Success response:', res.data);
      return res.data;
    } else {
      // No images, send as JSON
      console.log('No images found, sending as JSON...');
      console.log('JSON payload:', cleanData);
      
      const res = await axiosInstance.post('/api/products/', cleanData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Success response:', res.data);
      return res.data;
    }
  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error adding product:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Headers:', error.response?.headers);
    console.error('Request Config:', error.config);
    
    // Enhanced error handling
    if (error.response?.data) {
      const errorData = error.response.data;
      console.error('Detailed error data:', errorData);
      
      if (typeof errorData === 'object') {
        // Handle Django-style validation errors
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
        
        // Handle field-specific errors
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            } else if (typeof messages === 'string') {
              return `${field}: ${messages}`;
            } else {
              return `${field}: ${JSON.stringify(messages)}`;
            }
          })
          .join('; ');
        
        if (errorMessages) {
          throw new Error(errorMessages);
        }
      }
      
      // If error data is a string
      if (typeof errorData === 'string') {
        throw new Error(errorData);
      }
    }
    
    // Generic error message
    throw new Error(error.response?.data?.message || error.message || 'Failed to add product');
  }
};

export const editProduct = async (id, data) => {
  try {
    console.log('Editing product with ID:', id, 'Data:', data);
    
    const { images, ...productData } = data;
    
    const cleanData = {
      name: String(productData.name || '').trim(),
      description: String(productData.description || '').trim(),
      market_price: parseFloat(productData.market_price) || 0,
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 0,
      category: parseInt(productData.category) || null,
      is_popular: Boolean(productData.is_popular),
      is_featured: Boolean(productData.is_featured),
      is_active: Boolean(productData.is_active),
      discount: parseFloat(productData.discount) || 0,
      slug: String(productData.slug || '').trim(),
    };

    const hasValidImages = images && images.length > 0 && 
      images.some(img => img.file || (img.image && img.image.startsWith('data:')));

    if (hasValidImages) {
      const formData = new FormData();
      
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] !== null && cleanData[key] !== undefined) {
          formData.append(key, String(cleanData[key]));
        }
      });
      
      images.forEach((imageObj, index) => {
        if (imageObj.file) {
          formData.append('images', imageObj.file);
        } else if (imageObj.image && imageObj.image.startsWith('data:')) {
          const base64Data = imageObj.image.split(',')[1];
          const mimeType = imageObj.image.split(',')[0].split(':')[1].split(';')[0];
          const blob = base64ToBlob(base64Data, mimeType);
          formData.append('images', blob, imageObj.name || `image_${index}.jpg`);
        }
      });

      const res = await axiosInstance.put(`/api/products/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      return res.data;
    } else {
      const res = await axiosInstance.put(`/api/products/${id}/`, cleanData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return res.data;
    }
  } catch (error) {
    console.error('Error editing product:', error.response?.data || error.message);
    
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'object') {
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        throw new Error(errorMessages || 'Validation error');
      }
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to edit product');
  }
};

export const fetchProduct = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/products/${id}/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch product');
  }
};

// Helper function to convert base64 to blob
const base64ToBlob = (base64Data, mimeType) => {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    throw new Error('Failed to process image data');
  }
};

// Test function to add product without images (for debugging)
export const addProductWithoutImages = async (data) => {
  try {
    const { images, id, ...productData } = data; // Remove images and id
    
    const cleanData = {
      name: String(productData.name || '').trim(),
      description: String(productData.description || '').trim(),
      market_price: parseFloat(productData.market_price) || 0,
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 0,
      category: parseInt(productData.category) || null,
      is_popular: Boolean(productData.is_popular),
      is_featured: Boolean(productData.is_featured),
      is_active: Boolean(productData.is_active),
      discount: parseFloat(productData.discount) || 0,
      slug: String(productData.slug || '').trim(),
    };

    console.log('Adding product without images:', cleanData);
    const res = await axiosInstance.post('/api/products/', cleanData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error adding product without images:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to add product');
  }
};

// Function to handle image upload separately (if needed)
export const uploadProductImages = async (productId, images) => {
  try {
    const formData = new FormData();
    images.forEach((imageObj) => {
      if (imageObj.file) {
        formData.append('images', imageObj.file);
      }
    });

    const res = await axiosInstance.post(`/api/products/${productId}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return res.data;
  } catch (error) {
    console.error('Error uploading product images:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to upload images');
  }
};