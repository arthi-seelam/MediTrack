import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "./contexts/LocationContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import HospitalSearchPage from "./pages/HospitalSearchPage";
import DoctorSearchPage from "./pages/DoctorSearchPage";
import HospitalDetailPage from "./pages/HospitalDetailPage";
import EmergencyPage from "./pages/EmergencyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LocationProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/hospitals" element={<HospitalSearchPage />} />
              <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
              <Route path="/doctors" element={<DoctorSearchPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LocationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
