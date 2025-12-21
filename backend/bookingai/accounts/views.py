from django.shortcuts import render, redirect
from .models import User, GuestProfile, HostProfile
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.http import JsonResponse
from django.conf import settings
import json


def generate_preference_text(preferences_data):
    """Generate a text description of user preferences from structured data."""
    if isinstance(preferences_data, str):
        try:
            preferences_data = json.loads(preferences_data)
        except (json.JSONDecodeError, TypeError):
            return ""
    
    if not isinstance(preferences_data, dict):
        return ""
    
    text_parts = []
    
    # Price range
    price_range = preferences_data.get("priceRange", [])
    if price_range and len(price_range) >= 2:
        text_parts.append(f"Budget: ${price_range[0]}-${price_range[1]} per night")
    
    # Selected amenities
    amenities = preferences_data.get("selectedAmenities", [])
    if amenities:
        text_parts.append(f"Preferred amenities: {', '.join(amenities)}")
    
    # Room types
    room_types = preferences_data.get("selectedRoomTypes", [])
    if room_types:
        text_parts.append(f"Preferred room types: {', '.join(room_types)}")
    
    # Travel purpose
    travel_purpose = preferences_data.get("travelPurpose", "")
    if travel_purpose:
        purpose_map = {
            "leisure": "Leisure travel",
            "business": "Business travel",
            "family": "Family trip",
            "adventure": "Adventure travel"
        }
        text_parts.append(f"Travel purpose: {purpose_map.get(travel_purpose, travel_purpose)}")
    
    # Preferred location
    location = preferences_data.get("preferredLocation", "")
    if location:
        location_map = {
            "city-center": "City center location preferred",
            "beach": "Beach/coastal area preferred",
            "mountains": "Mountain/nature area preferred",
            "suburbs": "Suburban area preferred"
        }
        text_parts.append(f"{location_map.get(location, location)}")
    
    return " | ".join(text_parts)


