import { useState, useEffect } from 'react';
import { fetchCategories, fetchSubcategories } from '../services/supabaseService';
import { Category, Subcategory } from '../types/supabaseTypes';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [categoriesData, subcategoriesData] = await Promise.all([
          fetchCategories(),
          fetchSubcategories()
        ]);
        
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Error loading categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, subcategories, loading, error };
}; 