import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Briefcase, Palmtree, Mountain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { HotelCard } from '../components/HotelCard';
import { getProperties } from '../lib/api';
import { Hotel } from '../types';
import { Progress } from '../components/ui/progress';

interface AIRecommendationsPageProps {
  onNavigate: (page: string, data?: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function AIRecommendationsPage({ onNavigate, favorites, onToggleFavorite }: AIRecommendationsPageProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

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

  const topRecommendations = hotels.filter(h => h.aiScore >= 90);
  const goodMatches = hotels.filter(h => h.aiScore >= 85 && h.aiScore < 90);
  const otherOptions = hotels.filter(h => h.aiScore < 85);

  const preferences = [
    { name: 'Luxury', value: 95, icon: Sparkles },
    { name: 'Beach & Relaxation', value: 88, icon: Palmtree },
    { name: 'Business Travel', value: 75, icon: Briefcase },
    { name: 'Adventure', value: 70, icon: Mountain },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl">AI Recommendations</h1>
              <p className="text-white/90 text-lg">Personalized picks just for you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        )}

        {!loading && (
          <>
        {/* AI Preference Analysis */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl text-gray-900">Your Travel Preferences</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Based on your browsing history and preferences, our AI has identified what matters most to you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preferences.map((pref) => {
              const Icon = pref.icon;
              return (
                <div key={pref.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">{pref.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{pref.value}%</span>
                  </div>
                  <Progress value={pref.value} className="h-2" />
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => onNavigate('preferences')}>
              Adjust Your Preferences
            </Button>
          </div>
        </Card>

        {/* Top Recommendations */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl text-gray-900">Perfect Matches</h2>
              <p className="text-gray-600">90%+ AI compatibility score</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRecommendations.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={(id) => onNavigate('hotel-details', { hotelId: id })}
                isFavorite={favorites.includes(hotel.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* Good Matches */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-pink-600" />
            <div>
              <h2 className="text-3xl text-gray-900">Great Options</h2>
              <p className="text-gray-600">85-89% AI compatibility score</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goodMatches.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={(id) => onNavigate('hotel-details', { hotelId: id })}
                isFavorite={favorites.includes(hotel.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* Other Options */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl text-gray-900">More Options</h2>
              <p className="text-gray-600">Other hotels you might like</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('search')}>
              View All Hotels
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherOptions.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={(id) => onNavigate('hotel-details', { hotelId: id })}
                isFavorite={favorites.includes(hotel.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* AI Tips */}
        <Card className="p-6 mt-12 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">AI Tip</h3>
              <p className="text-gray-700 mb-4">
                The more you interact with hotels and update your preferences, the better our AI recommendations become. 
                Like hotels to help us understand your taste better!
              </p>
              <div className="flex gap-3">
                <Button onClick={() => onNavigate('preferences')}>
                  Update Preferences
                </Button>
                <Button variant="outline" onClick={() => onNavigate('favorites')}>
                  View Favorites
                </Button>
              </div>
            </div>
          </div>
        </Card>
          </>
        )}
      </div>
    </div>
  );
}
