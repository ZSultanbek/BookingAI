import { Hotel, Destination } from '../types';

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Luxe Palace',
    location: 'Downtown Paris',
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1723465308831-29da05e011f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjY4NTA3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviews: 1243,
    price: 350,
    description: 'Experience Parisian luxury at its finest with breathtaking views of the Eiffel Tower. Our hotel combines classic elegance with modern amenities.',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Parking', 'Bar'],
    aiScore: 95,
    aiReason: 'Perfect match based on your preference for luxury hotels in European capitals',
    images: [
      'https://images.unsplash.com/photo-1723465308831-29da05e011f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjY4NTA3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1654355628827-860147b38be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MjY2MzcwNXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    rooms: [
      {
        id: 'r1',
        name: 'Deluxe King Room',
        type: 'Deluxe',
        price: 350,
        capacity: 2,
        size: 35,
        beds: '1 King Bed',
        amenities: ['City View', 'Free WiFi', 'Mini Bar', 'Coffee Maker'],
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        available: 3
      },
      {
        id: 'r2',
        name: 'Executive Suite',
        type: 'Suite',
        price: 550,
        capacity: 4,
        size: 65,
        beds: '1 King Bed + Sofa Bed',
        amenities: ['City View', 'Free WiFi', 'Mini Bar', 'Coffee Maker', 'Living Room', 'Balcony'],
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        available: 2
      }
    ]
  },
  {
    id: '2',
    name: 'Oceanfront Resort & Spa',
    location: 'Beachfront',
    city: 'Maldives',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMHRyb3BpY2FsfGVufDF8fHx8MTc2MjY5NjE5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviews: 856,
    price: 450,
    description: 'Paradise awaits at our exclusive beachfront resort. Enjoy pristine beaches, crystal-clear waters, and world-class amenities.',
    amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Water Sports', 'Restaurant', 'Bar', 'Diving Center'],
    aiScore: 92,
    aiReason: 'Highly recommended for beach lovers seeking a tropical escape',
    images: [
      'https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMHRyb3BpY2FsfGVufDF8fHx8MTc2MjY5NjE5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1729717949948-56b52db111dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzYyNjgxMzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    rooms: [
      {
        id: 'r3',
        name: 'Beach Villa',
        type: 'Villa',
        price: 450,
        capacity: 2,
        size: 45,
        beds: '1 King Bed',
        amenities: ['Ocean View', 'Private Pool', 'Direct Beach Access', 'Outdoor Shower'],
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        available: 5
      }
    ]
  },
  {
    id: '3',
    name: 'Tokyo Skyline Hotel',
    location: 'Shibuya District',
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1713635632551-e633ee4cb95e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NjI2ODkwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviews: 2100,
    price: 280,
    description: 'Modern hotel in the heart of Tokyo with stunning city views. Perfect location for exploring the vibrant Shibuya district.',
    amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Gym', 'Business Center', 'Rooftop Terrace'],
    aiScore: 88,
    aiReason: 'Great choice for city explorers interested in Japanese culture',
    images: [
      'https://images.unsplash.com/photo-1713635632551-e633ee4cb95e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NjI2ODkwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    rooms: [
      {
        id: 'r4',
        name: 'City View Room',
        type: 'Standard',
        price: 280,
        capacity: 2,
        size: 28,
        beds: '2 Twin Beds',
        amenities: ['City View', 'Free WiFi', 'Tea Set', 'Smart TV'],
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        available: 8
      }
    ]
  },
  {
    id: '4',
    name: 'Manhattan Heights',
    location: 'Midtown Manhattan',
    city: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eXxlbnwxfHx8fDE3NjI2MTk5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviews: 1876,
    price: 320,
    description: 'Premium hotel in the heart of Manhattan. Walking distance to Times Square, Broadway theaters, and Fifth Avenue shopping.',
    amenities: ['Free WiFi', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Valet Parking'],
    aiScore: 90,
    aiReason: 'Ideal for your upcoming business trip with easy access to major venues',
    images: [
      'https://images.unsplash.com/photo-1543716091-a840c05249ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eXxlbnwxfHx8fDE3NjI2MTk5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    rooms: [
      {
        id: 'r5',
        name: 'Premium King',
        type: 'Premium',
        price: 320,
        capacity: 2,
        size: 32,
        beds: '1 King Bed',
        amenities: ['City View', 'Free WiFi', 'Work Desk', 'Coffee Maker'],
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        available: 6
      }
    ]
  },
  {
    id: '5',
    name: 'Dubai Marina Towers',
    location: 'Dubai Marina',
    city: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviews: 1432,
    price: 400,
    description: 'Luxury hotel with panoramic views of Dubai Marina. Features world-class dining and entertainment options.',
    amenities: ['Infinity Pool', 'Spa', 'Multiple Restaurants', 'Beach Club', 'Gym', 'Kids Club'],
    aiScore: 87,
    aiReason: 'Matches your interest in luxury destinations with family-friendly amenities',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    rooms: [
      {
        id: 'r6',
        name: 'Marina View Suite',
        type: 'Suite',
        price: 400,
        capacity: 3,
        size: 55,
        beds: '1 King Bed + 1 Twin',
        amenities: ['Marina View', 'Free WiFi', 'Kitchenette', 'Balcony'],
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        available: 4
      }
    ]
  },
  {
    id: '6',
    name: 'Alpine Retreat',
    location: 'Swiss Alps',
    city: 'Zermatt',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1563793511175-7b125dff72ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhvdGVsJTIwdmlld3xlbnwxfHx8fDE3NjI2OTYxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviews: 678,
    price: 480,
    description: 'Mountain resort with breathtaking views of the Matterhorn. Perfect for skiing in winter and hiking in summer.',
    amenities: ['Ski-in/Ski-out', 'Spa', 'Restaurant', 'Bar', 'Ski Storage', 'Heated Pool'],
    aiScore: 91,
    aiReason: 'Perfect for adventure travelers who love mountain activities',
    images: [
      'https://images.unsplash.com/photo-1563793511175-7b125dff72ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhvdGVsJTIwdmlld3xlbnwxfHx8fDE3NjI2OTYxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    rooms: [
      {
        id: 'r7',
        name: 'Mountain View Chalet',
        type: 'Chalet',
        price: 480,
        capacity: 4,
        size: 70,
        beds: '2 Bedrooms',
        amenities: ['Mountain View', 'Fireplace', 'Kitchen', 'Balcony'],
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyNjE3Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        available: 2
      }
    ]
  }
];

