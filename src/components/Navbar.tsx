import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Hand } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/convert", label: "Convert" },
    { to: "/learn-sign", label: "Learn Sign" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <Hand className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">Sign Kit</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={signOut}
              className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
