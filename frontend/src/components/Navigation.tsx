import React, { useState, useEffect } from "react";
import {
  Home,
  Search,
  Heart,
  Compass,
  Settings,
  MessageSquare,
  Map,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { getCurrentUser } from "../lib/api";
import { useLanguage } from "../contexts/LanguageContext";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { t } = useLanguage();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.authenticated && response.user) {
          setUserRole(response.user.role);
        }
      } catch (err) {
        // User not logged in or error
        setUserRole(null);
      }
    };
    checkUser();
  }, [currentPage]); // Re-check when page changes

  const navItems = [
    { id: "home", label: t.nav.home, icon: Home },
    { id: "search", label: t.nav.search, icon: Search },
    { id: "destinations", label: t.nav.destinations, icon: Compass },
    { id: "favorites", label: t.nav.favorites, icon: Heart },
    { id: "my-bookings", label: "My Bookings", icon: Calendar },
    { id: "ai-chat", label: t.nav.aiAssistant, icon: MessageSquare },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StayAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
            {userRole === "host" && (
              <Button
                variant={
                  currentPage === "host-properties" ? "default" : "ghost"
                }
                onClick={() => onNavigate("host-properties")}
                className="gap-2"
              >
                <Building2 className="w-4 h-4" />
                {t.nav.manageProperties}
              </Button>
            )}
            <Button
              variant={currentPage === "preferences" ? "default" : "ghost"}
              onClick={() => onNavigate("preferences")}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
