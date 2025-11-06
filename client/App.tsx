import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, type Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formation from "./pages/Formation";
import Index from "./pages/Index";
import ModulePage from "./pages/Module";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/index.html" element={<Index />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/modules/:moduleId" element={<ModulePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

type RootContainerElement = HTMLElement & {
  _reactRootContainer?: Root;
};

const rootContainer = container as RootContainerElement;

if (rootContainer._reactRootContainer) {
  (rootContainer._reactRootContainer as Root).render(<App />);
} else {
  const root = createRoot(rootContainer);
  rootContainer._reactRootContainer = root;
  root.render(<App />);
}
