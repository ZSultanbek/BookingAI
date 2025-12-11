import React from 'react';
import { ChevronLeft, Calendar, Users, CreditCard, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { mockHotels } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface BookingReviewPageProps {
  hotelId: string;
  roomId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function BookingReviewPage({ hotelId, roomId, onNavigate }: BookingReviewPageProps) {
  const hotel = mockHotels.find(h => h.id === hotelId);
  const room = hotel?.rooms.find(r => r.id === roomId);

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-2">Booking details not found</h2>
          <Button onClick={() => onNavigate('home')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  const handleConfirmBooking = () => {
    onNavigate('booking-confirmation', { hotelId, roomId });
  };

  const nights = 3;
  const roomTotal = room.price * nights;
  const serviceFee = Math.round(room.price * 0.1 * nights);
  const taxes = Math.round(roomTotal * 0.12);
  const total = roomTotal + serviceFee + taxes;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => onNavigate('room-selection', { hotelId })} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Room Selection
          </Button>
          <h1 className="text-3xl text-gray-900">Review Your Booking</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-4">Booking Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="text-gray-900">Nov 15, 2025</p>
                    <p className="text-sm text-gray-600">After 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="text-gray-900">Nov 18, 2025</p>
                    <p className="text-sm text-gray-600">Before 11:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="text-gray-900">2 adults</p>
                </div>
              </div>
            </Card>

            {/* Guest Information */}
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-4">Guest Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>

                <div>
                  <Label htmlFor="special">Special Requests (Optional)</Label>
                  <textarea
                    id="special"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    rows={3}
                    placeholder="Any special requirements or requests..."
                  />
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <h2 className="text-2xl text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input id="cardName" placeholder="John Doe" />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900">Secure Payment</p>
                  <p className="text-sm text-green-700">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="mb-4">
                <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                  <ImageWithFallback
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg text-gray-900">{hotel.name}</h3>
                <p className="text-sm text-gray-600">{hotel.location}, {hotel.city}</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room Type</span>
                  <span className="text-gray-900">{room.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dates</span>
                  <span className="text-gray-900">Nov 15-18, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Guests</span>
                  <span className="text-gray-900">2 adults</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">${room.price} × {nights} nights</span>
                  <span className="text-gray-900">${roomTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">${serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">${taxes}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <span className="text-lg text-gray-900">Total</span>
                <span className="text-2xl text-gray-900">${total}</span>
              </div>

              <Button onClick={handleConfirmBooking} className="w-full h-12">
                Confirm Booking
              </Button>

              <p className="text-xs text-gray-600 text-center mt-4">
                By confirming, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
