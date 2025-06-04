// "use client";
// import { useState, useEffect } from "react";
// import { fetchCategories } from "../services/api/categoryService";

// export function useCategories() {
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true; 

//     async function loadCategoriesWithProducts() {
//       try {
//         setLoading(true);
//         const cats = await fetchCategories();
        
//         if (!isMounted) return; 
        
//         setCategories(cats || []);
        

//         setFilteredCategories(cats || []);
      
        
//       } catch (error) {
//         console.error('Error loading categories:', error);
//         if (isMounted) {
//           setCategories([]);
//           setFilteredCategories([]);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     }

//     loadCategoriesWithProducts();

//     // Cleanup function
//     return () => {
//       isMounted = false;
//     };
//   }, []); // Empty dependency array - only run once

//   return { categories, filteredCategories, loading };
// }