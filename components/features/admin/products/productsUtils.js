export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
};

export const getStockStatus = (stock) => {
  if (stock === undefined || stock === null) return { color: 'gray', text: 'Not tracked' };
  if (stock <= 0) return { color: 'red', text: 'Out of stock' };
  if (stock < 10) return { color: 'orange', text: 'Low stock' };
  return { color: 'green', text: 'In stock' };
};

export const getCategoryName = (category, categories) => {
  if (!category) return <span className="text-gray-400">-</span>;
  if (typeof category === 'object' && category.name) return category.name;
  const cat = categories.find(c => String(c.id) === String(category));
  return cat ? cat.name : <span className="text-gray-400">-</span>;
};