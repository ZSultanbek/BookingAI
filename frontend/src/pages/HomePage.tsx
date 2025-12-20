import React from 'react';
import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { HotelCard } from '../components/HotelCard';
import { getProperties } from '../lib/api';
import { Hotel } from '../types';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function HomePage({ onNavigate, favorites, onToggleFavorite }: HomePageProps) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotels() {
      try {
        setLoading(true);
        const properties = await getProperties();
        setHotels(properties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hotels');
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  const handleSearch = () => {
    onNavigate('search', { destination, checkIn, checkOut, guests });
  };

  const aiRecommendations = hotels.filter(h => h.aiScore >= 85).slice(0, 3);
  const popularHotels = hotels.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="text-center text-white mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-5xl">Find Your Perfect Stay with AI</h1>
            </div>
            <p className="text-xl text-white/90">
              Personalized hotel recommendations powered by artificial intelligence
            </p>
          </div>

          {/* Search Box */}
          <Card className="max-w-4xl mx-auto w-full p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm text-gray-600 mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full mt-4 h-12" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Search Hotels
            </Button>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
        {/* AI Recommendations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl text-gray-900">AI Recommendations for You</h2>
                <p className="text-gray-600">Personalized picks based on your preferences</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => onNavigate('ai-recommendations')}>
              View All
            </Button>
          </div>
          
              {aiRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommendations.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={(id) => onNavigate('hotel-details', { hotelId: id })}
                isFavorite={favorites.includes(hotel.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
              ) : (
                <p className="text-gray-600">No AI recommendations available yet.</p>
              )}
        </div>

        {/* Popular Destinations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-3xl text-gray-900">Trending Destinations</h2>
                <p className="text-gray-600">Most popular places this month</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => onNavigate('destinations')}>
              Explore More
            </Button>
          </div>
          
              {popularHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={(id) => onNavigate('hotel-details', { hotelId: id })}
                isFavorite={favorites.includes(hotel.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
              ) : (
                <p className="text-gray-600">No hotels available.</p>
              )}
        </div>
          </>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600">
              Our AI learns your preferences to suggest the perfect hotels for you
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Smart Search</h3>
            <p className="text-gray-600">
              Advanced filters and AI recommendations make finding hotels effortless
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600">
              AI analyzes millions of prices to ensure you get the best deal
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
