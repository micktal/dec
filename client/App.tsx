import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formation from "./pages/Formation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

type RootInstance = ReturnType<typeof createRoot>;

type ContainerWithRoot = HTMLElement & {
  _reactRootContainer?: RootInstance;
};

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

const containerWithRoot = container as ContainerWithRoot;
const existingRoot = containerWithRoot._reactRootContainer;

type RenderableRoot = RootInstance & {
  render(children: React.ReactNode): void;
};

if (existingRoot) {
  (existingRoot as RenderableRoot).render(<App />);
} else {
  createRoot(containerWithRoot).render(<App />);
}
