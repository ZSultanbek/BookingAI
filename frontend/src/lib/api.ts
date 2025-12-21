import { Hotel } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/* =========================
   Types
========================= */

export interface HealthCheckResponse {
  status: string;
  message: string;
  service: string;
}

export interface AIChatRequest {
  message: string;
  preferences: Record<string, any>;
  hotels: any[];
}

export interface AISortRoomsRequest {
  preferences: Record<string, any>;
  rooms: any[];
}

export interface PropertyReview {
  review_id: number;
  rating: number;
  comment: string | null;
  ai_accuracy_feedback: string | null;
  created_at: string;
  booking_id: number;
  room_id: number;
  guest_email: string | null;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: "guest" | "host" | "admin";
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

export interface MeResponse {
  authenticated: boolean;
  user?: User;
  preferences?: Record<string, any>;
  travel_reason?: string;
  bio?: string;
}

/* =========================
   Health check
========================= */

export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health/`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.json();
}

/* =========================
   AI Chat
========================= */

export async function aiChat(payload: AIChatRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  return data.response ?? "";
}

/* =========================
   AI Sort Rooms
========================= */

export async function aiSortRooms(
  payload: AISortRoomsRequest
): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/sort-rooms/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.sorted_room_ids;
}

/* =========================
   Properties
========================= */

export async function getProperties(): Promise<Hotel[]> {
  const response = await fetch(`${API_BASE_URL}/api/properties/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status}`);
  }
  const data = await response.json();
  return data.properties;
}

export async function getProperty(propertyId: string): Promise<Hotel> {
  const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.status}`);
  }
  return response.json();
}

export async function getPropertyReviews(
  propertyId: string
): Promise<PropertyReview[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/properties/${propertyId}/reviews/`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status}`);
  }
  const data = await response.json();
  return data.reviews;
}

/* =========================
   Authentication
========================= */

export async function register(
  email: string,
  name: string,
  password: string,
  role: "guest" | "host" = "guest"
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/accounts/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include cookies for session
    body: JSON.stringify({ email, name, password, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/accounts/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/accounts/api/logout/`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

export async function getCurrentUser(): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/accounts/api/me/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return response.json();
}

/* =========================
   Preferences
========================= */

export async function savePreferences(
  preferences: Record<string, any>
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/accounts/api/preferences/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ preferences: preferences }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to save preferences");
  }

  return response.json();
}

/* =========================
   Profile
========================= */

export interface UpdateProfileData {
  name?: string;
  email?: string;
  bio?: string;
}

export async function updateProfile(
  profileData: UpdateProfileData
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/accounts/api/profile/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to update profile");
  }

  return response.json();
}

/* =========================
   Host Property Management
========================= */

export interface HostProperty {
  id: number;
  name: string;
  location: string;
  description: string;
  amenities: string[];
  price_per_night: number;
  ai_verified_score: string;
  rooms: HostRoom[];
}

export interface HostRoom {
  id: number;
  title: string;
  price_per_night: number;
  availability_status: "available" | "booked" | "unavailable";
  photos_url: string;
}

export interface CreatePropertyData {
  name: string;
  location: string;
  description: string;
  price_per_night: number;
  amenities: string[];
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {}

export interface CreateRoomData {
  title: string;
  price_per_night: number;
  availability_status?: "available" | "booked" | "unavailable";
  photos_url?: string;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {}

export async function getHostProperties(): Promise<HostProperty[]> {
  const response = await fetch(`${API_BASE_URL}/api/host/properties/`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to fetch properties");
  }

  const data = await response.json();
  return data.properties;
}

export async function createProperty(
  propertyData: CreatePropertyData
): Promise<HostProperty> {
  const response = await fetch(`${API_BASE_URL}/api/host/properties/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to create property");
  }

  const data = await response.json();
  return data.property;
}

export async function updateProperty(
  propertyId: number,
  propertyData: UpdatePropertyData
): Promise<HostProperty> {
  const response = await fetch(
    `${API_BASE_URL}/api/host/properties/${propertyId}/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(propertyData),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to update property");
  }

  const data = await response.json();
  return data.property;
}

export async function deleteProperty(propertyId: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/host/properties/${propertyId}/`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to delete property");
  }
}

export async function createRoom(
  propertyId: number,
  roomData: CreateRoomData
): Promise<HostRoom> {
  const response = await fetch(
    `${API_BASE_URL}/api/host/properties/${propertyId}/rooms/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(roomData),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to create room");
  }

  const data = await response.json();
  return data.room;
}

export async function updateRoom(
  propertyId: number,
  roomId: number,
  roomData: UpdateRoomData
): Promise<HostRoom> {
  const response = await fetch(
    `${API_BASE_URL}/api/host/properties/${propertyId}/rooms/${roomId}/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(roomData),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to update room");
  }

  const data = await response.json();
  return data.room;
}

export async function deleteRoom(
  propertyId: number,
  roomId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/host/properties/${propertyId}/rooms/${roomId}/`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to delete room");
  }
}

/* =========================
   Favourites
========================= */

export interface FavouriteProperty {
  favourite_id: number;
  property_id: number;
  name: string;
  location: string;
  description: string;
  amenities: string;
  price_per_night: number;
  ai_verified_score: string;
  added_at: string;
}

export async function getFavourites(): Promise<FavouriteProperty[]> {
  const response = await fetch(`${API_BASE_URL}/api/guest/favourites/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch favourites: ${response.status}`);
  }

  const data = await response.json();
  return data.favourites;
}

export async function addToFavourites(
  propertyId: number
): Promise<{ favourite_id: number; added_at: string }> {
  const response = await fetch(`${API_BASE_URL}/api/guest/favourites/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ property_id: propertyId }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to add to favourites");
  }

  return response.json();
}

