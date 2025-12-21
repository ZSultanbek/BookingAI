import React from "react";
import { Settings, Sparkles, Save, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { logout, getCurrentUser, savePreferences, updateProfile } from "../lib/api";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { useLanguage } from "../contexts/LanguageContext";
import { Languages } from "lucide-react";

interface PreferencesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PreferencesPage({ onNavigate }: PreferencesPageProps) {
  const { language, setLanguage, t } = useLanguage();
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Free WiFi",
    "Pool",
  ]);
  const [travelPurpose, setTravelPurpose] = useState("leisure");
  const [preferredLocation, setPreferredLocation] = useState("city-center");
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([
    "King Bed",
  ]);
  const [preferenceText, setPreferenceText] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Host profile fields
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [hostBio, setHostBio] = useState("");

  // Check authentication on mount and load preferences
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        if (!response.authenticated) {
          toast.error("Please log in to access preferences");
          onNavigate("login");
          return;
        }

        // Store user role and load profile data
        if (response.user) {
          setUserRole(response.user.role);
          
          // Load host profile data
          if (response.user.role === "host") {
            setHostName(response.user.name || "");
            setHostEmail(response.user.email || "");
            setHostBio(response.bio || "");
          }
        }

        // Load saved preferences if available (for guests)
        if (response.user?.role === "guest" && response.preferences) {
          const prefs = response.preferences;
          if (prefs.priceRange && Array.isArray(prefs.priceRange) && prefs.priceRange.length >= 2) {
            setPriceRange(prefs.priceRange);
          }
          if (prefs.selectedAmenities && Array.isArray(prefs.selectedAmenities)) {
            setSelectedAmenities(prefs.selectedAmenities);
          }
          if (prefs.travelPurpose && typeof prefs.travelPurpose === "string") {
            setTravelPurpose(prefs.travelPurpose);
          }
          if (prefs.preferredLocation && typeof prefs.preferredLocation === "string") {
            setPreferredLocation(prefs.preferredLocation);
          }
          if (prefs.selectedRoomTypes && Array.isArray(prefs.selectedRoomTypes)) {
            setSelectedRoomTypes(prefs.selectedRoomTypes);
          }
        }

        // Load preference text description if available (for guests)
        if (response.user?.role === "guest" && response.travel_reason) {
          setPreferenceText(response.travel_reason);
        }
      } catch (err) {
        toast.error("Please log in to access preferences");
        onNavigate("login");
        return;
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [onNavigate]);

  const amenitiesList = [
    "Free WiFi",
    "Pool",
    "Spa",
    "Restaurant",
    "Gym",
    "Parking",
    "Bar",
    "Beach Access",
    "Pet Friendly",
    "Airport Shuttle",
    "Business Center",
    "Room Service",
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleRoomType = (roomType: string) => {
    setSelectedRoomTypes((prev) =>
      prev.includes(roomType)
        ? prev.filter((r) => r !== roomType)
        : [...prev, roomType]
    );
  };

  const handleSavePreferences = async () => {
    // Validate user is a guest
    if (userRole !== "guest") {
      toast.error("Preferences can only be saved for guest accounts");
      return;
    }

    // Validate required fields
    if (!priceRange || !Array.isArray(priceRange) || priceRange.length < 2) {
      toast.error("Please set a valid price range");
      return;
    }

    if (!travelPurpose || travelPurpose.trim() === "") {
      toast.error("Please select a travel purpose");
      return;
    }

    if (!preferredLocation || preferredLocation.trim() === "") {
      toast.error("Please select a preferred location");
      return;
    }

    setIsSaving(true);

    try {
      // Ensure all data is properly formatted
      const preferences = {
        priceRange: Array.isArray(priceRange) ? priceRange : [100, 500],
        selectedAmenities: Array.isArray(selectedAmenities) ? selectedAmenities : [],
        travelPurpose: travelPurpose || "leisure",
        preferredLocation: preferredLocation || "city-center",
        selectedRoomTypes: Array.isArray(selectedRoomTypes) ? selectedRoomTypes : [],
      };

      const response = await savePreferences(preferences);

      if (response && response.success) {
        toast.success(
          "Preferences saved successfully! AI recommendations will be updated."
        );

        // Update preference text if returned from backend
        if (response.text) {
          setPreferenceText(response.text);
        }

        setTimeout(() => {
          onNavigate("ai-recommendations");
        }, 1500);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to save preferences. Please try again.";
      toast.error(errorMessage);
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    // Validate user is a host
    if (userRole !== "host") {
      toast.error("Profile editing is only available for host accounts");
      return;
    }

    // Validate required fields
    if (!hostName || hostName.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }

    if (!hostEmail || hostEmail.trim() === "") {
      toast.error("Email cannot be empty");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(hostEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);

    try {
      const profileData: { name?: string; email?: string; bio?: string } = {
        name: hostName.trim(),
        email: hostEmail.trim(),
      };

      if (hostBio !== undefined) {
        profileData.bio = hostBio.trim();
      }

      const response = await updateProfile(profileData);

      if (response && response.success) {
        toast.success("Profile updated successfully!");
        
        // Update local state with response data
        if (response.user) {
          setHostName(response.user.name);
          setHostEmail(response.user.email);
        }
        if (response.bio !== undefined) {
          setHostBio(response.bio);
        }
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to update profile. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out. Redirecting to login...");
      onNavigate("login");
    } catch (err: any) {
      toast.error(err?.message || "Logout failed");
    }
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Settings className="w-12 h-12" />
            <div>
              <h1 className="text-5xl mb-2">
                {userRole === "host" ? t.preferences.title.replace("Preferences", "Profile") : t.preferences.title}
              </h1>
              <p className="text-xl text-white/90">
                {userRole === "host"
                  ? "Manage your account settings and profile information"
                  : t.preferences.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {userRole === "guest" ? (
          <>
            {/* AI Info Banner */}
            <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">{t.preferences.title}</h3>
                  <p className="text-gray-700">{t.preferences.subtitle}</p>
                </div>
              </div>
            </Card>

            {/* Current Preference Summary */}
            {preferenceText && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.preferences.preferenceSummary}</h3>
                <p className="text-gray-700">{preferenceText}</p>
              </Card>
            )}

            <div className="space-y-8">
              {/* Language Selection */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Languages className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl text-gray-900">{t.preferences.language}</h2>
                </div>
                <div>
                  <Label className="mb-3 block">{t.preferences.selectLanguage}</Label>
                  <Select
                    value={language}
                    onValueChange={(value: "en" | "ru" | "kk") => setLanguage(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t.preferences.english}</SelectItem>
                      <SelectItem value="ru">{t.preferences.russian}</SelectItem>
                      <SelectItem value="kk">{t.preferences.kazakh}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

          {/* Price Range */}
          <Card className="p-6">
      <h2 className="text-2xl text-gray-900 mb-4">{t.preferences.budget}</h2>
            <div>
              <Label className="mb-4 block">{t.preferences.priceRange}</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={50}
                className="mb-4"
              />
              <div className="flex justify-between text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}+</span>
              </div>
            </div>
          </Card>

          {/* Travel Purpose */}
          <Card className="p-6">
            <h2 className="text-2xl text-gray-900 mb-4">{t.preferences.travelPurpose}</h2>
            <RadioGroup value={travelPurpose} onValueChange={setTravelPurpose}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="leisure" id="leisure" />
                  <Label htmlFor="leisure" className="cursor-pointer flex-1">
                    <div>
                        <p className="text-gray-900">{t.preferences.travelPurposes.leisureTitle}</p>
                        <p className="text-sm text-gray-600">{t.preferences.travelPurposes.leisureDesc}</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="cursor-pointer flex-1">
                    <div>
                        <p className="text-gray-900">{t.preferences.travelPurposes.businessTitle}</p>
                        <p className="text-sm text-gray-600">{t.preferences.travelPurposes.businessDesc}</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="family" id="family" />
                  <Label htmlFor="family" className="cursor-pointer flex-1">
                    <div>
                        <p className="text-gray-900">{t.preferences.travelPurposes.familyTitle}</p>
                        <p className="text-sm text-gray-600">{t.preferences.travelPurposes.familyDesc}</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="adventure" id="adventure" />
                  <Label htmlFor="adventure" className="cursor-pointer flex-1">
                    <div>
                        <p className="text-gray-900">{t.preferences.travelPurposes.adventureTitle}</p>
                        <p className="text-sm text-gray-600">{t.preferences.travelPurposes.adventureDesc}</p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </Card>

          {/* Location Preference */}
          <Card className="p-6">
            <h2 className="text-2xl text-gray-900 mb-4">{t.preferences.locationPreference}</h2>
            <div>
              <Label className="mb-3 block">{t.preferences.wherePreferStay}</Label>
              <Select
                value={preferredLocation}
                onValueChange={setPreferredLocation}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city-center">City Center</SelectItem>
                  <SelectItem value="beach">Beachfront</SelectItem>
                  <SelectItem value="airport">Near Airport</SelectItem>
                  <SelectItem value="business-district">
                    Business District
                  </SelectItem>
                  <SelectItem value="tourist-area">Tourist Area</SelectItem>
                  <SelectItem value="quiet">Quiet/Residential Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Amenities */}
          <Card className="p-6">
            <h2 className="text-2xl text-gray-900 mb-4">{t.preferences.amenities}</h2>
            <p className="text-gray-600 mb-4">{t.preferences.selectAmenities}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {amenitiesList.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label htmlFor={amenity} className="cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Room Type Preferences */}
          <Card className="p-6">
            <h2 className="text-2xl text-gray-900 mb-4">{t.preferences.roomTypes}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "King Bed",
                "Twin Beds",
                "Suite",
                "Studio",
                "Apartment",
                "Villa",
              ].map((roomType) => (
                <div
                  key={roomType}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={roomType}
                    checked={selectedRoomTypes.includes(roomType)}
                    onCheckedChange={() => toggleRoomType(roomType)}
                  />
                  <Label htmlFor={roomType} className="cursor-pointer">
                    {roomType}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

              {/* Save Button */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSavePreferences}
                  size="lg"
                  className="flex-1"
                  disabled={isSaving || userRole !== "guest"}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? t.common.loading : t.preferences.savePreferences}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate("home")}
                >
                  {t.common.cancel}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleLogout}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Tips */}
            <Card className="p-6 mt-8">
              <h3 className="text-lg text-gray-900 mb-3">💡 {t.preferences.tipsHeading}</h3>
              <ul className="space-y-2 text-gray-700">
                {t.preferences.tips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </Card>
          </>
        ) : userRole === "host" ? (
          <>
            {/* Host Profile Info Banner */}
            <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">
                    Manage Your Profile
                  </h3>
                  <p className="text-gray-700">
                    Update your account information and profile details. Changes will be saved immediately.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              {/* Language Selection */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Languages className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl text-gray-900">{t.preferences.language}</h2>
                </div>
                <div>
                  <Label className="mb-3 block">{t.preferences.selectLanguage}</Label>
                  <Select
                    value={language}
                    onValueChange={(value: "en" | "ru" | "kk") => setLanguage(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t.preferences.english}</SelectItem>
                      <SelectItem value="ru">{t.preferences.russian}</SelectItem>
                      <SelectItem value="kk">{t.preferences.kazakh}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
              {/* Name */}
              <Card className="p-6">
                <h2 className="text-2xl text-gray-900 mb-4">Name</h2>
                <div>
                  <Label htmlFor="host-name" className="mb-3 block">
                    Your full name
                  </Label>
                  <Input
                    id="host-name"
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full"
                  />
                </div>
              </Card>

              {/* Email */}
              <Card className="p-6">
                <h2 className="text-2xl text-gray-900 mb-4">Email</h2>
                <div>
                  <Label htmlFor="host-email" className="mb-3 block">
                    Email address
                  </Label>
                  <Input
                    id="host-email"
                    type="email"
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full"
                  />
                </div>
              </Card>

              {/* Bio */}
              <Card className="p-6">
                <h2 className="text-2xl text-gray-900 mb-4">Bio</h2>
                <div>
                  <Label htmlFor="host-bio" className="mb-3 block">
                    Tell us about yourself
                  </Label>
                  <Textarea
                    id="host-bio"
                    value={hostBio}
                    onChange={(e) => setHostBio(e.target.value)}
                    placeholder="Write a brief description about yourself..."
                    className="w-full min-h-[120px]"
                  />
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSaveProfile}
                  size="lg"
                  className="flex-1"
                  disabled={isSaving || userRole !== "host"}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate("home")}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleLogout}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
