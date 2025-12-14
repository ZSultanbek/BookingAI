/**
 * API client for backend communication (Gemini only)
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  service: string;
}

/**
 * Check if backend is accessible
 */
export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Call Gemini API through backend proxy
 */
export async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/gemini/generate/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP error ${response.status}`);
  }

  const data: GeminiResponse = await response.json();

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .join("") ?? "";

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return text;
}
