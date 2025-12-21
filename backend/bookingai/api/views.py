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


# ----------------------------
#  FAVOURITE PROPERTIES
# ----------------------------
@csrf_exempt
@require_http_methods(["GET", "POST"])
def guest_favourites(request):
    """Get guest's favourite properties or add a new favourite."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        guest_profile = request.user.guest_profile
    except:
        return JsonResponse({"error": "User is not a guest"}, status=403)
    
    if request.method == "GET":
        # Get all favourite properties for the guest
        favourites = m.FavouriteProperty.objects.filter(guest=guest_profile).select_related('property')
        
        favourites_data = []
        for fav in favourites:
            property = fav.property
            favourites_data.append({
                "favourite_id": fav.favourite_id,
                "property_id": property.property_id,
                "name": property.name,
                "location": property.location,
                "description": property.description,
                "amenities": property.amenities,
                "price_per_night": float(property.price_per_night),
                "ai_verified_score": property.ai_verified_score,
                "added_at": fav.added_at.isoformat()
            })

        return JsonResponse({"favourites": favourites_data}, status=200)
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            property_id = data.get("property_id")
            
            if not property_id:
                return JsonResponse({"error": "property_id is required"}, status=400)
            
            property = m.Property.objects.get(property_id=property_id)
            
            # Check if already in favourites
            existing = m.FavouriteProperty.objects.filter(guest=guest_profile, property=property).first()
            if existing:
                return JsonResponse({"error": "Property already in favourites"}, status=400)
            
            # Add to favourites
            favourite = m.FavouriteProperty.objects.create(guest=guest_profile, property=property)
            
            return JsonResponse({
                "success": True,
                "message": "Property added to favourites",
                "favourite_id": favourite.favourite_id,
                "added_at": favourite.added_at.isoformat()
            }, status=201)
        
        except m.Property.DoesNotExist:
            return JsonResponse({"error": "Property not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def remove_favourite(request, favourite_id: int):
    """Remove a property from guest's favourites."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        guest_profile = request.user.guest_profile
    except:
        return JsonResponse({"error": "User is not a guest"}, status=403)
    
    try:
        favourite = m.FavouriteProperty.objects.get(favourite_id=favourite_id, guest=guest_profile)
        favourite.delete()
        return JsonResponse({"success": True, "message": "Property removed from favourites"}, status=200)
    
    except m.FavouriteProperty.DoesNotExist:
        return JsonResponse({"error": "Favourite not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ----------------------------
#  BOOKINGS
# ----------------------------
@csrf_exempt
@require_http_methods(["POST"])
def create_booking(request):
    """Create a new booking for a guest."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        guest_profile = request.user.guest_profile
    except:
        return JsonResponse({"error": "User is not a guest"}, status=403)
    
    try:
        data = json.loads(request.body)
        room_id = data.get("room_id")
        check_in = data.get("check_in")
        check_out = data.get("check_out")
        
        if not all([room_id, check_in, check_out]):
            return JsonResponse({"error": "room_id, check_in, and check_out are required"}, status=400)
        
        # Parse dates
        from datetime import datetime
        check_in_date = datetime.fromisoformat(check_in.replace('Z', '+00:00')).date()
        check_out_date = datetime.fromisoformat(check_out.replace('Z', '+00:00')).date()
        
        # Validate dates
        if check_out_date <= check_in_date:
            return JsonResponse({"error": "Check-out date must be after check-in date"}, status=400)
        
        # Get room
        room = m.Room.objects.get(room_id=room_id)
        
        # Calculate total cost
        num_nights = (check_out_date - check_in_date).days
        total_cost = room.price_per_night * num_nights
        
        # Create booking
        booking = m.Booking.objects.create(
            guest=guest_profile,
            room=room,
            check_in=check_in_date,
            check_out=check_out_date,
            total_cost=total_cost,
            status="confirmed"
        )
        
        return JsonResponse({
            "success": True,
            "message": "Booking created successfully",
            "booking": {
                "booking_id": booking.booking_id,
                "room_id": room.room_id,
                "check_in": booking.check_in.isoformat(),
                "check_out": booking.check_out.isoformat(),
                "total_cost": float(booking.total_cost),
                "status": booking.status,
                "created_at": booking.created_at.isoformat()
            }
        }, status=201)
    
    except m.Room.DoesNotExist:
        return JsonResponse({"error": "Room not found"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ----------------------------
#  REVIEWS
# ----------------------------
@csrf_exempt
@require_http_methods(["GET"])
def guest_bookings(request):
    """Get all bookings for the authenticated guest."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        guest_profile = request.user.guest_profile
    except:
        return JsonResponse({"error": "User is not a guest"}, status=403)
    
    bookings = m.Booking.objects.filter(guest=guest_profile).select_related('room__property').order_by('-created_at')
    
    bookings_data = []
    for booking in bookings:
        # Check if review exists
        has_review = m.Review.objects.filter(booking=booking).exists()
        
        bookings_data.append({
            "booking_id": booking.booking_id,
            "room": {
                "room_id": booking.room.room_id,
                "title": booking.room.title,
                "price_per_night": float(booking.room.price_per_night),
            },
            "property": {
                "property_id": booking.room.property.property_id,
                "name": booking.room.property.name,
                "location": booking.room.property.location,
            },
            "check_in": booking.check_in.isoformat(),
            "check_out": booking.check_out.isoformat(),
            "total_cost": float(booking.total_cost),
            "status": booking.status,
            "created_at": booking.created_at.isoformat(),
            "has_review": has_review
        })
    
    return JsonResponse({"bookings": bookings_data}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def create_review(request, booking_id: int):
    """Create a review for a booking."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        guest_profile = request.user.guest_profile
    except:
        return JsonResponse({"error": "User is not a guest"}, status=403)
    
    try:
        data = json.loads(request.body)
        rating = data.get("rating")
        comment = data.get("comment", "")
        ai_accuracy_feedback = data.get("ai_accuracy_feedback", "")
        
        if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
            return JsonResponse({"error": "Rating must be an integer between 1 and 5"}, status=400)
        
        # Check if booking exists and belongs to the guest
        booking = m.Booking.objects.get(booking_id=booking_id, guest=guest_profile)
        
        # Check if review already exists
        if m.Review.objects.filter(booking=booking).exists():
            return JsonResponse({"error": "Review already exists for this booking"}, status=400)
        
        # Create review
        review = m.Review.objects.create(
            booking=booking,
            rating=rating,
            comment=comment,
            ai_accuracy_feedback=ai_accuracy_feedback
        )
        
        # Evaluate the property using AI
        property = booking.room.property
        evaluation = evaluate_property_with_ai(property.property_id)
        
        return JsonResponse({
            "success": True,
            "message": "Review created successfully",
            "review": {
                "review_id": review.review_id,
                "rating": review.rating,
                "comment": review.comment,
                "ai_accuracy_feedback": review.ai_accuracy_feedback,
                "created_at": review.created_at.isoformat()
            },
            "property_evaluation": evaluation
        }, status=201)
    
    except m.Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def review_detail(request, review_id: int):
    """Get, update, or delete a specific review."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        guest_profile = request.user.guest_profile
    except:
        return JsonResponse({"error": "User is not a guest"}, status=403)
    
    try:
        review = m.Review.objects.select_related('booking').get(
            review_id=review_id,
            booking__guest=guest_profile
        )
    except m.Review.DoesNotExist:
        return JsonResponse({"error": "Review not found"}, status=404)
    
    if request.method == "GET":
        return JsonResponse({
            "review": {
                "review_id": review.review_id,
                "booking_id": review.booking.booking_id,
                "rating": review.rating,
                "comment": review.comment,
                "ai_accuracy_feedback": review.ai_accuracy_feedback,
                "created_at": review.created_at.isoformat()
            }
        }, status=200)
    
    elif request.method == "PUT":
        try:
            data = json.loads(request.body)
            rating = data.get("rating", review.rating)
            comment = data.get("comment", review.comment)
            ai_accuracy_feedback = data.get("ai_accuracy_feedback", review.ai_accuracy_feedback)
            
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return JsonResponse({"error": "Rating must be an integer between 1 and 5"}, status=400)
            
            review.rating = rating
            review.comment = comment
            review.ai_accuracy_feedback = ai_accuracy_feedback
            review.save()
            
            return JsonResponse({
                "success": True,
                "message": "Review updated successfully",
                "review": {
                    "review_id": review.review_id,
                    "rating": review.rating,
                    "comment": review.comment,
                    "ai_accuracy_feedback": review.ai_accuracy_feedback,
                    "created_at": review.created_at.isoformat()
                }
            }, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    elif request.method == "DELETE":
        review.delete()
        return JsonResponse({"success": True, "message": "Review deleted successfully"}, status=200)


# ----------------------------
#  PROPERTY AI EVALUATION
# ----------------------------
def evaluate_property_with_ai(property_id: int):
    """Evaluate a property based on all its reviews using AI."""
    try:
        property = m.Property.objects.get(property_id=property_id)
        
        # Get all reviews for rooms in this property
        reviews = m.Review.objects.filter(
            booking__room__property=property
        ).select_related('booking__room')
        
        if reviews.count() == 0:
            return {
                "overall_score": "N/A",
                "total_reviews": 0,
                "average_rating": 0,
                "evaluation": "No reviews yet"
            }
        
        # Aggregate review data
        ratings = [review.rating for review in reviews]
        comments = [review.comment for review in reviews if review.comment]
        average_rating = sum(ratings) / len(ratings)
        
        # Create evaluation prompt
        evaluation_prompt = f"""
Based on the following guest reviews for the property "{property.name}" located in {property.location}:

Property Details:
- Amenities: {property.amenities}
- Description: {property.description}
- Price per night: ${property.price_per_night}

Guest Reviews (Total: {len(reviews)}):
"""
        
        for i, review in enumerate(reviews, 1):
            evaluation_prompt += f"\nReview {i} (Rating: {review.rating}/5):\n"
            evaluation_prompt += f"Comment: {review.comment}\n"
            if review.ai_accuracy_feedback:
                evaluation_prompt += f"AI Feedback: {review.ai_accuracy_feedback}\n"
        
        evaluation_prompt += """
Please provide a comprehensive evaluation of this property that includes:
1. Overall Quality Score (0-100)
2. Strengths (based on positive feedback)
3. Areas for Improvement (based on negative feedback)
4. Amenities Assessment (are they meeting guest expectations?)
5. Value for Money (considering price and guest satisfaction)
6. Service Quality Assessment
7. Cleanliness and Maintenance Rating
8. Key Recommendations for the host

Format your response as a detailed analysis."""

        # Call Gemini API
        api_response = call_gemini(evaluation_prompt)
        
        # Store evaluation
        property.ai_evaluation = {
            "total_reviews": reviews.count(),
            "average_rating": float(average_rating),
            "evaluation": api_response,
            "generated_at": timezone.now().isoformat()
        }
        property.ai_evaluation_updated_at = timezone.now()
        property.save()
        
        return property.ai_evaluation
    
    except m.Property.DoesNotExist:
        return {"error": "Property not found"}
    except Exception as e:
        return {"error": str(e)}


@csrf_exempt
@require_http_methods(["GET"])
def property_evaluation(request, property_id: int):
    """Get the AI evaluation for a property."""
    try:
        property = m.Property.objects.get(property_id=property_id)
        
        evaluation_data = property.ai_evaluation or {}
        
        return JsonResponse({
            "property_id": property.property_id,
            "property_name": property.name,
            "property_location": property.location,
            "evaluation": evaluation_data,
            "updated_at": property.ai_evaluation_updated_at.isoformat()
        }, status=200)
    
    except m.Property.DoesNotExist:
        return JsonResponse({"error": "Property not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)