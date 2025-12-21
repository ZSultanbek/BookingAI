import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Bed,
  DollarSign,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import {
  getHostProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  createRoom,
  updateRoom,
  deleteRoom,
  getCurrentUser,
  HostProperty,
  HostRoom,
} from "../lib/api";

interface HostPropertiesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HostPropertiesPage({ onNavigate }: HostPropertiesPageProps) {
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Property form state
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<HostProperty | null>(null);
  const [propertyForm, setPropertyForm] = useState({
    name: "",
    location: "",
    description: "",
    price_per_night: 0,
    amenities: [] as string[],
  });

  // Room form state - track which property's room form is open
  const [openRoomFormForProperty, setOpenRoomFormForProperty] = useState<number | null>(null);
  const [editingRoom, setEditingRoom] = useState<HostRoom | null>(null);
  const [roomForm, setRoomForm] = useState({
    title: "",
    price_per_night: 0,
    availability_status: "available" as "available" | "booked" | "unavailable",
    photos_url: "",
  });

  const availableAmenities = [
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        if (!response.authenticated) {
          toast.error("Please log in to access this page");
          onNavigate("login");
          return;
        }

        if (response.user?.role !== "host") {
          toast.error("This page is only available for hosts");
          onNavigate("home");
          return;
        }

        setUserRole(response.user.role);
        await loadProperties();
      } catch (err) {
        toast.error("Please log in to access this page");
        onNavigate("login");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [onNavigate]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getHostProperties();
      setProperties(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPropertyForm = (property?: HostProperty) => {
    if (property) {
      setEditingProperty(property);
      setPropertyForm({
        name: property.name,
        location: property.location,
        description: property.description,
        price_per_night: property.price_per_night,
        amenities: property.amenities || [],
      });
    } else {
      setEditingProperty(null);
      setPropertyForm({
        name: "",
        location: "",
        description: "",
        price_per_night: 0,
        amenities: [],
      });
    }
    setShowPropertyForm(true);
    // Scroll to form after a brief delay
    setTimeout(() => {
      document.getElementById("property-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleClosePropertyForm = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
    setPropertyForm({
      name: "",
      location: "",
      description: "",
      price_per_night: 0,
      amenities: [],
    });
  };

  const handleSaveProperty = async () => {
    if (!propertyForm.name || !propertyForm.location || !propertyForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, propertyForm);
        toast.success("Property updated successfully");
      } else {
        await createProperty(propertyForm);
        toast.success("Property created successfully");
      }
      handleClosePropertyForm();
      await loadProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to save property");
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm("Are you sure you want to delete this property? This will also delete all rooms.")) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      toast.success("Property deleted successfully");
      await loadProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete property");
    }
  };

  const handleOpenRoomForm = (propertyId: number, room?: HostRoom) => {
    if (openRoomFormForProperty === propertyId && !room) {
      // Toggle off if clicking the same property's add button
      setOpenRoomFormForProperty(null);
      setEditingRoom(null);
      setRoomForm({
        title: "",
        price_per_night: 0,
        availability_status: "available",
        photos_url: "",
      });
      return;
    }

    setOpenRoomFormForProperty(propertyId);
    if (room) {
      setEditingRoom(room);
      setRoomForm({
        title: room.title,
        price_per_night: room.price_per_night,
        availability_status: room.availability_status,
        photos_url: room.photos_url || "",
      });
    } else {
      setEditingRoom(null);
      setRoomForm({
        title: "",
        price_per_night: 0,
        availability_status: "available",
        photos_url: "",
      });
    }
    
    // Scroll to room form after a brief delay
    setTimeout(() => {
      document.getElementById(`room-form-${propertyId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCloseRoomForm = (propertyId: number) => {
    setOpenRoomFormForProperty(null);
    setEditingRoom(null);
    setRoomForm({
      title: "",
      price_per_night: 0,
      availability_status: "available",
      photos_url: "",
    });
  };

  const handleSaveRoom = async (propertyId: number) => {
    if (!roomForm.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingRoom) {
        await updateRoom(propertyId, editingRoom.id, roomForm);
        toast.success("Room updated successfully");
      } else {
        await createRoom(propertyId, roomForm);
        toast.success("Room created successfully");
      }
      handleCloseRoomForm(propertyId);
      await loadProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to save room");
    }
  };

  const handleDeleteRoom = async (propertyId: number, roomId: number) => {
    if (!confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await deleteRoom(propertyId, roomId);
      toast.success("Room deleted successfully");
      await loadProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete room");
    }
  };

  const toggleAmenity = (amenity: string) => {
    setPropertyForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-12 h-12" />
              <div>
                <h1 className="text-3xl sm:text-5xl mb-2">Manage Properties</h1>
                <p className="text-lg sm:text-xl text-white/90">
                  Create and manage your hotels and rooms
                </p>
              </div>
            </div>
            {!showPropertyForm && (
              <Button
                onClick={() => handleOpenPropertyForm()}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Property
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Form */}
        {showPropertyForm && (
          <Card id="property-form" className="p-6 mb-8 border-2 border-blue-200 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProperty ? "Edit Property" : "Create New Property"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {editingProperty
                    ? "Update your property information"
                    : "Add a new property to your listings"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePropertyForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="property-name">Property Name *</Label>
                <Input
                  id="property-name"
                  value={propertyForm.name}
                  onChange={(e) =>
                    setPropertyForm({ ...propertyForm, name: e.target.value })
                  }
                  placeholder="e.g., Grand Hotel"
                />
              </div>

              <div>
                <Label htmlFor="property-location">Location *</Label>
                <Input
                  id="property-location"
                  value={propertyForm.location}
                  onChange={(e) =>
                    setPropertyForm({ ...propertyForm, location: e.target.value })
                  }
                  placeholder="e.g., New York, NY, USA"
                />
              </div>

              <div>
                <Label htmlFor="property-description">Description *</Label>
                <Textarea
                  id="property-description"
                  value={propertyForm.description}
                  onChange={(e) =>
                    setPropertyForm({ ...propertyForm, description: e.target.value })
                  }
                  placeholder="Describe your property..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="property-price">Price per Night ($) *</Label>
                <Input
                  id="property-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={propertyForm.price_per_night}
                  onChange={(e) =>
                    setPropertyForm({
                      ...propertyForm,
                      price_per_night: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                  {availableAmenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleAmenity(amenity)}
                    >
                      <input
                        type="checkbox"
                        checked={propertyForm.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleClosePropertyForm} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSaveProperty} className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  {editingProperty ? "Update Property" : "Create Property"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 && !showPropertyForm ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first property
            </p>
            <Button onClick={() => handleOpenPropertyForm()} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Property
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <Card key={property.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <h2 className="text-xl sm:text-2xl text-gray-900">{property.name}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm sm:text-base">{property.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm sm:text-base">${property.price_per_night}/night</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">{property.description}</p>
                    {property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs sm:text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPropertyForm(property)}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      Rooms ({property.rooms.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRoomForm(property.id)}
                      className="w-full sm:w-auto"
                    >
                      {openRoomFormForProperty === property.id ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Room
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Room Form */}
                  {openRoomFormForProperty === property.id && (
                    <Card id={`room-form-${property.id}`} className="p-4 mb-4 bg-gray-50 border-2 border-blue-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">
                          {editingRoom ? "Edit Room" : "Create New Room"}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCloseRoomForm(property.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`room-title-${property.id}`}>Room Title *</Label>
                          <Input
                            id={`room-title-${property.id}`}
                            value={roomForm.title}
                            onChange={(e) =>
                              setRoomForm({ ...roomForm, title: e.target.value })
                            }
                            placeholder="e.g., Deluxe King Room"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`room-price-${property.id}`}>Price per Night ($) *</Label>
                          <Input
                            id={`room-price-${property.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={roomForm.price_per_night}
                            onChange={(e) =>
                              setRoomForm({
                                ...roomForm,
                                price_per_night: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor={`room-status-${property.id}`}>Availability Status</Label>
                          <Select
                            value={roomForm.availability_status}
                            onValueChange={(value: "available" | "booked" | "unavailable") =>
                              setRoomForm({ ...roomForm, availability_status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="booked">Booked</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`room-photos-${property.id}`}>Photo URL</Label>
                          <Input
                            id={`room-photos-${property.id}`}
                            value={roomForm.photos_url}
                            onChange={(e) =>
                              setRoomForm({ ...roomForm, photos_url: e.target.value })
                            }
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleCloseRoomForm(property.id)}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSaveRoom(property.id)}
                            className="w-full sm:w-auto"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {editingRoom ? "Update Room" : "Create Room"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {property.rooms.length === 0 && openRoomFormForProperty !== property.id ? (
                    <p className="text-gray-500 text-sm">No rooms yet. Add your first room!</p>
                  ) : property.rooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.rooms.map((room) => (
                        <Card key={room.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{room.title}</h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenRoomForm(property.id, room)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRoom(property.id, room.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span>${room.price_per_night}/night</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  room.availability_status === "available"
                                    ? "bg-green-100 text-green-800"
                                    : room.availability_status === "booked"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {room.availability_status}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
