import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { HotelDetailsPage } from './pages/HotelDetailsPage';
import { RoomSelectionPage } from './pages/RoomSelectionPage';
import { BookingReviewPage } from './pages/BookingReviewPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { AIRecommendationsPage } from './pages/AIRecommendationsPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { TravelGuidesPage } from './pages/TravelGuidesPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CompareHotelsPage } from './pages/CompareHotelsPage';
import { AIChatPage } from './pages/AIChatPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HostPropertiesPage } from './pages/HostPropertiesPage';
import { Toaster } from './components/ui/sonner';

type Page = 
  | 'home' 
  | 'search' 
  | 'hotel-details' 
  | 'room-selection' 
  | 'booking-review'
  | 'booking-confirmation'
  | 'ai-recommendations'
  | 'destinations'
  | 'travel-guides'
  | 'preferences'
  | 'favorites'
  | 'compare-hotels'
  | 'ai-chat'
  | 'login'
  | 'register'
  | 'host-properties';

interface PageData {
  hotelId?: string;
  roomId?: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<PageData>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleNavigate = (page: string, data?: PageData) => {
    setCurrentPage(page as Page);
    if (data) {
      setPageData(data);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (hotelId: string) => {
    setFavorites(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      
      case 'search':
        return (
          <SearchResultsPage
            onNavigate={handleNavigate}
            searchData={pageData}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      
      case 'hotel-details':
        return pageData.hotelId ? (
          <HotelDetailsPage
            hotelId={pageData.hotelId}
            onNavigate={handleNavigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : null;
      
      case 'room-selection':
        return pageData.hotelId ? (
          <RoomSelectionPage
            hotelId={pageData.hotelId}
            onNavigate={handleNavigate}
          />
        ) : null;
      
      case 'booking-review':
        return pageData.hotelId && pageData.roomId ? (
          <BookingReviewPage
            hotelId={pageData.hotelId}
            roomId={pageData.roomId}
            onNavigate={handleNavigate}
          />
        ) : null;
      
      case 'booking-confirmation':
        return pageData.hotelId && pageData.roomId ? (
          <BookingConfirmationPage
            hotelId={pageData.hotelId}
            roomId={pageData.roomId}
            onNavigate={handleNavigate}
          />
        ) : null;
      
      case 'ai-recommendations':
        return (
          <AIRecommendationsPage
            onNavigate={handleNavigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      
      case 'destinations':
        return <DestinationsPage onNavigate={handleNavigate} />;
      
      case 'travel-guides':
        return <TravelGuidesPage onNavigate={handleNavigate} />;
      
      case 'preferences':
        return <PreferencesPage onNavigate={handleNavigate} />;
      
      case 'favorites':
        return (
          <FavoritesPage
            onNavigate={handleNavigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      
      case 'compare-hotels':
        return (
          <CompareHotelsPage
            onNavigate={handleNavigate}
            favorites={favorites}
          />
        );
      
      case 'ai-chat':
        return <AIChatPage onNavigate={handleNavigate} />;
      
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      
      case 'host-properties':
        return <HostPropertiesPage onNavigate={handleNavigate} />;
      
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
    }
  };

  const shouldShowNavigation = currentPage !== 'login' && currentPage !== 'register';

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowNavigation && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
      {renderPage()}
      <Toaster />
    </div>
  );
}
