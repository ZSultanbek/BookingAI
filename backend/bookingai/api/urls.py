from django.urls import path

from .views import (
    health_check, 
    property_reviews, 
    properties_list, 
    property_detail,
    ai_chat,
    ai_sort_rooms,
    host_properties,
    host_property_detail,
    host_room_create,
    host_room_detail
)

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("properties/", properties_list, name="properties_list"),
    path("properties/<int:property_id>/", property_detail, name="property_detail"),
    path("properties/<int:property_id>/reviews/", property_reviews, name="property_reviews"),
    path("ai/chat/", ai_chat, name="ai_chat"),
    path("ai/sort-rooms/", ai_sort_rooms, name="ai_sort_rooms"),
    # Host property and room management
    path("host/properties/", host_properties, name="host_properties"),
    path("host/properties/<int:property_id>/", host_property_detail, name="host_property_detail"),
    path("host/properties/<int:property_id>/rooms/", host_room_create, name="host_room_create"),
    path("host/properties/<int:property_id>/rooms/<int:room_id>/", host_room_detail, name="host_room_detail"),
]
