from django.urls import path

from .views import (
    health_check, 
    property_reviews, 
    properties_list, 
    property_detail,
    ai_chat,
    ai_sort_rooms
)

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("properties/", properties_list, name="properties_list"),
    path("properties/<int:property_id>/", property_detail, name="property_detail"),
    path("properties/<int:property_id>/reviews/", property_reviews, name="property_reviews"),
    path("ai/chat/", ai_chat, name="ai_chat"),
    path("ai/sort-rooms/", ai_sort_rooms, name="ai_sort_rooms"),
]
