from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


# ----------------------------
#  Custom User Manager
# ----------------------------
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role="guest"):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            role=role
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_host(self, email, name, password=None):
        return self.create_user(email, name, password, role='host')

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name, password, role='admin')
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


# ----------------------------
#  USER MODEL
# ----------------------------
class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [
        ("guest", "Guest"),
        ("host", "Host"),
        ("admin", "Admin"),
    ]

    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="guest")
    date_joined = models.DateTimeField(default=timezone.now)

    # Django admin compatibility
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return f"{self.name} ({self.role})"


# ----------------------------
#  GUEST PROFILE
# ----------------------------
class GuestProfile(models.Model):
    guest_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="guest_profile")

    preferences = models.TextField(blank=True, null=True)
    travel_reason = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Guest Profile: {self.user.email}"


# ----------------------------
#  HOST PROFILE
# ----------------------------
class HostProfile(models.Model):
    host_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="host_profile")

    bio = models.TextField(blank=True, null=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Host Profile: {self.user.email}"
