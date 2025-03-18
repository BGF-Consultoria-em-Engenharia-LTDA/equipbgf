
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InventoryProvider } from "./context/InventoryContext";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import InventoryList from "./pages/InventoryList";
import EquipmentDetail from "./pages/EquipmentDetail";
import RequestsList from "./pages/RequestsList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InventoryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/:id" element={<EquipmentDetail />} />
              <Route path="/requests" element={<RequestsList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </InventoryProvider>
  </QueryClientProvider>
);

export default App;
