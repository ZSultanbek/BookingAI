import React from 'react';
import { useState } from 'react';
import { Star, MapPin, Heart, Share2, Wifi, Utensils, Dumbbell, Car, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { mockHotels } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HotelDetailsPageProps {
  hotelId: string;
  onNavigate: (page: string, data?: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function HotelDetailsPage({ hotelId, onNavigate, favorites, onToggleFavorite }: HotelDetailsPageProps) {
  const hotel = mockHotels.find(h => h.id === hotelId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-2">Hotel not found</h2>
          <Button onClick={() => onNavigate('home')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(hotel.id);
  const amenityIcons: Record<string, any> = {
    'Free WiFi': Wifi,
    'Restaurant': Utensils,
    'Gym': Dumbbell,
    'Parking': Car,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => onNavigate('search')} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <ImageWithFallback
                src={hotel.images[selectedImage] || hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
            {hotel.images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className={`relative h-28 rounded-lg overflow-hidden cursor-pointer ${
                  selectedImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${hotel.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hotel Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl text-gray-900 mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{hotel.location}, {hotel.city}, {hotel.country}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onToggleFavorite(hotel.id)}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900">{hotel.rating}</span>
                  <span className="text-gray-500">({hotel.reviews} reviews)</span>
                </div>
                {hotel.aiScore >= 85 && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Recommended
                  </Badge>
                )}
              </div>

              {hotel.aiScore >= 85 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1">AI Match Score: {hotel.aiScore}%</h3>
                      <p className="text-gray-700">{hotel.aiReason}</p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-gray-700 mb-6">{hotel.description}</p>

              <Tabs defaultValue="amenities">
                <TabsList>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="amenities" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-900">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-gray-900">John Doe</span>
                          <span className="text-gray-500 text-sm">• 2 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          Amazing stay! The hotel exceeded all expectations. Staff was incredibly friendly and helpful.
                        </p>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-6">
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-600">Map view would be displayed here</p>
                  </div>
                  <p className="text-gray-700 mt-4">{hotel.location}, {hotel.city}, {hotel.country}</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl text-gray-900">${hotel.price}</span>
                  <span className="text-gray-600">/night</span>
                </div>
                <p className="text-sm text-gray-600">Excluding taxes and fees</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Guests</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <Button
                onClick={() => onNavigate('room-selection', { hotelId: hotel.id })}
                className="w-full h-12 mb-4"
              >
                Select Room
              </Button>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>3 nights × ${hotel.price}</span>
                  <span>${hotel.price * 3}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${Math.round(hotel.price * 0.1)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-gray-900">
                  <span>Total</span>
                  <span>${hotel.price * 3 + Math.round(hotel.price * 0.1)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
