import { Link } from "wouter";

export default function FeatureHighlights() {
  const features = [
    {
      title: 'AI Assistant',
      description: 'Get recommendations and order help from our smart assistant.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent text-3xl w-8 h-8">
          <path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8z"></path>
          <path d="M10 8v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6"></path>
          <path d="M6 15a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1"></path>
        </svg>
      ),
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-accent/10',
      linkTo: '/chatbot'
    },
    {
      title: 'Voice Ordering',
      description: 'Just speak your order—no typing needed.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-3xl w-8 h-8">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      ),
      bgColor: 'bg-orange-50',
      iconBgColor: 'bg-primary/10',
      linkTo: '/voice-order'
    },
    {
      title: 'Diet Analysis',
      description: 'Get personalized nutrition insights based on your orders.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary text-3xl w-8 h-8">
          <path d="M4.5 12.5l3 3 8.5-8.5"></path>
          <path d="M20 12a8 8 0 1 1-9.5-7.8"></path>
        </svg>
      ),
      bgColor: 'bg-green-50',
      iconBgColor: 'bg-secondary/10',
      linkTo: '/diet-analysis'
    },
    {
      title: 'Live Tracking',
      description: 'Track your order in real-time from preparation to pickup.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 text-3xl w-8 h-8">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      bgColor: 'bg-purple-50',
      iconBgColor: 'bg-purple-500/10',
      linkTo: '/track-order'
    },
    {
      title: 'QR Code Menu',
      description: 'Scan and access the menu directly on your phone.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 text-3xl w-8 h-8">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <rect x="7" y="7" width="3" height="3"></rect>
          <rect x="14" y="7" width="3" height="3"></rect>
          <rect x="7" y="14" width="3" height="3"></rect>
          <rect x="14" y="14" width="3" height="3"></rect>
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      iconBgColor: 'bg-yellow-500/10',
      linkTo: '/qr-menu'
    },
    {
      title: 'Special Offers',
      description: 'Get personalized deals based on your order history.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 text-3xl w-8 h-8">
          <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
          <path d="M4 7h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"></path>
          <line x1="12" y1="12" x2="12" y2="20"></line>
          <line x1="8" y1="16" x2="16" y2="16"></line>
        </svg>
      ),
      bgColor: 'bg-red-50',
      iconBgColor: 'bg-red-500/10',
      linkTo: '/offers'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-3">Smart Features for Smarter Dining</h2>
          <p className="text-neutral-800 max-w-2xl mx-auto">Experience the future of canteen management with our AI-powered platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.linkTo}>
              <span className={`${feature.bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-shadow block cursor-pointer`}>
                <div className={`${feature.iconBgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-neutral-800">{feature.description}</p>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}