export const mockDestinations: Destination[] = [
  {
    id: 'd1',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1757849761602-6675d53c3da5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGNpdHklMjB2aWV3fGVufDF8fHx8MTc2MjY5NjE5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The City of Light offers romance, art, and world-class cuisine',
    hotels: 1250,
    avgPrice: 280,
    popularSeason: 'Spring & Fall'
  },
  {
    id: 'd2',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1713635632551-e633ee4cb95e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NjI2ODkwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A perfect blend of ancient tradition and cutting-edge technology',
    hotels: 980,
    avgPrice: 220,
    popularSeason: 'Spring (Cherry Blossom)'
  },
  {
    id: 'd3',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eXxlbnwxfHx8fDE3NjI2MTk5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The city that never sleeps with endless entertainment and culture',
    hotels: 1500,
    avgPrice: 300,
    popularSeason: 'Fall & Winter'
  },
  {
    id: 'd4',
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Modern luxury meets Arabian hospitality in this desert oasis',
    hotels: 650,
    avgPrice: 350,
    popularSeason: 'Winter'
  },
  {
    id: 'd5',
    name: 'Maldives',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMHRyb3BpY2FsfGVufDF8fHx8MTc2MjY5NjE5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Tropical paradise with pristine beaches and luxury resorts',
    hotels: 180,
    avgPrice: 500,
    popularSeason: 'Year-round'
  },
  {
    id: 'd6',
    name: 'Zermatt',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1563793511175-7b125dff72ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhvdGVsJTIwdmlld3xlbnwxfHx8fDE3NjI2OTYxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Alpine wonderland with world-class skiing and mountain views',
    hotels: 120,
    avgPrice: 420,
    popularSeason: 'Winter & Summer'
  }
];
