import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import PhotoGallery from "./pages/PhotoGallery";
import CountdownTimer from "./pages/CountdownTimer";
import LoveLetterBuilder from "./pages/LoveLetterBuilder";
import MusicPlaylist from "./pages/MusicPlaylist";
import DatePlanner from "./pages/DatePlanner";
import LoveLanguageQuiz from "./pages/LoveLanguageQuiz";
import ScrapbookCreator from "./pages/ScrapbookCreator";
import VoiceRecorder from "./pages/VoiceRecorder";
import Flower3DViewer from "./pages/Flower3DViewer";
import SecretMessageDecoder from "./pages/SecretMessageDecoder";
import FlashcardGenerator from "./pages/FlashcardGenerator";
import Photobooth from "./pages/Photobooth";
import F1Racing from "./pages/F1Racing";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/valentine" element={<Index />} />
          <Route path="/photo-gallery" element={<PhotoGallery />} />
          <Route path="/countdown" element={<CountdownTimer />} />
          <Route path="/love-letter" element={<LoveLetterBuilder />} />
          <Route path="/music" element={<MusicPlaylist />} />
          <Route path="/date-planner" element={<DatePlanner />} />
          <Route path="/love-language" element={<LoveLanguageQuiz />} />
          <Route path="/scrapbook" element={<ScrapbookCreator />} />
          <Route path="/voice" element={<VoiceRecorder />} />
          <Route path="/flower-3d" element={<Flower3DViewer />} />
          <Route path="/decoder" element={<SecretMessageDecoder />} />
          <Route path="/flashcards" element={<FlashcardGenerator />} />
          <Route path="/photobooth" element={<Photobooth />} />
          <Route path="/f1-racing" element={<F1Racing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
