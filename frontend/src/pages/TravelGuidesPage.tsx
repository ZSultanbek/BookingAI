import { Book, Sparkles, Clock, MapPin, Utensils, Camera, Plane } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface TravelGuidesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function TravelGuidesPage({ onNavigate }: TravelGuidesPageProps) {
  const guides = [
    {
      id: 1,
      title: 'The Ultimate Paris Travel Guide',
      destination: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1757849761602-6675d53c3da5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGNpdHklMjB2aWV3fGVufDF8fHx8MTc2MjY5NjE5NXww&ixlib=rb-4.1.0&q=80&w=1080',
      readTime: '8 min',
      category: 'City Guide',
      aiGenerated: true
    },
    {
      id: 2,
      title: 'Maldives: Paradise Island Hopping Guide',
      destination: 'Maldives',
      image: 'https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMHRyb3BpY2FsfGVufDF8fHx8MTc2MjY5NjE5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      readTime: '12 min',
      category: 'Beach',
      aiGenerated: true
    },
    {
      id: 3,
      title: 'Tokyo for First-Time Visitors',
      destination: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1713635632551-e633ee4cb95e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NjI2ODkwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      readTime: '10 min',
      category: 'City Guide',
      aiGenerated: true
    }
  ];

  const GuideCard = ({ guide }: { guide: any }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
      <div className="relative h-56">
        <ImageWithFallback
          src={guide.image}
          alt={guide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {guide.aiGenerated && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI Generated</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary">{guide.category}</Badge>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{guide.destination}</span>
          <span className="text-gray-400">•</span>
          <Clock className="w-4 h-4" />
          <span className="text-sm">{guide.readTime} read</span>
        </div>
        <h3 className="text-xl text-gray-900 mb-3">{guide.title}</h3>
        <Button variant="outline" className="w-full">
          Read Guide
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-12 h-12" />
            <div>
              <h1 className="text-5xl mb-2">AI Travel Guides</h1>
              <p className="text-xl text-white/90">
                Personalized travel guides powered by artificial intelligence
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Guide */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl text-gray-900 mb-2">Generate a Custom Travel Guide</h2>
              <p className="text-gray-700 mb-4">
                Our AI can create a personalized travel guide based on your interests, budget, and travel dates. 
                Get recommendations for attractions, restaurants, and activities tailored just for you.
              </p>
              <Button onClick={() => onNavigate('ai-chat')}>
                Create Custom Guide
              </Button>
            </div>
          </div>
        </Card>

        {/* Guides Grid */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Guides</TabsTrigger>
            <TabsTrigger value="city">City Guides</TabsTrigger>
            <TabsTrigger value="beach">Beach</TabsTrigger>
            <TabsTrigger value="adventure">Adventure</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="city" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.filter(g => g.category === 'City Guide').map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beach" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.filter(g => g.category === 'Beach').map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adventure" className="mt-8">
            <div className="text-center py-12">
              <p className="text-gray-600">No adventure guides yet. Check back soon!</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Guide Categories */}
        <div className="mt-16">
          <h2 className="text-3xl text-gray-900 mb-6">What would you like to explore?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Top Attractions', icon: Camera, color: 'from-blue-500 to-cyan-500' },
              { name: 'Local Cuisine', icon: Utensils, color: 'from-orange-500 to-red-500' },
              { name: 'Hidden Gems', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
              { name: 'Travel Tips', icon: Plane, color: 'from-green-500 to-emerald-500' },
            ].map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.name}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg text-gray-900">{category.name}</h3>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sample Guide Content */}
        <Card className="p-8 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl text-gray-900">Sample Guide: 3 Days in Paris</h2>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl text-gray-900 mb-3">Day 1: Classic Paris</h3>
            <p className="text-gray-700 mb-4">
              Start your Parisian adventure with the iconic landmarks. Begin at the Eiffel Tower early in the morning 
              to avoid crowds. Our AI recommends booking tickets in advance and arriving by 9 AM. After exploring the tower, 
              take a leisurely walk along the Seine to the Trocadéro Gardens for stunning photo opportunities.
            </p>

            <h3 className="text-xl text-gray-900 mb-3">Day 2: Art & Culture</h3>
            <p className="text-gray-700 mb-4">
              Immerse yourself in world-class art at the Louvre Museum. The AI suggests arriving when it opens at 9 AM 
              and heading straight to the Mona Lisa. Spend the afternoon in the charming Marais district, exploring 
              boutiques and cafes.
            </p>

            <h3 className="text-xl text-gray-900 mb-3">Day 3: Hidden Gems</h3>
            <p className="text-gray-700 mb-4">
              Discover Paris like a local. Visit the trendy Canal Saint-Martin area, explore vintage shops in the 
              Latin Quarter, and end your day with sunset views from Montmartre. Our AI recommends several authentic 
              bistros for your farewell dinner.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button>Read Full Guide</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