# Create your views here.
def register_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        name = request.POST.get('name')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        user_type = request.POST.get('user_type', 'guest')

        if password == password2:
            if not email or not name:
                context = {'error': 'Email and name are required.'}
                return render(request, 'accounts/register.html', context)
            if User.objects.filter(email=email).exists():
                context = {'error': 'Email already exists.'}
                return render(request, 'accounts/register.html', context)
            else:
                user = User.objects.create_user(email=email, name=name, password=password, role=user_type)
                user.save()
                # Optionally create profile based on role
                try:
                    if user_type == 'host':
                        HostProfile.objects.get_or_create(user=user)
                    else:
                        GuestProfile.objects.get_or_create(user=user)
                except Exception:
                    pass

                # Auto-login then redirect to home
                auth_user = authenticate(request, username=email, password=password)
                if auth_user:
                    login(request, auth_user)
                    try:
                        request.session.set_expiry(settings.SESSION_COOKIE_AGE)
                    except Exception:
                        pass
                    # Redirect to frontend main page
                    return redirect('http://localhost:5173/')

                context = {'success': 'User registered successfully. Please sign in.'}
                return render(request, 'accounts/register.html', context)
        else:
            context = {'error': 'Passwords do not match.'}
            return render(request, 'accounts/register.html', context)

    return render(request, 'accounts/register.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            try:
                request.session.set_expiry(settings.SESSION_COOKIE_AGE)
            except Exception:
                pass
            # Redirect to frontend main page
            return redirect('http://localhost:5173/')
        else:
            context = {'error': 'Invalid email or password.'}
            return render(request, 'accounts/login.html', context)
    if request.user.is_authenticated:
        return redirect('http://localhost:5173')
    return render(request, 'accounts/login.html')

def logout_view(request):
    logout(request)
    context = {'success': 'Logged out successfully.'}
    return render(request, 'accounts/login.html', context)


# ==========================================
# JSON API Endpoints for React Frontend
# ==========================================

@csrf_exempt
@require_POST
def api_register(request):
    """Register a new user via JSON."""
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = body.get("email", "").strip()
    name = body.get("name", "").strip()
    password = body.get("password", "").strip()
    role = body.get("role", "guest")  # "guest" or "host"

    if not email or not name or not password:
        return JsonResponse({"error": "Email, name, and password are required"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already registered"}, status=400)

    if len(password) < 8:
        return JsonResponse({"error": "Password must be at least 8 characters long"}, status=400)

    f = 0
    for char in password:
        if char >= '0' and char <= '9':
            f |= 1
        if char in ['.', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+']:
            f |= 2
        if (char >= 'A' and char <= 'Z'):
            f |= 4
        if (char >= 'a' and char <= 'z'):
            f |= 8

    if f != 15:
        return JsonResponse({"error": "Password must contain at least one digit, one special character, one uppercase letter, and one lowercase letter"}, status=400)
    # Create user
    user = User.objects.create_user(
        email=email,
        name=name,
        password=password,
        role=role
    )

    # Create profile based on role
    if role == "host":
        HostProfile.objects.create(user=user)
    else:
        GuestProfile.objects.create(user=user)

    return JsonResponse({
        "success": True,
        "user": {
            "id": user.user_id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        }
    }, status=201)


@csrf_exempt
@require_POST
def api_login(request):
    """Login user via JSON and create session."""
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = body.get("email", "").strip()
    password = body.get("password", "").strip()

    if not email or not password:
        return JsonResponse({"error": "Email and password are required"}, status=400)

    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        login(request, user)
        try:
            request.session.set_expiry(settings.SESSION_COOKIE_AGE)
        except Exception:
            pass
        return JsonResponse({
            "success": True,
            "user": {
                "id": user.user_id,
                "email": user.email,
                "name": user.name,
                "role": user.role,
            }
        }, status=200)
    else:
        return JsonResponse({"error": "Invalid email or password"}, status=401)


@csrf_exempt
@require_http_methods(["POST", "GET"])
def api_logout(request):
    """Logout current user."""
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out successfully"}, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def api_me(request):
    """Get current authenticated user info."""
    if request.user.is_authenticated:
        # Get profile preferences
        preferences = None
        travel_reason = None
        bio = None
        
        if hasattr(request.user, "guest_profile"):
            profile = request.user.guest_profile
            preferences = profile.preferences
            travel_reason = profile.travel_reason
        elif hasattr(request.user, "host_profile"):
            profile = request.user.host_profile
            bio = profile.bio if hasattr(profile, "bio") else None
            if hasattr(profile, "preferences"):
                preferences = profile.preferences
            if hasattr(profile, "travel_reason"):
                travel_reason = profile.travel_reason
        
        # Parse preferences JSON if available
        parsed_preferences = None
        if preferences:
            try:
                parsed_preferences = json.loads(preferences)
            except (json.JSONDecodeError, TypeError):
                parsed_preferences = None
        
        response_data = {
            "authenticated": True,
            "user": {
                "id": request.user.user_id,
                "email": request.user.email,
                "name": request.user.name,
                "role": request.user.role,
            },
            "preferences": parsed_preferences,
            "travel_reason": travel_reason
        }
        
        # Add bio for host users
        if bio is not None:
            response_data["bio"] = bio
        
        return JsonResponse(response_data, status=200)
    else:
        return JsonResponse({"authenticated": False}, status=200)


# ==========================================
# Preferences (HTML): require authentication
# ==========================================

@require_POST
def update_preferences(request):
    """Update current user's preferences; redirect to login if not authenticated."""
    if not request.user.is_authenticated:
        return redirect('login')

    raw_prefs = ""
    if request.content_type and "json" in request.content_type:
        try:
            body = json.loads(request.body or "{}")
            raw_prefs = body.get("preferences", "")
        except json.JSONDecodeError:
            raw_prefs = ""
    else:
        raw_prefs = request.POST.get("preferences", "")

    # Store on GuestProfile if present; otherwise HostProfile
    profile = None
    if hasattr(request.user, "guest_profile"):
        profile = request.user.guest_profile
    elif hasattr(request.user, "host_profile"):
        profile = request.user.host_profile

    if profile and hasattr(profile, "preferences"):
        profile.preferences = raw_prefs
        profile.save()

    return redirect('home')


@csrf_exempt
@require_POST
def api_update_preferences(request):
    """API endpoint to update current user's preferences; returns JSON."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    preferences_data = {}
    if request.content_type and "json" in request.content_type:
        try:
            body = json.loads(request.body or "{}")
            preferences_input = body.get("preferences", {})
            # Handle both dict and stringified preferences
            if isinstance(preferences_input, str):
                preferences_data = json.loads(preferences_input)
            elif isinstance(preferences_input, dict):
                preferences_data = preferences_input
            else:
                return JsonResponse({"error": "Invalid preferences format"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    else:
        return JsonResponse({"error": "Invalid content type"}, status=400)

    # Determine profile
    profile = None
    if hasattr(request.user, "guest_profile"):
        profile = request.user.guest_profile
    elif hasattr(request.user, "host_profile"):
        profile = request.user.host_profile

    if not profile:
        return JsonResponse(
            {"error": "No profile found. Please ensure your account is properly set up."},
            status=400
        )

    if not hasattr(profile, "preferences"):
        return JsonResponse(
            {"error": "Preferences are only available for guest accounts."},
            status=400
        )

    # Store raw preferences as JSON string
    raw_prefs = json.dumps(preferences_data)
    profile.preferences = raw_prefs

    preference_text = generate_preference_text(preferences_data)
    if hasattr(profile, "travel_reason"):
        profile.travel_reason = preference_text

    profile.save()

    return JsonResponse({
        "success": True,
        "message": "Preferences saved",
        "text": preference_text
    })


@csrf_exempt
@require_POST
def api_update_profile(request):
    """API endpoint to update current user's profile (name, email) and host profile (bio)."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    if request.content_type and "json" in request.content_type:
        try:
            body = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    else:
        return JsonResponse({"error": "Invalid content type"}, status=400)

    user = request.user
    updated = False

    # Update user fields (name, email)
    if "name" in body:
        new_name = body.get("name", "").strip()
        if new_name:
            user.name = new_name
            updated = True
        else:
            return JsonResponse({"error": "Name cannot be empty"}, status=400)

    if "email" in body:
        new_email = body.get("email", "").strip()
        if new_email:
            # Check if email is already taken by another user
            if User.objects.filter(email=new_email).exclude(user_id=user.user_id).exists():
                return JsonResponse({"error": "Email already in use"}, status=400)
            user.email = new_email
            updated = True
        else:
            return JsonResponse({"error": "Email cannot be empty"}, status=400)

    if updated:
        user.save()

    # Update host profile if user is a host
    if user.role == "host" and hasattr(user, "host_profile"):
        host_profile = user.host_profile
        if "bio" in body:
            host_profile.bio = body.get("bio", "").strip()
            host_profile.save()
            updated = True

    if not updated:
        return JsonResponse({"error": "No fields to update"}, status=400)

    return JsonResponse({
        "success": True,
        "message": "Profile updated successfully",
        "user": {
            "id": user.user_id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        },
        "bio": user.host_profile.bio if user.role == "host" and hasattr(user, "host_profile") else None
    })
