from django.urls import path

from .views import (
    health_check,
    ai_chat,
    ai_sort_rooms,
)

urlpatterns = [
    path("health/", health_check, name="health_check"),

    # AI endpoints
    path("ai/chat/", ai_chat, name="ai_chat"),
    path("ai/sort-rooms/", ai_sort_rooms, name="ai_sort_rooms"),
]
