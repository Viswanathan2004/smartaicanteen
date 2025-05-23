import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import FoodItemCard from "@/components/food-item-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Healthy"];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    if (filter && categories.includes(filter)) {
      setActiveCategory(filter);
    }
  }, []);

  const { data: foodItems = [], isLoading, error } = useQuery({
    queryKey: ["/api/food-items"],
    queryFn: async () => {
      const res = await fetch("/api/food-items");
      if (!res.ok) throw new Error("Failed to fetch food items");
      return res.json();
    }
  });

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Our Menu</h1>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Explore our wide range of delicious options for every taste, from healthy salads to indulgent treats.
              </p>
            </div>

            <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
              <Input
                type="text"
                placeholder="Search menu items..."
                className="max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="h-auto flex flex-wrap">
                  {categories.map(category => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className={`px-4 py-2 rounded-full ${
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                Array(8).fill(0).map((_, index) => (
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
              ) : filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <FoodItemCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-neutral-500">
                    {searchQuery
                      ? `No items match your search for "${searchQuery}"`
                      : `No items found in the ${activeCategory} category`}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-12 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Nutritional Information</h2>
              <p className="text-neutral-700 mb-4">
                We're committed to transparency about our food. All nutritional values are provided per serving size and include information on calories, protein, carbohydrates, and fats.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <InfoCard color="blue" title="Protein" description="Essential for muscle growth and repair. Our protein-rich options are marked for your convenience." />
                <InfoCard color="yellow" title="Carbohydrates" description="Provides energy for daily activities. We offer both simple and complex carbohydrate options." />
                <InfoCard color="red" title="Fats" description="Essential for hormone production and nutrient absorption. We focus on healthy fat sources." />
                <InfoCard color="green" title="Healthy Options" description='Look for the "Healthy" tag for balanced meals designed with nutrition in mind.' />
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function InfoCard({ color, title, description }) {
  return (
    <div className={`bg-${color}-50 p-3 rounded-lg`}>
      <h3 className={`font-medium mb-1 text-${color}-800`}>{title}</h3>
      <p className="text-neutral-700">{description}</p>
    </div>
  );
}
