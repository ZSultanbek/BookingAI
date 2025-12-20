from django.shortcuts import render, redirect
from .models import User, GuestProfile, HostProfile
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.http import JsonResponse
from django.conf import settings
import json

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
                    return redirect('http://localhost:3000/')

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
            return redirect('http://localhost:3000/')
        else:
            context = {'error': 'Invalid email or password.'}
            return render(request, 'accounts/login.html', context)
    if request.user.is_authenticated:
        return redirect('http://localhost:3000')
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
        return JsonResponse({
            "authenticated": True,
            "user": {
                "id": request.user.user_id,
                "email": request.user.email,
                "name": request.user.name,
                "role": request.user.role,
            }
        }, status=200)
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


@require_POST
def api_update_preferences(request):
    """API endpoint to update current user's preferences; returns JSON."""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    raw_prefs = ""
    if request.content_type and "json" in request.content_type:
        try:
            body = json.loads(request.body or "{}")
            raw_prefs = body.get("preferences", "")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
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
        return JsonResponse({"success": True, "message": "Preferences saved"})
    else:
        return JsonResponse({"error": "No profile found"}, status=400)
