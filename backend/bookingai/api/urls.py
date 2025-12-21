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
    host_room_detail,
    guest_favourites,
    remove_favourite,
    create_booking,
    guest_bookings,
    create_review,
    review_detail,
    property_evaluation
)
from api import views

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("properties/", properties_list, name="properties_list"),
    path("properties/<int:property_id>/", property_detail, name="property_detail"),
    path("properties/<int:property_id>/reviews/", property_reviews, name="property_reviews"),
    path("properties/<int:property_id>/evaluation/", property_evaluation, name="property_evaluation"),
    path("ai/chat/", ai_chat, name="ai_chat"),
    path("ai/sort-rooms/", ai_sort_rooms, name="ai_sort_rooms"),
    # Host property and room management
    path("host/properties/", host_properties, name="host_properties"),
    path("host/properties/<int:property_id>/", host_property_detail, name="host_property_detail"),
    path("host/properties/<int:property_id>/rooms/", host_room_create, name="host_room_create"),
    path("host/properties/<int:property_id>/rooms/<int:room_id>/", host_room_detail, name="host_room_detail"),
    # Guest favourites
    path("guest/favourites/", guest_favourites, name="guest_favourites"),
    path("guest/favourites/<int:favourite_id>/", remove_favourite, name="remove_favourite"),
    # Guest bookings and reviews
    path("guest/bookings/create/", create_booking, name="create_booking"),
    path("guest/bookings/", guest_bookings, name="guest_bookings"),
    path("guest/bookings/<int:booking_id>/review/", create_review, name="create_review"),
    path("guest/reviews/<int:review_id>/", review_detail, name="review_detail"),
]
