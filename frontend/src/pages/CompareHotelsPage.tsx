import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, MapPin, Check, X, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getProperties } from '../lib/api';
import { Hotel } from '../types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface CompareHotelsPageProps {
  onNavigate: (page: string, data?: any) => void;
  favorites: string[];
}

export function CompareHotelsPage({ onNavigate, favorites }: CompareHotelsPageProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const favoriteHotels = hotels.filter(hotel => favorites.includes(hotel.id));
  const [selectedHotels, setSelectedHotels] = useState<string[]>(
    favoriteHotels.slice(0, 3).map(h => h.id)
  );

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

  // Update selected hotels when favoriteHotels changes
  useEffect(() => {
    if (favoriteHotels.length > 0 && selectedHotels.length === 0) {
      setSelectedHotels(favoriteHotels.slice(0, 3).map(h => h.id));
    }
  }, [favoriteHotels.length]);

  const hotelsToCompare = selectedHotels
    .map(id => hotels.find(h => h.id === id))
    .filter((h): h is Hotel => h !== undefined);

  const allAmenities = Array.from(
    new Set(hotelsToCompare.flatMap(hotel => hotel.amenities))
  );

  const handleHotelChange = (index: number, hotelId: string) => {
    const newSelection = [...selectedHotels];
    newSelection[index] = hotelId;
    setSelectedHotels(newSelection);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => onNavigate('favorites')} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Favorites
          </Button>
          <h1 className="text-3xl text-gray-900">Compare Hotels</h1>
          <p className="text-gray-600">Side-by-side comparison to help you decide</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      ) : (

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((index) => (
            <Card key={index} className="p-4">
              <label className="block text-sm text-gray-700 mb-2">Hotel {index + 1}</label>
              <Select 
                value={selectedHotels[index] || ''} 
                onValueChange={(value) => handleHotelChange(index, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        {hotelsToCompare.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            {/* Hotel Images & Basic Info */}
            <div className="grid grid-cols-3 border-b border-gray-200">
              {hotelsToCompare.map((hotel) => (
                <div key={hotel.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <ImageWithFallback
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    {hotel.aiScore >= 85 && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs">AI Pick</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{hotel.city}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-900">{hotel.rating}</span>
                    <span className="text-sm text-gray-500">({hotel.reviews})</span>
                  </div>
                  <Button
                    onClick={() => onNavigate('hotel-details', { hotelId: hotel.id })}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            {/* AI Score */}
            {hotelsToCompare.some(h => h.aiScore >= 85) && (
              <div className="grid grid-cols-3">
                <div className="p-6 bg-gray-50 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900">AI Match Score</span>
                  </div>
                </div>
                {hotelsToCompare.map((hotel) => (
                  <div key={hotel.id} className="p-6 border-r border-gray-200 last:border-r-0">
                    <div className="text-2xl text-gray-900 mb-1">{hotel.aiScore}%</div>
                    <p className="text-sm text-gray-600">{hotel.aiReason}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="grid grid-cols-3 border-t border-gray-200">
              <div className="p-6 bg-gray-50 border-r border-gray-200">
                <span className="text-gray-900">Price per Night</span>
              </div>
              {hotelsToCompare.map((hotel) => (
                <div key={hotel.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="text-2xl text-gray-900">${hotel.price}</div>
                </div>
              ))}
            </div>

            {/* Amenities Comparison */}
            <div className="border-t border-gray-200">
              <div className="p-6 bg-gray-50">
                <span className="text-lg text-gray-900">Amenities</span>
              </div>
              {allAmenities.map((amenity) => (
                <div key={amenity} className="grid grid-cols-3 border-t border-gray-200">
                  <div className="p-4 bg-gray-50 border-r border-gray-200">
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                  {hotelsToCompare.map((hotel) => (
                    <div key={hotel.id} className="p-4 border-r border-gray-200 last:border-r-0 flex items-center justify-center">
                      {hotel.amenities.includes(amenity) ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="grid grid-cols-3 border-t border-gray-200">
              <div className="p-6 bg-gray-50 border-r border-gray-200">
                <span className="text-gray-900">Guest Reviews</span>
              </div>
              {hotelsToCompare.map((hotel) => (
                <div key={hotel.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl text-gray-900">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">{hotel.reviews.toLocaleString()} reviews</span>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="grid grid-cols-3 border-t border-gray-200">
              <div className="p-6 bg-gray-50 border-r border-gray-200">
                <span className="text-gray-900">Location</span>
              </div>
              {hotelsToCompare.map((hotel) => (
                <div key={hotel.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="text-gray-900 mb-1">{hotel.location}</div>
                  <div className="text-sm text-gray-600">{hotel.city}, {hotel.country}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendation */}
        {hotelsToCompare.length > 0 && (
          <Card className="p-6 mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-gray-900 mb-2">AI Recommendation</h3>
                <p className="text-gray-700 mb-4">
                  Based on your preferences, we recommend <span className="font-medium">{hotelsToCompare[0].name}</span>. 
                  It has the highest AI match score ({hotelsToCompare[0].aiScore}%) and offers the best combination of 
                  amenities that align with your travel style.
                </p>
                <Button onClick={() => onNavigate('hotel-details', { hotelId: hotelsToCompare[0].id })}>
                  Book {hotelsToCompare[0].name}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}
