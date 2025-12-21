import React, { useState, useEffect } from 'react';
import { Heart, Grid, List, ArrowUpDown } from 'lucide-react';
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from '../components/ui/button';
import { HotelCard } from '../components/HotelCard';
import { getProperties } from '../lib/api';
import { Hotel } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface FavoritesPageProps {
  onNavigate: (page: string, data?: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function FavoritesPage({ onNavigate, favorites, onToggleFavorite }: FavoritesPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('added');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchHotels() {
      try {
        const properties = await getProperties();
        setHotels(properties);
      } catch (err) {
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  const favoriteHotels = hotels.filter(hotel => favorites.includes(hotel.id));

  const sortedHotels = [...favoriteHotels].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Heart className="w-12 h-12" />
            <div>
                <h1 className="text-5xl mb-2">{t.favorites.title}</h1>
                <p className="text-xl text-white/90">
                  {t.favorites.savedCount.replace('{count}', String(favorites.length))}
                </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t.favorites.loading}</p>
          </div>
        ) : favoriteHotels.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-pink-600" />
            </div>
            <h2 className="text-3xl text-gray-900 mb-3">{t.favorites.noFavoritesTitle}</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{t.favorites.noFavoritesDesc}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => onNavigate('search')}>
                {t.favorites.browseHotels}
              </Button>
              <Button variant="outline" onClick={() => onNavigate('ai-recommendations')}>
                {t.favorites.viewAIRecommendations}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
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
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:inline">{t.favorites.sortByLabel}</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">{t.search.sorts.recentlyAdded}</SelectItem>
                    <SelectItem value="price-low">{t.search.sorts.priceLow}</SelectItem>
                    <SelectItem value="price-high">{t.search.sorts.priceHigh}</SelectItem>
                    <SelectItem value="rating">{t.search.sorts.highestRated}</SelectItem>
                    <SelectItem value="name">{t.search.sorts.name}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {sortedHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onViewDetails={(id) => onNavigate('hotel-details', { hotelId: id })}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

            {favoriteHotels.length >= 2 && (
              <div className="mt-12 text-center">
                <Button onClick={() => onNavigate('compare-hotels')} size="lg">
                  {t.favorites.compareFavorites}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
