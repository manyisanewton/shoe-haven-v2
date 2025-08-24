import { useState, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';
import ProductCard from '../components/products/ProductCard';
import SkeletonCard from '../components/products/SkeletonCard';
import Pagination from '../components/common/Pagination';
import FilterBar from '../components/products/FilterBar'; // <-- Import FilterBar
import { toast } from 'react-toastify';

const Store = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({}); // <-- State for filters

  const PRODUCTS_PER_PAGE = 8;

  const fetchShoes = useCallback(async () => {
    setLoading(true);
    try {
      // Use URLSearchParams to build the query string cleanly
      const params = new URLSearchParams({
        page: currentPage,
        per_page: PRODUCTS_PER_PAGE,
      });

      // Add active filters to the query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) { // Only add non-empty filters
          params.append(key, value);
        }
      });
      
      // Hit the search endpoint instead of the generic shoes endpoint
      const response = await apiService.get(`/shoes/search?${params.toString()}`);
      
      setShoes(response.data.shoes);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error('Failed to fetch products.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]); // <-- Rerun fetchShoes when filters change

  useEffect(() => {
    fetchShoes();
  }, [fetchShoes]);

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(newFilters);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Our Collection</h1>
      
      <FilterBar onFilterChange={handleFilterChange} /> {/* <-- Add FilterBar */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => <SkeletonCard key={index} />)
          : shoes.map(shoe => <ProductCard key={shoe.id} shoe={shoe} />)
        }
      </div>

      {!loading && shoes.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No products found. Try adjusting your filters.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Store;