import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-green-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="font-bold text-4xl md:text-5xl leading-tight text-neutral-900 mb-4">
              Smart Canteen with <span className="text-primary">AI-Powered</span> Experience
            </h1>
            <p className="text-lg text-neutral-800 mb-8">
              Order with voice, track in real-time, and get personalized diet suggestions with our intelligent canteen system.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/menu">
                <Button size="lg" className="bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                  Order Now
                </Button>
              </Link>
              <Link href="/voice-order">
                <Button size="lg" variant="outline" className="border-2 border-neutral-800 text-neutral-800 font-medium hover:bg-neutral-800 hover:text-white transition-colors">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <span>Voice Order</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80"
              alt="Canteen food items"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}