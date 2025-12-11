from django.urls import path

from .views import gemini_generate, health_check

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("gemini/generate/", gemini_generate, name="gemini_generate"),
]

