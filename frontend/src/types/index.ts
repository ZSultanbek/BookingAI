export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  description: string;
  amenities: string[];
  aiScore: number;
  aiReason: string;
  rooms: Room[];
  images: string[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  size: number;
  beds: string;
  amenities: string[];
  image: string;
  available: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  hotels: number;
  avgPrice: number;
  popularSeason: string;
}

export interface UserPreferences {
  priceRange: [number, number];
  amenities: string[];
  roomType: string[];
  travelPurpose: string;
  preferredLocations: string[];
}

export interface BookingDetails {
  hotelId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
}
