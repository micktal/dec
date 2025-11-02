import { useEffect } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 px-6 py-24">
        <div className="max-w-xl rounded-3xl border border-border bg-white/90 p-10 text-center shadow-xl shadow-primary/10 backdrop-blur">
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            Page introuvable
          </span>
          <h1 className="mt-6 text-4xl font-bold text-primary">404</h1>
          <p className="mt-4 text-lg text-foreground/75">
            On dirait que cette page n'est pas encore prête pour nos Capitaines. Reviens
            vers l'accueil pour poursuivre ta formation.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Retourner à l'accueil
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
