import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialsSection() {
  // In a real app, this would fetch from an API endpoint
  // For this demo, we'll use static data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80",
      rating: 5,
      text: "The voice ordering feature is incredible! I was able to place my order while multitasking. The food quality is excellent and always consistent."
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80",
      rating: 4.5,
      text: "The diet analysis feature has been a game-changer for me. I'm more conscious about my food choices, and I appreciate the personalized recommendations."
    },
    {
      id: 3,
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80",
      rating: 5,
      text: "The QR code menu is so convenient. No more waiting for menus! The tracking system also lets me know exactly when my food will be ready. Highly recommend!"
    }
  ];

  const { isLoading } = useQuery({
    queryKey: ['/testimonials'],
    enabled: false, // Disable actual API fetch for this demo
  });

  // Helper function to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg key="half" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"></path>
          <path d="M12 2v15.77l-6 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor"></path>
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-3">What Our Customers Say</h2>
          <p className="text-neutral-800 max-w-2xl mx-auto">
            Real experiences from our satisfied customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-5 w-24 mb-1" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
            : testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={`${testimonial.name}'s avatar`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <div className="flex">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-700">{testimonial.text}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}