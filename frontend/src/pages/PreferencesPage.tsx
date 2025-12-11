import React from 'react';
import { Settings, Sparkles, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner@2.0.3';

interface PreferencesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PreferencesPage({ onNavigate }: PreferencesPageProps) {
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Free WiFi', 'Pool']);
  const [travelPurpose, setTravelPurpose] = useState('leisure');
  const [preferredLocation, setPreferredLocation] = useState('city-center');

  const amenitiesList = [
    'Free WiFi',
    'Pool',
    'Spa',
    'Restaurant',
    'Gym',
    'Parking',
    'Bar',
    'Beach Access',
    'Pet Friendly',
    'Airport Shuttle',
    'Business Center',
    'Room Service'
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully! AI recommendations will be updated.');
    setTimeout(() => {
      onNavigate('ai-recommendations');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Settings className="w-12 h-12" />
            <div>
              <h1 className="text-5xl mb-2">Your Preferences</h1>
              <p className="text-xl text-white/90">
                Customize your experience to get better AI recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* AI Info Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-2">Personalize Your Experience</h3>
              <p className="text-gray-700">
                The more we know about your preferences, the better our AI can recommend hotels that match your style. 
                Your preferences are stored locally and used only to improve your recommendations.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          {/* Price Range */}
          <Card className="p-6">
            <h2 className="text-2xl text-gray-900 mb-4">Budget</h2>
            <div>
              <Label className="mb-4 block">Preferred price range per night</Label>
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
            <h2 className="text-2xl text-gray-900 mb-4">Travel Purpose</h2>
            <RadioGroup value={travelPurpose} onValueChange={setTravelPurpose}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="leisure" id="leisure" />
                  <Label htmlFor="leisure" className="cursor-pointer flex-1">
                    <div>
                      <p className="text-gray-900">Leisure & Vacation</p>
                      <p className="text-sm text-gray-600">Relaxation and enjoyment</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="cursor-pointer flex-1">
                    <div>
                      <p className="text-gray-900">Business Travel</p>
                      <p className="text-sm text-gray-600">Work-related trips</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="family" id="family" />
                  <Label htmlFor="family" className="cursor-pointer flex-1">
                    <div>
                      <p className="text-gray-900">Family Vacation</p>
                      <p className="text-sm text-gray-600">Traveling with family</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="adventure" id="adventure" />
                  <Label htmlFor="adventure" className="cursor-pointer flex-1">
                    <div>
                      <p className="text-gray-900">Adventure & Exploration</p>
                      <p className="text-sm text-gray-600">Outdoor activities and discovery</p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </Card>

          {/* Location Preference */}
          <Card className="p-6">
            <h2 className="text-2xl text-gray-900 mb-4">Location Preference</h2>
            <div>
              <Label className="mb-3 block">Where do you prefer to stay?</Label>
              <Select value={preferredLocation} onValueChange={setPreferredLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city-center">City Center</SelectItem>
                  <SelectItem value="beach">Beachfront</SelectItem>
                  <SelectItem value="airport">Near Airport</SelectItem>
                  <SelectItem value="business-district">Business District</SelectItem>
                  <SelectItem value="tourist-area">Tourist Area</SelectItem>
                  <SelectItem value="quiet">Quiet/Residential Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Amenities */}
          <Card className="p-6">
            <h2 className="text-2xl text-gray-900 mb-4">Preferred Amenities</h2>
            <p className="text-gray-600 mb-4">Select all amenities that are important to you</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
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
            <h2 className="text-2xl text-gray-900 mb-4">Room Type Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['King Bed', 'Twin Beds', 'Suite', 'Studio', 'Apartment', 'Villa'].map((roomType) => (
                <div key={roomType} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Checkbox id={roomType} />
                  <Label htmlFor={roomType} className="cursor-pointer">
                    {roomType}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button onClick={handleSavePreferences} size="lg" className="flex-1">
              <Save className="w-5 h-5 mr-2" />
              Save Preferences
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate('home')}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg text-gray-900 mb-3">💡 Tips for Better Recommendations</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Update your preferences regularly to reflect your changing needs</li>
            <li>• The more specific you are, the better our AI can match you with hotels</li>
            <li>• Like hotels you're interested in to help train the AI</li>
            <li>• Your preferences are only stored in your browser for privacy</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
