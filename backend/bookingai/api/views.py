import json
import os

import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.db.models import Prefetch, Avg

from api import models as m

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


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
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return JsonResponse({"error": "GEMINI_API_KEY is not set"}, status=500)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    message = body.get("message", "").strip()
    preferences = body.get("preferences", {})
    hotels = body.get("hotels", [])

    if not message:
        return JsonResponse({"error": "message is required"}, status=400)

    # Build prompt for Gemini
    hotels_str = "\n".join([f"- {h.get('name', 'Unknown')}: ${h.get('price', 0)}/night" for h in hotels[:10]])
    prompt = f"""You are a travel assistant helping users find hotels. 
User message: {message}
User preferences: {json.dumps(preferences)}

Available hotels:
{hotels_str}

Provide a helpful, concise response recommending hotels and answering the user's question."""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        resp = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        
        # Extract text from Gemini response
        text_content = ""
        if "candidates" in data and len(data["candidates"]) > 0:
            if "content" in data["candidates"][0]:
                if "parts" in data["candidates"][0]["content"]:
                    text_content = data["candidates"][0]["content"]["parts"][0].get("text", "")
        
        return JsonResponse({"response": text_content}, status=200)
    except requests.RequestException as exc:
        return JsonResponse({"error": f"Upstream request failed: {exc}"}, status=502)


@csrf_exempt
@require_POST
def ai_sort_rooms(request):
    """AI endpoint to sort rooms based on preferences."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return JsonResponse({"error": "GEMINI_API_KEY is not set"}, status=500)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    preferences = body.get("preferences", {})
    rooms = body.get("rooms", [])

    if not rooms:
        return JsonResponse({"sorted_room_ids": []}, status=200)

    # Build prompt for sorting
    rooms_str = "\n".join([f"ID: {r.get('id')}, Price: ${r.get('price', 0)}, Rating: {r.get('rating', 0)}, Amenities: {', '.join(r.get('amenities', []))}" for r in rooms])
    prompt = f"""Sort these hotel rooms by relevance to user preferences.
Preferences: {json.dumps(preferences)}

Rooms:
{rooms_str}

