import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="paper-texture rounded-lg p-12 text-center max-w-md w-full border border-primary/20 shadow-xl">
        <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-display text-primary mb-4 font-bold">404</h1>
        <h2 className="text-2xl font-script text-secondary-foreground mb-6">Off the Menu</h2>
        
        <p className="text-muted-foreground font-body mb-8 leading-relaxed">
          It seems the page you're looking for has been 86'd or never existed in our kitchen.
        </p>

        <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-sans font-bold uppercase tracking-wider rounded shadow hover:bg-primary/90 transition-all vintage-button">
          Return to Kitchen
        </Link>
      </div>
    </div>
  );
}
