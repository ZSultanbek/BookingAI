import json
import os

import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


@login_required(login_url="accounts/login/")
def home_view(request):
    return render(request, "api/home.html", {"user": request.user})


@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint to verify backend is running and accessible."""
    # #region agent log
    import json as json_module
    try:
        with open('/Users/uakks/Documents/KBTU/5th sem/BIS/BookingAI/.cursor/debug.log', 'a') as f:
            f.write(json_module.dumps({"location":"views.py:25","message":"Health check request received","data":{"method":request.method,"path":request.path,"remoteAddr":request.META.get("REMOTE_ADDR","")},"timestamp":int(__import__("time").time()*1000),"sessionId":"debug-session","runId":"connection-test","hypothesisId":"A"})+"\n")
    except: pass
    # #endregion
    return JsonResponse({
        "status": "ok",
        "message": "Backend is running",
        "service": "BookingAI API"
    })


@csrf_exempt  # Simplifies cross-origin fetch from the frontend; add CSRF token if you can
@require_POST
def gemini_generate(request):
    """Proxy Gemini generation through the backend to keep the API key private."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return JsonResponse({"error": "GEMINI_API_KEY is not set"}, status=500)

    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    prompt = (body.get("prompt") or "").strip()
    if not prompt:
        return JsonResponse({"error": "prompt is required"}, status=400)

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        resp = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            json=payload,
            timeout=15,
        )
    except requests.RequestException as exc:
        return JsonResponse({"error": f"Upstream request failed: {exc}"}, status=502)

    # Pass through status and body for transparency
    try:
        data = resp.json()
    except ValueError:
        return JsonResponse({"error": "Invalid JSON from Gemini", "raw": resp.text}, status=502)

    return JsonResponse(data, status=resp.status_code)