Return ONLY a JSON array of room IDs in order of best match first, like: ["id1", "id2", "id3"]"""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        resp = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        
        # Extract text from Gemini response
        text_content = ""
        if "candidates" in data and len(data["candidates"]) > 0:
            if "content" in data["candidates"][0]:
                if "parts" in data["candidates"][0]["content"]:
                    text_content = data["candidates"][0]["content"]["parts"][0].get("text", "")
        
        # Try to parse JSON array from response
        try:
            # Remove markdown code blocks if present
            text_content = text_content.strip()
            if text_content.startswith("```"):
                text_content = text_content.split("```")[1]
                if text_content.startswith("json"):
                    text_content = text_content[4:]
            text_content = text_content.strip()
            sorted_ids = json.loads(text_content)
            if isinstance(sorted_ids, list):
                return JsonResponse({"sorted_room_ids": sorted_ids}, status=200)
        except:
            pass
        
        # Fallback: return original order if parsing fails
        return JsonResponse({"sorted_room_ids": [r.get("id") for r in rooms]}, status=200)
    except requests.RequestException as exc:
        # Fallback: return original order on error
        return JsonResponse({"sorted_room_ids": [r.get("id") for r in rooms]}, status=200)


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


@csrf_exempt
@require_http_methods(["GET"])
def properties_list(request):
    """Return list of all properties (hotels)."""
    properties_qs = m.Property.objects.prefetch_related('rooms').all()
    
    properties = []
    for prop in properties_qs:
        # Parse amenities if stored as JSON or comma-separated
        amenities_list = []
        if prop.amenities:
            try:
                amenities_list = json.loads(prop.amenities)
            except:
                amenities_list = [a.strip() for a in prop.amenities.split(',') if a.strip()]
        
        # Calculate average rating from reviews
        reviews_qs = m.Review.objects.filter(booking__room__property=prop)
        avg_rating = reviews_qs.aggregate(Avg('rating'))['rating__avg'] or 0
        review_count = reviews_qs.count()
        
        # Get rooms for this property
        rooms = []
        for room in prop.rooms.all():
            rooms.append({
                "id": str(room.room_id),
                "name": room.title,
                "type": room.title.split()[0] if room.title else "Standard",
                "price": float(room.price_per_night),
                "capacity": 2,  # Default, can be added to model later
                "size": 30,  # Default, can be added to model later
                "beds": "1 King Bed",  # Default, can be added to model later
                "amenities": amenities_list[:4],  # Use property amenities
                "image": room.photos_url or "",
                "available": 1 if room.availability_status == "available" else 0
            })
        
        # Parse location to extract city/country if possible
        # Format: "location, city, country" or just "location"
        location_parts = prop.location.split(',')
        city = location_parts[1].strip() if len(location_parts) > 1 else ""
        country = location_parts[2].strip() if len(location_parts) > 2 else ""
        
        # Parse AI score if it's a number, otherwise default
        try:
            ai_score = float(prop.ai_verified_score) if prop.ai_verified_score and prop.ai_verified_score != "No evaluation yet" else 0
        except:
            ai_score = 0
        
        properties.append({
            "id": str(prop.property_id),
            "name": prop.name,
            "location": location_parts[0].strip(),
            "city": city,
            "country": country,
            "image": f"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",  # Default image
            "rating": round(avg_rating, 1),
            "reviews": review_count,
            "price": float(prop.price_per_night),
            "description": prop.description,
            "amenities": amenities_list,
            "aiScore": int(ai_score) if ai_score > 0 else 85,  # Default AI score
            "aiReason": prop.ai_verified_score if prop.ai_verified_score != "No evaluation yet" else "Great match based on your preferences",
            "rooms": rooms,
            "images": [f"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"]  # Default image
        })
    
    return JsonResponse({"properties": properties}, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def property_detail(request, property_id: int):
    """Return detailed information about a single property including rooms."""
    try:
        prop = m.Property.objects.prefetch_related('rooms').get(pk=property_id)
    except m.Property.DoesNotExist:
        return JsonResponse({"error": "Property not found"}, status=404)
    
    # Parse amenities
    amenities_list = []
    if prop.amenities:
        try:
            amenities_list = json.loads(prop.amenities)
        except:
            amenities_list = [a.strip() for a in prop.amenities.split(',') if a.strip()]
    
    # Calculate rating from reviews
    reviews_qs = m.Review.objects.filter(booking__room__property=prop)
    avg_rating = reviews_qs.aggregate(Avg('rating'))['rating__avg'] or 0
    review_count = reviews_qs.count()
    
    # Get rooms
    rooms = []
    for room in prop.rooms.all():
        rooms.append({
            "id": str(room.room_id),
            "name": room.title,
            "type": room.title.split()[0] if room.title else "Standard",
            "price": float(room.price_per_night),
            "capacity": 2,
            "size": 30,
            "beds": "1 King Bed",
            "amenities": amenities_list[:4],
            "image": room.photos_url or f"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "available": 1 if room.availability_status == "available" else 0
        })
    
    # Parse location
    location_parts = prop.location.split(',')
    city = location_parts[1].strip() if len(location_parts) > 1 else ""
    country = location_parts[2].strip() if len(location_parts) > 2 else ""
    
    # Parse AI score
    try:
        ai_score = float(prop.ai_verified_score) if prop.ai_verified_score and prop.ai_verified_score != "No evaluation yet" else 0
    except:
        ai_score = 0
    
    property_data = {
        "id": str(prop.property_id),
        "name": prop.name,
        "location": location_parts[0].strip(),
        "city": city,
        "country": country,
        "image": f"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "rating": round(avg_rating, 1),
        "reviews": review_count,
        "price": float(prop.price_per_night),
        "description": prop.description,
        "amenities": amenities_list,
        "aiScore": int(ai_score) if ai_score > 0 else 85,
        "aiReason": prop.ai_verified_score if prop.ai_verified_score != "No evaluation yet" else "Great match based on your preferences",
        "rooms": rooms,
        "images": [f"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"]
    }
    
    return JsonResponse(property_data, status=200)


# ==========================================
# Host Property & Room Management (CRUD)
# ==========================================

@csrf_exempt
@require_http_methods(["GET", "POST"])
def host_properties(request):
    """List all properties for the authenticated host, or create a new property."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)
    
    if not hasattr(request.user, "host_profile"):
        return JsonResponse({"error": "Only hosts can manage properties"}, status=403)
    
    host_profile = request.user.host_profile
    
    if request.method == "GET":
        # List all properties for this host
        properties = m.Property.objects.filter(host=host_profile).prefetch_related('rooms')
        properties_list = []
        
        for prop in properties:
            # Parse amenities
            amenities_list = []
            if prop.amenities:
                try:
                    amenities_list = json.loads(prop.amenities)
                except:
                    amenities_list = [a.strip() for a in prop.amenities.split(',') if a.strip()]
            
            # Get rooms
            rooms = []
            for room in prop.rooms.all():
                rooms.append({
                    "id": room.room_id,
                    "title": room.title,
                    "price_per_night": float(room.price_per_night),
                    "availability_status": room.availability_status,
                    "photos_url": room.photos_url or ""
                })
            
            properties_list.append({
                "id": prop.property_id,
                "name": prop.name,
                "location": prop.location,
                "description": prop.description,
                "amenities": amenities_list,
                "price_per_night": float(prop.price_per_night),
                "ai_verified_score": prop.ai_verified_score,
                "rooms": rooms
            })
        
        return JsonResponse({"properties": properties_list}, status=200)
    
    elif request.method == "POST":
        # Create new property
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        name = body.get("name", "").strip()
        location = body.get("location", "").strip()
        description = body.get("description", "").strip()
        price_per_night = body.get("price_per_night", 0.0)
        amenities = body.get("amenities", [])
        
        if not name or not location or not description:
            return JsonResponse({"error": "Name, location, and description are required"}, status=400)
        
        # Convert amenities list to JSON string
        amenities_str = json.dumps(amenities) if isinstance(amenities, list) else amenities
        
        property_obj = m.Property.objects.create(
            host=host_profile,
            name=name,
            location=location,
            description=description,
            price_per_night=price_per_night,
            amenities=amenities_str,
            ai_verified_score="No evaluation yet"
        )
        
        return JsonResponse({
            "success": True,
            "property": {
                "id": property_obj.property_id,
                "name": property_obj.name,
                "location": property_obj.location,
                "description": property_obj.description,
                "amenities": amenities,
                "price_per_night": float(property_obj.price_per_night),
                "ai_verified_score": property_obj.ai_verified_score
            }
        }, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def host_property_detail(request, property_id):
    """Get, update, or delete a specific property."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)
    
    if not hasattr(request.user, "host_profile"):
        return JsonResponse({"error": "Only hosts can manage properties"}, status=403)
    
    host_profile = request.user.host_profile
    
    try:
        property_obj = m.Property.objects.get(property_id=property_id, host=host_profile)
    except m.Property.DoesNotExist:
        return JsonResponse({"error": "Property not found"}, status=404)
    
    if request.method == "GET":
        # Parse amenities
        amenities_list = []
        if property_obj.amenities:
            try:
                amenities_list = json.loads(property_obj.amenities)
            except:
                amenities_list = [a.strip() for a in property_obj.amenities.split(',') if a.strip()]
        
        # Get rooms
        rooms = []
        for room in property_obj.rooms.all():
            rooms.append({
                "id": room.room_id,
                "title": room.title,
                "price_per_night": float(room.price_per_night),
                "availability_status": room.availability_status,
                "photos_url": room.photos_url or ""
            })
        
        return JsonResponse({
            "id": property_obj.property_id,
            "name": property_obj.name,
            "location": property_obj.location,
            "description": property_obj.description,
            "amenities": amenities_list,
            "price_per_night": float(property_obj.price_per_night),
            "ai_verified_score": property_obj.ai_verified_score,
            "rooms": rooms
        }, status=200)
    
    elif request.method == "PUT":
        # Update property
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        if "name" in body:
            property_obj.name = body.get("name", "").strip()
        if "location" in body:
            property_obj.location = body.get("location", "").strip()
        if "description" in body:
            property_obj.description = body.get("description", "").strip()
        if "price_per_night" in body:
            property_obj.price_per_night = body.get("price_per_night", 0.0)
        if "amenities" in body:
            amenities = body.get("amenities", [])
            property_obj.amenities = json.dumps(amenities) if isinstance(amenities, list) else amenities
        
        property_obj.save()
        
        # Parse amenities for response
        amenities_list = []
        if property_obj.amenities:
            try:
                amenities_list = json.loads(property_obj.amenities)
            except:
                amenities_list = [a.strip() for a in property_obj.amenities.split(',') if a.strip()]
        
        return JsonResponse({
            "success": True,
            "property": {
                "id": property_obj.property_id,
                "name": property_obj.name,
                "location": property_obj.location,
                "description": property_obj.description,
                "amenities": amenities_list,
                "price_per_night": float(property_obj.price_per_night),
                "ai_verified_score": property_obj.ai_verified_score
            }
        }, status=200)
    
    elif request.method == "DELETE":
        property_obj.delete()
        return JsonResponse({"success": True, "message": "Property deleted"}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def host_room_create(request, property_id):
    """Create a new room for a property."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)
    
    if not hasattr(request.user, "host_profile"):
        return JsonResponse({"error": "Only hosts can manage rooms"}, status=403)
    
    host_profile = request.user.host_profile
    
    try:
        property_obj = m.Property.objects.get(property_id=property_id, host=host_profile)
    except m.Property.DoesNotExist:
        return JsonResponse({"error": "Property not found"}, status=404)
    
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    title = body.get("title", "").strip()
    price_per_night = body.get("price_per_night", 0.0)
    availability_status = body.get("availability_status", "available")
    photos_url = body.get("photos_url", "")
    
    if not title:
        return JsonResponse({"error": "Room title is required"}, status=400)
    
    if availability_status not in ["available", "booked", "unavailable"]:
        availability_status = "available"
    
    room = m.Room.objects.create(
        property=property_obj,
        title=title,
        price_per_night=price_per_night,
        availability_status=availability_status,
        photos_url=photos_url
    )
    
    return JsonResponse({
        "success": True,
        "room": {
            "id": room.room_id,
            "title": room.title,
            "price_per_night": float(room.price_per_night),
            "availability_status": room.availability_status,
            "photos_url": room.photos_url or ""
        }
    }, status=201)


@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def host_room_detail(request, property_id, room_id):
    """Update or delete a specific room."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)
    
    if not hasattr(request.user, "host_profile"):
        return JsonResponse({"error": "Only hosts can manage rooms"}, status=403)
    
    host_profile = request.user.host_profile
    
    try:
        property_obj = m.Property.objects.get(property_id=property_id, host=host_profile)
    except m.Property.DoesNotExist:
        return JsonResponse({"error": "Property not found"}, status=404)
    
    try:
        room = m.Room.objects.get(room_id=room_id, property=property_obj)
    except m.Room.DoesNotExist:
        return JsonResponse({"error": "Room not found"}, status=404)
    
    if request.method == "PUT":
        # Update room
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        if "title" in body:
            room.title = body.get("title", "").strip()
        if "price_per_night" in body:
            room.price_per_night = body.get("price_per_night", 0.0)
        if "availability_status" in body:
            status = body.get("availability_status", "available")
            if status in ["available", "booked", "unavailable"]:
                room.availability_status = status
        if "photos_url" in body:
            room.photos_url = body.get("photos_url", "")
        
        room.save()
        
        return JsonResponse({
            "success": True,
            "room": {
                "id": room.room_id,
                "title": room.title,
                "price_per_night": float(room.price_per_night),
                "availability_status": room.availability_status,
                "photos_url": room.photos_url or ""
            }
        }, status=200)
    
    elif request.method == "DELETE":
        room.delete()
        return JsonResponse({"success": True, "message": "Room deleted"}, status=200)