import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Save,
  Bed,
  DollarSign,
  MapPin,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<HostProperty | null>(null);
  const [propertyForm, setPropertyForm] = useState({
    name: "",
    location: "",
    description: "",
    price_per_night: 0,
    amenities: [] as string[],
  });

  // Room form state
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
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

  const handleOpenPropertyDialog = (property?: HostProperty) => {
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
    setShowPropertyDialog(true);
  };

  const handleClosePropertyDialog = () => {
    setShowPropertyDialog(false);
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
      handleClosePropertyDialog();
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

  const handleOpenRoomDialog = (propertyId: number, room?: HostRoom) => {
    setSelectedPropertyId(propertyId);
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
    setShowRoomDialog(true);
  };

  const handleCloseRoomDialog = () => {
    setShowRoomDialog(false);
    setSelectedPropertyId(null);
    setEditingRoom(null);
    setRoomForm({
      title: "",
      price_per_night: 0,
      availability_status: "available",
      photos_url: "",
    });
  };

  const handleSaveRoom = async () => {
    if (!roomForm.title || !selectedPropertyId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingRoom && selectedPropertyId) {
        await updateRoom(selectedPropertyId, editingRoom.id, roomForm);
        toast.success("Room updated successfully");
      } else if (selectedPropertyId) {
        await createRoom(selectedPropertyId, roomForm);
        toast.success("Room created successfully");
      }
      handleCloseRoomDialog();
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-12 h-12" />
              <div>
                <h1 className="text-5xl mb-2">Manage Properties</h1>
                <p className="text-xl text-white/90">
                  Create and manage your hotels and rooms
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleOpenPropertyDialog()}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Property
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first property
            </p>
            <Button onClick={() => handleOpenPropertyDialog()} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Property
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <Card key={property.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      <h2 className="text-2xl text-gray-900">{property.name}</h2>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${property.price_per_night}/night</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{property.description}</p>
                    {property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPropertyDialog(property)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      Rooms ({property.rooms.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRoomDialog(property.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Room
                    </Button>
                  </div>

                  {property.rooms.length === 0 ? (
                    <p className="text-gray-500 text-sm">No rooms yet. Add your first room!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.rooms.map((room) => (
                        <Card key={room.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{room.title}</h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenRoomDialog(property.id, room)}
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
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Property Dialog */}
      <Dialog open={showPropertyDialog} onOpenChange={setShowPropertyDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? "Edit Property" : "Create New Property"}
            </DialogTitle>
            <DialogDescription>
              {editingProperty
                ? "Update your property information"
                : "Add a new property to your listings"}
            </DialogDescription>
          </DialogHeader>

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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {availableAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-gray-50"
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

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClosePropertyDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveProperty}>
                <Save className="w-4 h-4 mr-2" />
                {editingProperty ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? "Edit Room" : "Create New Room"}
            </DialogTitle>
            <DialogDescription>
              {editingRoom
                ? "Update room information"
                : "Add a new room to this property"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="room-title">Room Title *</Label>
              <Input
                id="room-title"
                value={roomForm.title}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, title: e.target.value })
                }
                placeholder="e.g., Deluxe King Room"
              />
            </div>

            <div>
              <Label htmlFor="room-price">Price per Night ($) *</Label>
              <Input
                id="room-price"
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
              <Label htmlFor="room-status">Availability Status</Label>
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
              <Label htmlFor="room-photos">Photo URL</Label>
              <Input
                id="room-photos"
                value={roomForm.photos_url}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, photos_url: e.target.value })
                }
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseRoomDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveRoom}>
                <Save className="w-4 h-4 mr-2" />
                {editingRoom ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
