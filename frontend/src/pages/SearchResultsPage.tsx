import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, Grid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { HotelCard } from '../components/HotelCard';
import { mockHotels } from '../data/mockData';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';

interface SearchResultsPageProps {
  onNavigate: (page: string, data?: any) => void;
  searchData?: any;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function SearchResultsPage({ onNavigate, searchData, favorites, onToggleFavorite }: SearchResultsPageProps) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('ai-score');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const amenitiesList = ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Bar', 'Beach Access'];

  const filteredHotels = mockHotels
    .filter(hotel => hotel.price >= priceRange[0] && hotel.price <= priceRange[1])
    .filter(hotel => 
      selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'ai-score':
          return b.aiScore - a.aiScore;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-gray-900 mb-4">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000}
          step={50}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg text-gray-900 mb-4">Amenities</h3>
        <div className="space-y-3">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setPriceRange([0, 1000]);
          setSelectedAmenities([]);
        }}
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl text-gray-900">
                {searchData?.destination || 'All Hotels'}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredHotels.length} properties found
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-score">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Recommended
                    </div>
                  </SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl text-gray-900">Filters</h2>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onViewDetails={(id) => onNavigate('hotel-details', { hotelId: id })}
                  isFavorite={favorites.includes(hotel.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
