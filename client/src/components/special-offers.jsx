import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function SpecialOffers() {
  const { data: offers, isLoading, error } = useQuery({
    queryKey: ["/api/offers"],
  });

  if (error) {
    return (
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load offers. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-3">Special Offers</h2>
          <p className="text-neutral-800 max-w-2xl mx-auto">
            Exclusive deals and discounts just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="relative rounded-xl shadow-lg overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-7 w-40 mb-1" />
                    <Skeleton className="h-4 w-60 mb-3" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              ))
          ) : (
            <>
              {offers?.map((offer) => (
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
                    <Button className="bg-white text-neutral-900 py-2 px-4 rounded-lg font-medium text-sm hover:bg-primary hover:text-white transition-colors w-fit">
                      Redeem Offer
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {offers && offers.length > 3 && (
          <div className="text-center mt-8">
            <Link href="/offers">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                View All Offers
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}