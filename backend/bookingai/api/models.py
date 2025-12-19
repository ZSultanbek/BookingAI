from django.db import models
from django.utils import timezone
from accounts.models import User, HostProfile, GuestProfile


# ----------------------------
#  PROPERTY (host lists)
# ----------------------------
class Property(models.Model):
    property_id = models.AutoField(primary_key=True)
    host = models.ForeignKey(
        HostProfile, 
        on_delete=models.CASCADE,
        related_name="properties"
    )

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    amenities = models.TextField(blank=True, null=True)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)

    # AI evaluation
    ai_verified_score = models.TextField(default="No evaluation yet")

    def __str__(self):
        return f"{self.name} ({self.location})"


# ----------------------------
#  ROOM  (inside Property)
# ----------------------------
class Room(models.Model):
    room_id = models.AutoField(primary_key=True)
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE,
        related_name="rooms"
    )

    title = models.CharField(max_length=255)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    availability_status = models.CharField(
        max_length=50,
        choices=[
            ("available", "Available"),
            ("booked", "Booked"),
            ("unavailable", "Unavailable")
        ],
        default="available"
    )

    photos_url = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} | {self.property.name}"


# ----------------------------
#  BOOKING (guest books room)
# ----------------------------
class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)

    guest = models.ForeignKey(
        GuestProfile,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    check_in = models.DateField()
    check_out = models.DateField()

    total_cost = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("confirmed", "Confirmed"),
            ("cancelled", "Cancelled"),
        ],
        default="pending"
    )

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Booking {self.booking_id} | {self.guest.user.email}"


# ----------------------------
#  PAYMENT (for booking)
# ----------------------------
class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="payment"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50, default="card")  
    payment_date = models.DateTimeField(default=timezone.now)

    status = models.CharField(
        max_length=20,
        choices=[
            ("success", "Success"),
            ("failed", "Failed"),
            ("refunded", "Refunded"),
        ],
        default="success"
    )

    def __str__(self):
        return f"Payment {self.payment_id} | {self.status}"


# ----------------------------
#  REVIEW (guest reviews booking)
# ----------------------------
class Review(models.Model):
    review_id = models.AutoField(primary_key=True)

    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)

    # AI feedback ("Did AI choose the right room?")
    ai_accuracy_feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Review {self.review_id} | Rating {self.rating}"
