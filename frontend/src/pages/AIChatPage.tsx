import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot } from 'lucide-react';
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { aiChat, getProperties, getCurrentUser } from '../lib/api';
import { Hotel } from '../types';

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
  const { t } = useLanguage();

  // Encryption / storage constants
  const STORAGE_KEY = 'ai_chat_storage_v1';
  const KEY_STORAGE = 'ai_chat_key_v1';
  const PBKDF2_ITERATIONS = 150000;
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.aiChat.initialMessage,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [usingPassphrase, setUsingPassphrase] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const properties = await getProperties();
        setHotels(properties);
      } catch (err) {
        console.error('Error fetching hotels for AI chat:', err);
      }
    }
    fetchHotels();
    // Initialize current user + encryption key & load stored messages
    (async () => {
      try {
        // try to get current user; this endpoint uses session cookies
        let uid: number | null = null;
        try {
          const me = await getCurrentUser();
          if (me && me.user) {
            uid = me.user.id;
            setCurrentUserId(uid);
          }
        } catch (e) {
          // not authenticated or failed -> proceed as anonymous
        }

        await ensureCryptoKey(uid);
        await loadMessagesFromStorage(uid);
      } catch (err) {
        console.warn('Could not initialize encrypted storage:', err);
      }
    })();
  }, []);

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

  // --- Encryption helpers and persistence ---
  const bufToB64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const b64ToBuf = (b64: string) => {
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  };
  const getRandomBytes = (len: number) => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  };

  const storageKeyForUser = (uid?: number | null) => `${STORAGE_KEY}_user_${uid ?? currentUserId ?? 'anon'}`;
  const keyStorageForUser = (uid?: number | null) => `${KEY_STORAGE}_user_${uid ?? currentUserId ?? 'anon'}`;

  const importKeyFromRaw = async (rawBase64: string) => {
    const raw = b64ToBuf(rawBase64);
    return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  };

  const exportKeyToRaw = async (key: CryptoKey) => {
    const raw = await crypto.subtle.exportKey('raw', key);
    return bufToB64(raw);
  };

  const deriveKeyFromPassphrase = async (passphrase: string, salt: BufferSource) => {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    return key;
  };

  const encryptWithKey = async (key: CryptoKey, data: string) => {
    const iv = getRandomBytes(12);
    const enc = new TextEncoder();
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(data));
    return { iv: bufToB64(iv.buffer), data: bufToB64(ct) };
  };

  const decryptWithKey = async (key: CryptoKey, ivB64: string, dataB64: string) => {
    const iv = new Uint8Array(b64ToBuf(ivB64));
    const ct = b64ToBuf(dataB64);
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return new TextDecoder().decode(dec);
  };

  const ensureCryptoKey = async (uid?: number | null) => {
    const keyName = keyStorageForUser(uid);
    const existingRaw = localStorage.getItem(keyName);
    if (existingRaw) {
      try {
        const key = await importKeyFromRaw(existingRaw);
        setCryptoKey(key);
        setUsingPassphrase(false);
        return key;
      } catch (err) {
        console.warn('Failed to import stored key, generating new one.', err);
      }
    }
    const newKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const raw = await exportKeyToRaw(newKey);
    try { localStorage.setItem(keyName, raw); } catch (e) { console.warn('Could not persist ai chat key', e); }
    setCryptoKey(newKey);
    setUsingPassphrase(false);
    return newKey;
  };

  const saveMessagesToStorage = async (msgs: Message[], uid?: number | null) => {
    if (!cryptoKey) return;
    try {
      const payload = JSON.stringify(msgs.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })));
      const encrypted = await encryptWithKey(cryptoKey, payload);
      const stored = { mode: usingPassphrase ? 'passphrase' : 'key', iv: encrypted.iv, data: encrypted.data } as any;
      localStorage.setItem(storageKeyForUser(uid), JSON.stringify(stored));
    } catch (err) {
      console.error('Failed to save encrypted messages:', err);
    }
  };

  const loadMessagesFromStorage = async (uid?: number | null) => {
    const raw = localStorage.getItem(storageKeyForUser(uid));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.data || !parsed.iv) return;
      if (parsed.mode === 'passphrase') {
        const pass = window.prompt('Enter passphrase to decrypt your AI chat history (leave blank to skip):');
        if (!pass) return;
  const saltB64 = parsed.salt || localStorage.getItem(storageKeyForUser(uid) + '_salt');
        if (!saltB64) return;
  const saltBuf = b64ToBuf(saltB64);
  const key = await deriveKeyFromPassphrase(pass, saltBuf);
        const dec = await decryptWithKey(key, parsed.iv, parsed.data);
        const objs = JSON.parse(dec) as any[];
        const loaded = objs.map(o => ({ ...o, timestamp: new Date(o.timestamp) } as Message));
        setMessages(prev => { const merged = [...loaded]; return merged.length ? merged : prev; });
        setCryptoKey(key);
        setUsingPassphrase(true);
      } else {
  const keyToUse = cryptoKey ?? await ensureCryptoKey(uid);
        if (!keyToUse) return;
        const dec = await decryptWithKey(keyToUse, parsed.iv, parsed.data);
        const objs = JSON.parse(dec) as any[];
        const loaded = objs.map(o => ({ ...o, timestamp: new Date(o.timestamp) } as Message));
        setMessages(prev => { const merged = [...loaded]; return merged.length ? merged : prev; });
      }
    } catch (err) {
      console.warn('Failed to load or decrypt stored messages:', err);
    }
  };

  const secureWithPassphrase = async () => {
    const pass = window.prompt('Choose a passphrase to protect your AI chat history (you will need it to decrypt later):');
    if (!pass) return;
    const passConfirm = window.prompt('Confirm passphrase:');
    if (pass !== passConfirm) { alert('Passphrases do not match. Aborting.'); return; }
    const salt = getRandomBytes(16);
  const key = await deriveKeyFromPassphrase(pass, salt.buffer);
    const payload = JSON.stringify(messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })));
    const encrypted = await encryptWithKey(key, payload);
    const stored = { mode: 'passphrase', iv: encrypted.iv, data: encrypted.data } as any;
    localStorage.setItem(storageKeyForUser(currentUserId), JSON.stringify(stored));
    localStorage.setItem(storageKeyForUser(currentUserId) + '_salt', bufToB64(salt.buffer));
    localStorage.removeItem(keyStorageForUser(currentUserId));
    setCryptoKey(key);
    setUsingPassphrase(true);
    alert('Chat history secured with passphrase. Remember it — without it the history cannot be recovered.');
  };

  const clearHistory = () => {
    if (!confirm('Clear saved AI chat history? This cannot be undone.')) return;
  localStorage.removeItem(storageKeyForUser());
  localStorage.removeItem(storageKeyForUser() + '_salt');
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: t.aiChat.initialMessage,
        timestamp: new Date()
      }
    ]);
  };

  // Save messages whenever they change
  useEffect(() => {
    (async () => {
      if (!cryptoKey) return;
      try { await saveMessagesToStorage(messages, currentUserId); } catch (e) { /* ignore */ }
    })();
  }, [messages, cryptoKey, usingPassphrase]);

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
        hotels: hotels.length > 0 ? hotels : []
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl">{t.aiChat.title}</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white/90">{t.aiChat.onlineStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-sm" onClick={secureWithPassphrase}>{t.aiChat.secureHistory}</Button>
              <Button variant="ghost" className="text-sm" onClick={clearHistory}>{t.aiChat.clearHistory}</Button>
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
              <p className="text-sm text-gray-600 mb-3">{t.aiChat.suggestedQuestions}</p>
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
              <h3 className="text-sm text-gray-900 mb-1">{t.aiChat.viewAIRecommendations}</h3>
              <p className="text-xs text-gray-600">{t.aiChat.viewPersonalizedPicks}</p>
            </Card>
            
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('destinations')}
            >
              <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="text-sm text-gray-900 mb-1">{t.aiChat.exploreDestinations}</h3>
              <p className="text-xs text-gray-600">{t.aiChat.browsePopularPlaces}</p>
            </Card>
            
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('preferences')}
            >
              <User className="w-6 h-6 text-pink-600 mb-2" />
              <h3 className="text-sm text-gray-900 mb-1">{t.aiChat.updatePreferences}</h3>
              <p className="text-xs text-gray-600">{t.aiChat.improveRecommendations}</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            <Input
              placeholder={t.aiChat.inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">{t.aiChat.poweredBy}</p>
        </div>
      </div>
    </div>
  );
}
