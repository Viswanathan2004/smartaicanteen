// This file is just for reference, not used in production
// The actual data comes from the API

export const offers = [
  {
    id: 1,
    title: "Lunch Special Bundle",
    description: "Any main dish + drink + side, available weekdays 11AM-2PM.",
    discountPercent: 25,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    tag: "25% OFF",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // ✅ to string
    active: true,
  },
  {
    id: 2,
    title: "Morning Energizer",
    description: "Coffee and breakfast sandwich combo for early birds, before 9AM.",
    discountPercent: 15,
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    tag: "NEW",
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
  },
  {
    id: 3,
    title: "Fitness Favorites",
    description: "10% off any protein-rich meals and smoothies, available all day.",
    discountPercent: 10,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    tag: "HEALTHY",
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
  },
];
