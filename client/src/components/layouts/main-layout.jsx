import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "wouter";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <Toaster />
      
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link href="/chatbot">
          <button className="bg-accent shadow-lg w-14 h-14 rounded-full flex items-center justify-center text-white hover:bg-accent/90 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}