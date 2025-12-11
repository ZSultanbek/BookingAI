import { Search, TrendingUp, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockDestinations } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface DestinationsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function DestinationsPage({ onNavigate }: DestinationsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl mb-4">Explore Destinations</h1>
          <p className="text-xl text-white/90 mb-8">
            Discover your next adventure with AI-powered destination recommendations
          </p>
          
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                className="pl-12 h-14 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Destinations */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-3xl text-gray-900">Trending Destinations</h2>
              <p className="text-gray-600">Most popular places this month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDestinations.map((destination) => (
              <Card
                key={destination.id}
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => onNavigate('search', { destination: destination.name })}
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                    <h3 className="text-2xl mb-2">{destination.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-gray-700 mb-4">{destination.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Avg. Price</span>
                      </div>
                      <p className="text-gray-900">${destination.avgPrice}/night</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Hotels</span>
                      </div>
                      <p className="text-gray-900">{destination.hotels.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Best time: {destination.popularSeason}</span>
                  </div>

                  <Button className="w-full">
                    Explore Hotels
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-3xl text-gray-900 mb-6">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Beach Destinations', count: 450, color: 'from-blue-500 to-cyan-500' },
              { name: 'City Breaks', count: 680, color: 'from-purple-500 to-pink-500' },
              { name: 'Mountain Retreats', count: 320, color: 'from-green-500 to-emerald-500' },
              { name: 'Cultural Hubs', count: 540, color: 'from-orange-500 to-red-500' },
            ].map((category) => (
              <Card
                key={category.name}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('search')}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl mb-4`} />
                <h3 className="text-xl text-gray-900 mb-1">{category.name}</h3>
                <p className="text-gray-600">{category.count} destinations</p>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Suggestion */}
        <Card className="p-8 mt-12 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl text-gray-900">Need Help Choosing?</h3>
              <p className="text-gray-600">Let our AI assistant suggest the perfect destination for you</p>
            </div>
          </div>
          <Button onClick={() => onNavigate('ai-chat')} size="lg">
            Chat with AI Assistant
          </Button>
        </Card>
      </div>
    </div>
  );
}
