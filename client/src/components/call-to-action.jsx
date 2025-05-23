import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <div className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-bold text-3xl md:text-4xl mb-6">
          Ready to Experience Smarter Dining?
        </h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
          Download our app to enjoy all the AI-powered features and manage your orders on the go.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            size="lg"
            className="bg-white text-primary font-medium hover:bg-neutral-100 transition-colors flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6 mr-2"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10z"></path>
              <path d="M8.8 15.9l-4.2-4.2 1.4-1.4 2.8 2.8 5.8-5.8 1.4 1.4-7.2 7.2z" fill="white"></path>
            </svg>
            <div className="text-left">
              <p className="text-xs">Download on the</p>
              <p className="font-bold">App Store</p>
            </div>
          </Button>
          
          <Button
            size="lg"
            className="bg-white text-primary font-medium hover:bg-neutral-100 transition-colors flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6 mr-2"
            >
              <path d="M3 20.59l7.12-4.08L3 16.17V3h18v13.17l-7.12.34L21 20.59 12 17 3 20.59z"></path>
            </svg>
            <div className="text-left">
              <p className="text-xs">Get it on</p>
              <p className="font-bold">Google Play</p>
            </div>
          </Button>
        </div>

        <div className="mt-8">
          <Link href="/menu">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Browse Our Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}