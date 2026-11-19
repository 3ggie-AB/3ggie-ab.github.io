import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import LandingPage from "./pages/LandingPage";
import QuranPage from "./pages/QuranPage";
import SurahDetail from "./pages/SurahDetail";
import HistoryPage from "./pages/HistoryPage";
import JuzPage from "./pages/JuzPage";
import PluginPage from "./pages/PluginPage";
import PluginDetailPage from "./pages/PluginDetailPage";
import DownloadManagerPage from "./pages/DownloadManagerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Only show splash screen if directly opening quran routes
  const isQuranRoute =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/quran") ||
      window.location.pathname.startsWith("/surah"));

  const [showSplash, setShowSplash] = useState(isQuranRoute);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/beranda" element={<Navigate to="/quran" replace />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/juz" element={<JuzPage />} />
            <Route path="/plugin" element={<PluginPage />} />
            <Route path="/plugin/:id" element={<PluginDetailPage />} />
            <Route path="/downloads" element={<DownloadManagerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
