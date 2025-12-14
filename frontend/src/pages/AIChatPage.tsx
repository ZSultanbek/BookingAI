import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { aiChat } from '../lib/api';
import { mockHotels } from "../data/mockData";

interface AIChatPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatPage({ onNavigate }: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI travel assistant. I can help you find the perfect hotel, plan your trip, or answer any questions about destinations. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "Find me a luxury hotel in Paris",
    "What are the best beach destinations?",
    "I need a hotel near Times Square",
    "Recommend hotels for families",
    "What's the best time to visit Tokyo?",
    "Show me budget-friendly options"
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('paris') || lowerMessage.includes('france')) {
      return "I'd recommend the Grand Luxe Palace in Paris! It has a 95% AI match score for you based on your preferences. It's located in Downtown Paris with stunning Eiffel Tower views, rated 4.8 stars, and starting at $350/night. Would you like to see more options in Paris or book this hotel?";
    } else if (lowerMessage.includes('beach') || lowerMessage.includes('tropical')) {
      return "For beach destinations, I highly recommend the Maldives! The Oceanfront Resort & Spa is perfect with its private beach, infinity pool, and water sports facilities. It has a 92% AI match score and costs $450/night. Other great beach options include resorts in Bali and the Caribbean. Which interests you more?";
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      return "I can help you find great budget-friendly options! Based on your search, I found several hotels under $200/night with excellent ratings. The Tokyo Skyline Hotel at $280/night offers great value with modern amenities and a perfect location. Would you like to see more budget options or filter by specific price range?";
    } else if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
      return "For family travel, I recommend hotels with family-friendly amenities like kids clubs, pools, and spacious rooms. The Dubai Marina Towers is excellent for families with a dedicated kids club, multiple pools, and family suites starting at $400/night. Would you like recommendations in a specific destination?";
    } else if (lowerMessage.includes('business') || lowerMessage.includes('work')) {
      return "For business travel, I suggest Manhattan Heights in New York. It's in Midtown Manhattan with easy access to business districts, features a business center, high-speed WiFi, and work desks in all rooms. Starting at $320/night with a 90% AI match for business travelers. Need hotels in other business destinations?";
    } else if (lowerMessage.includes('tokyo') || lowerMessage.includes('japan')) {
      return "Tokyo is amazing! The best time to visit is during spring (March-May) for cherry blossoms or fall (September-November) for pleasant weather. The Tokyo Skyline Hotel in Shibuya is a great choice at $280/night with a 88% AI match. It's modern, centrally located, and perfect for exploring the city. Want to know more about Tokyo attractions?";
    } else if (lowerMessage.includes('mountain') || lowerMessage.includes('ski')) {
      return "For mountain destinations, I highly recommend the Alpine Retreat in Zermatt, Switzerland! It offers ski-in/ski-out access, stunning Matterhorn views, and luxury spa facilities. Starting at $480/night with a 91% AI match for adventure travelers. It's perfect for both winter skiing and summer hiking. Interested in booking?";
    } else {
      return "I'd be happy to help you find the perfect hotel! Could you tell me more about what you're looking for? For example: your destination, travel dates, budget, and what amenities are important to you. Or you can browse our AI-recommended hotels that match your preferences!";
    }
  };

  const preferences = {
  travel_reason: "leisure",
  preferred_amenities: ["Free WiFi", "Pool"],
  room_type: "Suite",
  };  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const userInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call real Gemini API through backend
      const aiText = await aiChat({
        message: userInput,
        preferences,
        hotels: mockHotels
      });
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // Fallback to mock response if API fails
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. ${getAIResponse(userInput)}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl">AI Travel Assistant</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/90">Online and ready to help</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <div className={`flex-1 max-w-2xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                  <Card className={`p-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                    <p className={message.role === 'user' ? 'text-white' : 'text-gray-900'}>
                      {message.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === 'assistant' && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </Card>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <Card className="p-4 bg-white">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="mt-8">
              <p className="text-sm text-gray-600 mb-3">Suggested questions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('ai-recommendations')}
            >
              <Sparkles className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="text-sm text-gray-900 mb-1">View AI Recommendations</h3>
              <p className="text-xs text-gray-600">See personalized hotel picks</p>
            </Card>
            
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('destinations')}
            >
              <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="text-sm text-gray-900 mb-1">Explore Destinations</h3>
              <p className="text-xs text-gray-600">Browse popular places</p>
            </Card>
            
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('preferences')}
            >
              <User className="w-6 h-6 text-pink-600 mb-2" />
              <h3 className="text-sm text-gray-900 mb-1">Update Preferences</h3>
              <p className="text-xs text-gray-600">Improve recommendations</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            <Input
              placeholder="Ask me anything about hotels or travel..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
