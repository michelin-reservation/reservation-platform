import React, { useState, useEffect } from 'react';
import { List, AlignJustify, SortAsc } from 'lucide-react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import MapComponent from '../components/MapComponent';
import Pagination from '../components/Pagination';
import { restaurants } from '../data/restaurants';
import { Restaurant } from '../types';

const ITEMS_PER_PAGE = 9;

const sortOptions = [
  { id: 'default', name: 'Default', icon: <AlignJustify size={16} /> },
  { id: 'a-z', name: 'A-Z', icon: <SortAsc size={16} /> },
  { id: 'list', name: 'List view', icon: <List size={16} /> },
];

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('default');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);
  
  useEffect(() => {
    let result = [...restaurants];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.nameKorean.toLowerCase().includes(query) ||
        restaurant.address.toLowerCase().includes(query) ||
        restaurant.category.toLowerCase().includes(query) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (activeSort === 'a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredRestaurants(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, activeSort]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-red-600 mt-1">미쉐린 가이드 2025</p>
        </div>
        
        <div className="mb-8">
          <MapComponent restaurants={filteredRestaurants} />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-64">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex space-x-2">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveSort(option.id)}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  activeSort === option.id 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4">
            <p className="text-gray-600">
              "{searchQuery}"에 대한 검색 결과: {filteredRestaurants.length}개의 레스토랑
            </p>
          </div>
        )}
        
        <div className={`grid ${activeSort === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {paginatedRestaurants.length > 0 ? (
            paginatedRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-400 mt-2">다른 검색어를 시도해보세요.</p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;