import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function FoodItemCard({ item }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = () => {
    setIsAdding(true);
    
    // In a real app, this would call an API to add to cart
    setTimeout(() => {
      // Get current cart from query cache or initialize empty array
      const currentCart = queryClient.getQueryData(['/cart-items']) || [];
      
      // Add item to cart
      queryClient.setQueryData(['/cart-items'], [
        ...currentCart,
        {
          id: Date.now(),
          foodItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1
        }
      ]);
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      });
      
      setIsAdding(false);
    }, 500);
  };

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-48 object-cover"
        />
        {item.isHealthy && (
          <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-lg">
            Healthy
          </div>
        )}
        {item.isPopular && (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
            Popular
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400 w-4 h-4">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-sm font-medium ml-1">{(item.rating / 10).toFixed(1)}</span>
          </div>
        </div>
        <p className="text-neutral-600 text-sm mb-3">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{formatPrice(item.price)}</span>
          <Button 
            size="icon"
            className="bg-primary text-white hover:bg-primary/90 transition-colors"
            onClick={addToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}