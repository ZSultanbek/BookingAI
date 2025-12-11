import { Hotel } from '../types';
import { Star, MapPin, Heart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HotelCardProps {
  hotel: Hotel;
  onViewDetails: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function HotelCard({ hotel, onViewDetails, isFavorite, onToggleFavorite }: HotelCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
      <div className="relative h-64">
        <ImageWithFallback
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hotel.aiScore >= 85 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI Recommended</span>
          </div>
        )}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(hotel.id);
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        )}
        <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg shadow-md">
          <span className="text-gray-900">${hotel.price}</span>
          <span className="text-gray-500 text-sm">/night</span>
        </div>
      </div>
      
      <div className="p-5" onClick={() => onViewDetails(hotel.id)}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl text-gray-900">{hotel.name}</h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-900">{hotel.rating}</span>
            <span className="text-gray-500 text-sm">({hotel.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{hotel.location}, {hotel.city}</span>
        </div>

        {hotel.aiScore >= 85 && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-900">{hotel.aiReason}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{hotel.amenities.length - 4} more
            </Badge>
          )}
        </div>
        
        <Button onClick={() => onViewDetails(hotel.id)} className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}
