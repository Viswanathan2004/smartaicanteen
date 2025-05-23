import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
// client/src/components/navbar.jsx



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Get cart items count from query cache if it exists
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/cart-items'],
    enabled: false, // Don't actually fetch, just access the cache
  });

  const cartCount = cartItems.length || 3; // Default to 3 for demo if no cart items

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path) => {
    return location === path ? "text-primary" : "hover:text-primary";
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-3xl w-8 h-8">
              <path d="M3 6h18M3 12h18M3 18h18"></path>
              <path d="M4 10h8"></path>
              <path d="M4 14h8"></path>
            </svg>
            <Link href="/">
              <span className="text-xl font-bold cursor-pointer">SmartCanteen</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/">
              <span className={`font-medium transition-colors ${isActive("/")} cursor-pointer`}>Home</span>
            </Link>
            <Link href="/menu">
              <span className={`font-medium transition-colors ${isActive("/menu")} cursor-pointer`}>Menu</span>
            </Link>
            <Link href="/offers">
              <span className={`font-medium transition-colors ${isActive("/offers")} cursor-pointer`}>Offers</span>
            </Link>
            <Link href="/track-order">
              <span className={`font-medium transition-colors ${isActive("/track-order")} cursor-pointer`}>Track Order</span>
            </Link>
            <Link href="/AboutUs">
              <span className={`font-medium transition-colors ${isActive("/AboutUs")} cursor-pointer`}>AboutUs</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <span className="relative p-2 hover:bg-neutral-100 rounded-full block cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </span>
            </Link>
            
            {/* User Profile Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 hover:bg-neutral-100 p-1 rounded">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-medium">{user.name.split(' ')[0]}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/diet-analysis">
                    <DropdownMenuItem className="cursor-pointer">
                      Diet Analysis
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/voice-order">
                    <DropdownMenuItem className="cursor-pointer">
                      Voice Order
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/menu-recommendations">
                    <DropdownMenuItem className="cursor-pointer">
                      AI Menu Recommendations
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button>Login</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-neutral-100 rounded"
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden px-4 pb-4 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-3">
          <Link href="/">
            <span className="py-2 hover:text-primary transition-colors block cursor-pointer">Home</span>
          </Link>
          <Link href="/menu">
            <span className="py-2 hover:text-primary transition-colors block cursor-pointer">Menu</span>
          </Link>
          <Link href="/offers">
            <span className="py-2 hover:text-primary transition-colors block cursor-pointer">Offers</span>
          </Link>
          <Link href="/track-order">
            <span className="py-2 hover:text-primary transition-colors block cursor-pointer">Track Order</span>
          </Link>
          <Link href="/diet-analysis">
            <span className="py-2 hover:text-primary transition-colors block cursor-pointer">Diet Analysis</span>
          </Link>
          <Link href="/voice-order">
            <span className="py-2 hover:text-primary transition-colors block cursor-pointer">Voice Order</span>
          </Link>
          <Link href="/menu-recommendations">
            <span className="py-2 hover:text-primary transition-colors block cursor-pointer">AI Menu Recommendations</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}