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

export async function aiChat(
  payload: AIChatRequest
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/chat/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

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
  const response = await fetch(
    `${API_BASE_URL}/api/ai/sort-rooms/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.sorted_room_ids;
}
