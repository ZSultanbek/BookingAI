import json
import os

import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.db.models import Prefetch

from api import models as m

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

@csrf_exempt  
def call_gemini(prompt: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    response = requests.post(
        f"{GEMINI_API_URL}?key={api_key}",
        json=payload,
        timeout=30
    )
    if response.status_code == 429:
        return JsonResponse(
            {
                "error": "AI rate limit exceeded. Please wait a moment and try again."
            },
            status=429
        )
    if response.status_code != 200:
        return JsonResponse(
            {"error": "Gemini API error", "details": response.text},
            status=response.status_code
        )

    response.raise_for_status()  # raises if 4xx / 5xx

    return response.json()


@csrf_exempt  
@require_POST
def ai_chat(request):
    """
    Conversational AI:
    - Recommends hotels
    - Explains reasoning
    - Uses preferences + user message
    """

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    message = body.get("message", "").strip()
    preferences = body.get("preferences", {})
    hotels = body.get("hotels", [])

    if not message:
        return JsonResponse({"error": "message is required"}, status=400)

    if not hotels:
        return JsonResponse({"error": "hotels list is required"}, status=400)

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


@csrf_exempt
@require_http_methods(["GET"])
def property_reviews(request, property_id: int):
    """Return all reviews for a given property id, optimized for fast fetch."""
    # #region agent log
    import json as json_module
    try:
        with open('/Users/uakks/Documents/KBTU/5th sem/BIS/BookingAI/.cursor/debug.log', 'a') as f:
            f.write(json_module.dumps({
                "location": "views.py:84",
                "message": "property_reviews called",
                "data": {"property_id": property_id},
                "timestamp": int(__import__("time").time() * 1000),
                "sessionId": "debug-session",
                "runId": "reviews-fetch",
                "hypothesisId": "H1"
            }) + "\n")
    except Exception:
        pass
    # #endregion

    try:
        property_obj = m.Property.objects.get(pk=property_id)
    except m.Property.DoesNotExist:
        return JsonResponse({"error": "Property not found"}, status=404)

    reviews_qs = (
        m.Review.objects
        .filter(booking__room__property_id=property_id)
        .select_related("booking", "booking__room", "booking__guest__user")
        .order_by("-created_at")
    )

    reviews = []
    for rev in reviews_qs:
        reviews.append({
            "review_id": rev.review_id,
            "rating": rev.rating,
            "comment": rev.comment,
            "ai_accuracy_feedback": rev.ai_accuracy_feedback,
            "created_at": rev.created_at.isoformat(),
            "booking_id": rev.booking_id,
            "room_id": rev.booking.room_id,
            "guest_email": getattr(rev.booking.guest.user, "email", None),
        })

    # #region agent log
    try:
        with open('/Users/uakks/Documents/KBTU/5th sem/BIS/BookingAI/.cursor/debug.log', 'a') as f:
            f.write(json_module.dumps({
                "location": "views.py:118",
                "message": "property_reviews returning",
                "data": {"property_id": property_id, "count": len(reviews)},
                "timestamp": int(__import__("time").time() * 1000),
                "sessionId": "debug-session",
                "runId": "reviews-fetch",
                "hypothesisId": "H1"
            }) + "\n")
    except Exception:
        pass
    # #endregion

    return JsonResponse({"property_id": property_obj.property_id, "reviews": reviews}, status=200)