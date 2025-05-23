import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";

export default function Offers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch offers from API
  const { data: offers, isLoading, error } = useQuery({
    queryKey: ["/api/offers"],
  });

  // Filter offers based on search query and active tab
  const filteredOffers = offers?.filter(offer => {
    const matchesSearch = searchQuery === "" || 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "expiring-soon" && offer.expiryDate && new Date(offer.expiryDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000) ||
      (activeTab === "discount" && offer.discountPercent && offer.discountPercent >= 20) ||
      (activeTab === "healthy" && offer.tag === "HEALTHY");
    
    return matchesSearch && matchesTab;
  });

  return (
    <MainLayout>
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Special Offers</h1>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Discover exclusive deals and discounts designed just for you. Take advantage of our limited-time offers and save on your favorite meals.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <Input
                  type="text"
                  placeholder="Search offers..."
                  className="w-full md:max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Offers</TabsTrigger>
                    <TabsTrigger value="expiring-soon">Expiring Soon</TabsTrigger>
                    <TabsTrigger value="discount">Best Discount</TabsTrigger>
                    <TabsTrigger value="healthy">Healthy Options</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Offers Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="relative rounded-xl shadow-lg overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <Skeleton className="h-6 w-20 mb-2" />
                      <Skeleton className="h-7 w-40 mb-1" />
                      <Skeleton className="h-4 w-60 mb-3" />
                      <Skeleton className="h-10 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Failed to load offers</h3>
                  <p className="text-neutral-600 mb-4">
                    We couldn't load the special offers at this time. Please try again later.
                  </p>
                  <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                </CardContent>
              </Card>
            ) : filteredOffers && filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="relative overflow-hidden rounded-xl shadow-lg group"
                  >
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <div className={`
                        ${offer.tag === "NEW" ? "bg-warning" : 
                          offer.tag === "HEALTHY" ? "bg-secondary" :
                          "bg-error"} 
                        text-white inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 w-fit`}
                      >
                        {offer.tag}
                      </div>
                      <h3 className="text-white font-semibold text-xl mb-1">{offer.title}</h3>
                      <p className="text-neutral-200 text-sm mb-3">{offer.description}</p>
                      
                      {offer.expiryDate && (
                        <p className="text-neutral-300 text-xs mb-2">
                          Expires: {formatDate(offer.expiryDate)}
                        </p>
                      )}
                      
                      <Button className="bg-white text-neutral-900 py-2 px-4 rounded-lg font-medium text-sm hover:bg-primary hover:text-white transition-colors w-fit">
                        Redeem Offer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <h3 className="text-xl font-medium mb-2">No offers found</h3>
                  <p className="text-neutral-600">
                    {searchQuery
                      ? `No offers match your search for "${searchQuery}"`
                      : "There are no active offers available at the moment."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* How to use offers section */}
            <Card className="mt-12 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">How to Redeem Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">1. Find an Offer</h3>
                    <p className="text-neutral-700">
                      Browse through our available offers to find one that suits your taste and budget.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <line x1="9" x2="15" y1="3" y2="3"></line>
                        <line x1="9" x2="15" y1="21" y2="21"></line>
                        <line x1="3" x2="3" y1="9" y2="15"></line>
                        <line x1="21" x2="21" y1="9" y2="15"></line>
                        <line x1="9" x2="15" y1="15" y2="15"></line>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">2. Click Redeem</h3>
                    <p className="text-neutral-700">
                      Click the "Redeem Offer" button on the offer card to save it to your account.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">3. Use During Checkout</h3>
                    <p className="text-neutral-700">
                      Your saved offers will automatically appear during checkout. Just select the one you want to use.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="mt-8 bg-primary text-white shadow-md">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Get Notified About New Offers</h3>
                    <p className="text-white/90 mb-4">
                      Subscribe to our newsletter and be the first to know about new deals, discounts, and special promotions.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Button variant="secondary" className="bg-white text-primary hover:bg-neutral-100 font-medium">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}