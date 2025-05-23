import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FoodItemCard from "@/components/food-item-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FoodCategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: foodItems, isLoading, error } = useQuery({
    queryKey: ["/api/food-items"],
  });

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Healthy"];

  const filteredItems = foodItems?.filter(item => 
    activeCategory === "All" || item.category === activeCategory
  );

  const handleCategoryChange = (value) => {
    setActiveCategory(value);
  };

  if (error) {
    return (
      <div className="bg-neutral-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load menu items. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-bold text-3xl mb-2">Explore Our Menu</h2>
          <p className="text-neutral-800 max-w-2xl mx-auto">Discover our wide range of delicious options for every taste.</p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <Tabs defaultValue="All" value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="flex space-x-2 min-w-max pb-2 justify-center bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={`px-6 py-2 rounded-full font-medium ${
                    activeCategory === category
                      ? "bg-primary text-white"
                      : "bg-white hover:bg-neutral-200"
                  }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-10 w-10 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <>
              {filteredItems?.map((item) => (
                <FoodItemCard key={item.id} item={item} />
              ))}
            </>
          )}

          {/* View All Link */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center mt-6">
            <Link href="/menu">
              <span className="inline-flex items-center text-primary font-medium hover:underline cursor-pointer">
                <span>View All Menu Items</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 w-4 h-4">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}