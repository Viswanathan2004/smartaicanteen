import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center text-green-600">About Smart AI Canteen</h1>
      <p className="text-lg mb-6 text-gray-700 text-center">
        Welcome to the future of dining! Smart AI Canteen is a cutting-edge food ordering platform
        that blends technology with taste. We aim to provide students and staff with a faster,
        smarter, and more personalized dining experience.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">🤖 Powered by AI</h2>
          <p className="text-gray-600">
            Our intelligent system understands user preferences, suggests meals, and provides real-time updates on order status.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">🍽️ Delicious Food</h2>
          <p className="text-gray-600">
            From South Indian classics like idli and dosa to a variety of healthy choices, we offer food that satisfies every taste bud.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">🚀 Fast Ordering</h2>
          <p className="text-gray-600">
            Skip the queue with our smart ordering system. Place orders online, pay instantly, and get notified when your food is ready.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">🌿 Sustainable Practices</h2>
          <p className="text-gray-600">
            We use eco-friendly packaging and aim to minimize food waste using AI-based inventory tracking.
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-700">© {new Date().getFullYear()} Smart AI Canteen. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AboutUs;
