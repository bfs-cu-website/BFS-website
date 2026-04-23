import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
const bfsLogo = "/bfs-logo.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/team", label: "Team" },
    { href: "/blog", label: "Blog" },
    { href: "/resources", label: "Resources" },
  ];

  const solidBg = isScrolled || location !== "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidBg ? "bg-primary shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 z-50">
            <img src={bfsLogo} alt="B&FS Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white p-1" />
            <div className={`flex flex-col justify-center ${isScrolled || location !== "/" ? "text-white" : "text-white"}`}>
              <span className="font-bold text-sm md:text-base leading-tight">Business & Finance Society</span>
              <span className="text-xs md:text-sm font-medium text-accent">Cotton University</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    location === link.href ? "text-accent" : "text-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href="/join">
              <Button className="bg-accent hover:bg-accent/90 text-primary font-bold">
                Join B&FS
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-primary/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8 pt-20">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-2xl font-bold ${
                location === link.href ? "text-accent" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/join" className="mt-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-bold px-10 text-lg">
              Join B&FS
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}