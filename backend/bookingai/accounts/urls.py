from django.urls import path
from . import views


urlpatterns = [
    # HTML template views
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('preferences/', views.update_preferences, name='update_preferences'),
    
    # JSON API endpoints for React
    path('api/register/', views.api_register, name='api_register'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/logout/', views.api_logout, name='api_logout'),
    path('api/me/', views.api_me, name='api_me'),
    path('api/preferences/', views.api_update_preferences, name='api_update_preferences'),
    path('api/profile/', views.api_update_profile, name='api_update_profile'),
]