import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "./contexts/LocationContext";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import HospitalSearchPage from "./pages/HospitalSearchPage";
import DoctorSearchPage from "./pages/DoctorSearchPage";
import HospitalDetailPage from "./pages/HospitalDetailPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import EmergencyPage from "./pages/EmergencyPage";
import AuthPage from "./pages/AuthPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/hospitals" element={<HospitalSearchPage />} />
                <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
                <Route path="/doctors" element={<DoctorSearchPage />} />
                <Route path="/doctors/:id" element={<DoctorDetailPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/my-appointments" element={<UserDashboardPage />} />
              </Route>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
