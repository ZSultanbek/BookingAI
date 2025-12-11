import React from 'react';
import { CheckCircle, Calendar, MapPin, Mail, Phone, Download, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { mockHotels } from '../data/mockData';

interface BookingConfirmationPageProps {
  hotelId: string;
  roomId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function BookingConfirmationPage({ hotelId, roomId, onNavigate }: BookingConfirmationPageProps) {
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

  const bookingNumber = 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">Your reservation has been successfully completed</p>
        </div>

        <Card className="p-8 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-1">Booking Number</p>
            <p className="text-2xl text-gray-900">{bookingNumber}</p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div>
              <h2 className="text-xl text-gray-900 mb-2">{hotel.name}</h2>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span>{hotel.location}, {hotel.city}, {hotel.country}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-in</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-gray-900">November 15, 2025</p>
                    <p className="text-sm text-gray-600">After 3:00 PM</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-out</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-gray-900">November 18, 2025</p>
                    <p className="text-sm text-gray-600">Before 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm text-gray-600 mb-2">Room Details</p>
              <p className="text-gray-900">{room.name}</p>
              <p className="text-sm text-gray-600">{room.beds} • {room.capacity} guests</p>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm text-gray-600 mb-2">Total Amount Paid</p>
              <p className="text-2xl text-gray-900">${room.price * 3 + Math.round(room.price * 0.22 * 3)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-lg text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-gray-900">Confirmation Email Sent</p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to your registered email address with all booking details.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-gray-900">Contact the Hotel</p>
                <p className="text-sm text-gray-600">
                  You can contact the hotel directly for any special requests or questions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-gray-900">Download Your Receipt</p>
                <p className="text-sm text-gray-600">
                  A detailed receipt is available in your confirmation email.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => onNavigate('home')} variant="outline" className="flex-1">
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
          <Button onClick={() => onNavigate('hotel-details', { hotelId })} className="flex-1">
            View Hotel Details
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 text-center">
            Need help? Contact our 24/7 support at support@stayai.com or +1 (800) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
}
