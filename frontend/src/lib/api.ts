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
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/accounts/api/preferences/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ preferences: JSON.stringify(preferences) }),
  });

  if (!response.ok) {
    throw new Error("Failed to save preferences");
  }
}
