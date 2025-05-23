
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import AuthPage from "@/pages/auth-page";
import VoiceOrder from "@/pages/voice-order";
import DietAnalysis from "@/pages/diet-analysis";
import TrackOrder from "@/pages/track-order";
import Offers from "@/pages/offers";
import QRMenu from "@/pages/qr-menu";
import ChatbotPage from "@/pages/chatbot-page";
import MenuRecommendations from "@/pages/menu-recommendations";
import CartPage from "@/pages/cart-page";
import AboutUs from "./pages/AboutUs";
import NotFound from "@/pages/not-found";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/voice-order" component={VoiceOrder} />
      <Route path="/diet-analysis" component={DietAnalysis} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/offers" component={Offers} />
      <Route path="/qr-menu" component={QRMenu} />
      <Route path="/chatbot" component={ChatbotPage} />
      <Route path="/menu-recommendations" component={MenuRecommendations} />
      <Route path="/cart" component={CartPage} />
      <Route path="/about"component={AboutUs} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
