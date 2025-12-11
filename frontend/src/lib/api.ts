/**
 * API client for backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
// #region agent log
fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:6',message:'API_BASE_URL initialized',data:{apiBaseUrl:API_BASE_URL,hasEnvVar:!!import.meta.env.VITE_API_BASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'type-fix-verify',hypothesisId:'C'})}).catch(()=>{});
// #endregion

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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:32',message:'Health check attempt',data:{apiBaseUrl:API_BASE_URL,endpoint:'/api/health/'},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const response = await fetch(`${API_BASE_URL}/api/health/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:42',message:'Health check response received',data:{status:response.status,ok:response.ok,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:46',message:'Health check failed - non-ok response',data:{status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HealthCheckResponse = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:52',message:'Health check success',data:{responseData:data},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return data;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:56',message:'Health check error caught',data:{errorMessage:error instanceof Error?error.message:'Unknown error',errorType:error?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (error instanceof Error) {
      throw new Error(`Backend health check failed: ${error.message}`);
    }
    throw new Error('Backend health check failed: Unknown error');
  }
}

/**
 * Call Gemini API through backend proxy
 */
export async function callGemini(prompt: string): Promise<string> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:60',message:'Gemini API call attempt',data:{apiBaseUrl:API_BASE_URL,endpoint:'/api/gemini/generate/',promptLength:prompt.length},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  try {
    const response = await fetch(`${API_BASE_URL}/api/gemini/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48b74e12-84e1-4b75-8fdf-2ec0e11f11dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:70',message:'Gemini API response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    // Extract text from Gemini response
    if (data.candidates && data.candidates.length > 0) {
      const textParts = data.candidates[0].content.parts
        .map(part => part.text)
        .join('');
      return textParts;
    }

    if (data.error) {
      throw new Error(data.error.message || 'Gemini API error');
    }

    throw new Error('Unexpected response format from Gemini');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to call Gemini API');
  }
}