export async function removeFromFavourites(favouriteId: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/guest/favourites/${favouriteId}/`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to remove from favourites");
  }
}

/* =========================
   Bookings and Reviews
========================= */

export interface Booking {
  booking_id: number;
  room: {
    room_id: number;
    title: string;
    price_per_night: number;
  };
  property: {
    property_id: number;
    name: string;
    location: string;
  };
  check_in: string;
  check_out: string;
  total_cost: number;
  status: string;
  created_at: string;
  has_review: boolean;
}

export interface Review {
  review_id: number;
  booking_id?: number;
  rating: number;
  comment: string;
  ai_accuracy_feedback: string;
  created_at: string;
}

export async function createBooking(
  roomId: number,
  checkIn: string,
  checkOut: string
): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/api/guest/bookings/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      room_id: roomId,
      check_in: checkIn,
      check_out: checkOut,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to create booking");
  }

  const data = await response.json();
  return data.booking;
}

export async function getGuestBookings(): Promise<Booking[]> {
  const response = await fetch(`${API_BASE_URL}/api/guest/bookings/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bookings: ${response.status}`);
  }

  const data = await response.json();
  return data.bookings;
}

export async function createReview(
  bookingId: number,
  rating: number,
  comment: string,
  aiAccuracyFeedback?: string
): Promise<Review> {
  const response = await fetch(
    `${API_BASE_URL}/api/guest/bookings/${bookingId}/review/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        rating,
        comment,
        ai_accuracy_feedback: aiAccuracyFeedback || "",
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to create review");
  }

  const data = await response.json();
  return data.review;
}

export async function updateReview(
  reviewId: number,
  rating: number,
  comment: string,
  aiAccuracyFeedback?: string
): Promise<Review> {
  const response = await fetch(
    `${API_BASE_URL}/api/guest/reviews/${reviewId}/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        rating,
        comment,
        ai_accuracy_feedback: aiAccuracyFeedback || "",
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to update review");
  }

  const data = await response.json();
  return data.review;
}

export async function deleteReview(reviewId: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/guest/reviews/${reviewId}/`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to delete review");
  }
}
