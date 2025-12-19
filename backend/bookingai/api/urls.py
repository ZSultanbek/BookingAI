from django.urls import path

from .views import gemini_generate, health_check, property_reviews

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("properties/<int:property_id>/reviews/", property_reviews, name="property_reviews"),
    path("gemini/generate/", gemini_generate, name="gemini_generate"),
]
