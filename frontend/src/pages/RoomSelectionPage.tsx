import { useState } from 'react';
import { ChevronLeft, Users, Maximize, Bed, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockHotels } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RoomSelectionPageProps {
  hotelId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function RoomSelectionPage({ hotelId, onNavigate }: RoomSelectionPageProps) {
  const hotel = mockHotels.find(h => h.id === hotelId);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

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

  const handleContinue = () => {
    if (selectedRoom) {
      onNavigate('booking-review', { hotelId, roomId: selectedRoom });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => onNavigate('hotel-details', { hotelId })} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Hotel Details
          </Button>
          <div>
            <h1 className="text-3xl text-gray-900">{hotel.name}</h1>
            <p className="text-gray-600">Select your room</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {hotel.rooms.map((room) => (
            <Card key={room.id} className={`p-6 ${selectedRoom === room.id ? 'ring-2 ring-blue-600' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-4">
                    <h3 className="text-2xl text-gray-900 mb-1">{room.name}</h3>
                    <Badge variant="secondary">{room.type}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{room.capacity} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Maximize className="w-5 h-5" />
                      <span>{room.size} m²</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="w-5 h-5" />
                      <span>{room.beds}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm text-gray-700 mb-2">Room Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-1 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-600" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {room.available} rooms available at this price
                  </p>
                </div>

                <div className="md:col-span-1 flex flex-col justify-between">
                  <div>
                    <div className="text-right mb-2">
                      <div className="text-3xl text-gray-900">${room.price}</div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                    <div className="text-right text-sm text-gray-600 mb-4">
                      ${room.price * 3} total (3 nights)
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedRoom(room.id)}
                    variant={selectedRoom === room.id ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {selectedRoom === room.id ? 'Selected' : 'Select Room'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedRoom && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Room selected</p>
                <p className="text-lg text-gray-900">
                  {hotel.rooms.find(r => r.id === selectedRoom)?.name}
                </p>
              </div>
              <Button onClick={handleContinue} size="lg">
                Continue to Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
