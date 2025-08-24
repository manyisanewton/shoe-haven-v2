import { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [size, setSize] = useState('');

  const handleApplyFilters = () => {
    onFilterChange({ brand, minPrice, maxPrice, size });
  };

  const handleClearFilters = () => {
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSize('');
    onFilterChange({ brand: '', minPrice: '', maxPrice: '', size: '' });
  };

  // Dummy data - In a real app, you'd fetch these from the API
  const brands = ['Airforce', 'Nike', 'Adidas', 'Sport Shoes'];
  const sizes = [6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Brand */}
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {/* Min Price */}
        <input type="number" placeholder="Min Price (KES)" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
        {/* Max Price */}
        <input type="number" placeholder="Max Price (KES)" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
        {/* Size */}
        <select value={size} onChange={(e) => setSize(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
          <option value="">All Sizes</option>
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {/* Buttons */}
        <div className="flex space-x-2">
            <button onClick={handleApplyFilters} className="flex-1 bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600">Apply</button>
            <button onClick={handleClearFilters} className="flex-1 bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;