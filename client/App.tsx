import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, type Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Formation from "./pages/Formation";
import Index from "./pages/Index";
import ModulePage from "./pages/Module";
import NotFound from "./pages/NotFound";

type WindowWithScormTarget = Window & {
  __SCORM_MODULE__?: string | null;
};

function getScormModuleTarget(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const win = window as WindowWithScormTarget;
  const explicit = win.__SCORM_MODULE__;
  if (explicit && typeof explicit === "string") {
    return explicit;
  }

  try {
    const url = new URL(window.location.href);
    const param = url.searchParams.get("module");
    return param ?? undefined;
  } catch {
    return undefined;
  }
}

const queryClient = new QueryClient();

const App = () => {
  const scormModuleTarget = getScormModuleTarget();

  const routes = (
    <Routes>
      <Route
        path="/"
        element={
          scormModuleTarget ? (
            <Navigate to={`/modules/${scormModuleTarget}`} replace />
          ) : (
            <Index />
          )
        }
      />
      <Route
        path="/index.html"
        element={
          scormModuleTarget ? (
            <Navigate to={`/modules/${scormModuleTarget}`} replace />
          ) : (
            <Index />
          )
        }
      />
      <Route path="/formation" element={<Formation />} />
      <Route
        path="/modules/:moduleId"
        element={<ModulePage scormModule={scormModuleTarget} />}
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route
        path="*"
        element={
          scormModuleTarget ? (
            <Navigate to={`/modules/${scormModuleTarget}`} replace />
          ) : (
            <NotFound />
          )
        }
      />
    </Routes>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {scormModuleTarget ? (
          <MemoryRouter initialEntries={[`/modules/${scormModuleTarget}`]}>
            {routes}
          </MemoryRouter>
        ) : (
          <BrowserRouter>{routes}</BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

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
