import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getDietRecommendation } from "@/lib/openai";
import { VoiceRecognition } from "@/lib/voice-recognition";
import { Card, CardContent } from "@/components/ui/card";

export default function AIFeatures() {
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState([]);
  
  // Diet Analysis query
  const { data: dietRecommendation } = useQuery({
    queryKey: ['/diet-recommendation'],
    queryFn: getDietRecommendation,
    // Disable fetching for demo purposes
    enabled: false,
    placeholderData: {
      recommendation: "Based on your recent orders, try adding more vegetables and whole grains to balance your nutrition intake.",
      suggestedItems: ["Protein Quinoa Bowl", "Garden Fresh Salad"]
    }
  });
  
  // Simulated data for demo
  const chatMessages = [
    { role: 'assistant', content: 'Hello! How can I help you with your meal today?' },
    { role: 'user', content: 'I\'m looking for a healthy lunch option.' },
    { role: 'assistant', content: 'Based on our menu today, I\'d recommend our Protein Quinoa Bowl or Garden Fresh Salad. Both are balanced with vegetables and proteins. Would you like to know more about either of these?' },
    { role: 'user', content: 'Tell me about the Quinoa Bowl, please.' },
    { role: 'assistant', content: 'The Protein Quinoa Bowl contains quinoa, mixed vegetables, grilled chicken, and avocado. It\'s high in protein (24g) and fiber (8g), making it filling and nutritious. It\'s priced at $9.99. Would you like to add this to your order?' }
  ];
  
  // Simulate voice recognition
  const startVoiceRecognition = () => {
    const recognition = new VoiceRecognition({
      onStart: () => {
        setIsListening(true);
        setVoiceText("");
        setRecognizedItems([]);
      },
      onResult: (transcript) => {
        setVoiceText(transcript);
        // Simulate recognized items
        setTimeout(() => {
          setRecognizedItems([
            { name: "Garden Fresh Salad", quantity: 1 },
            { name: "Iced Coffee", quantity: 1 }
          ]);
        }, 1000);
      },
      onEnd: () => setIsListening(false),
      onError: (error) => {
        console.error(error);
        setIsListening(false);
      }
    });
    
    recognition.start();
  };
  
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-3">AI-Powered Features</h2>
          <p className="text-neutral-800 max-w-2xl mx-auto">Experiencing the future of dining with intelligent technology.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Voice Order Demo */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 shadow-lg">
            <h3 className="font-semibold text-2xl mb-4">Voice Ordering</h3>
            <p className="text-neutral-800 mb-6">Just speak naturally to place your order. Our AI understands your preferences.</p>
            
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className={`flex items-end space-x-1 h-20 ${isListening ? '' : 'opacity-30'}`}>
                    <div className="w-3 h-10 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '-0.3s' }}></div>
                    <div className="w-3 h-16 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '-0.2s' }}></div>
                    <div className="w-3 h-20 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '-0.1s' }}></div>
                    <div className="w-3 h-14 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none' }}></div>
                    <div className="w-3 h-8 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '0.1s' }}></div>
                  </div>
                </div>
                
                <p className="text-neutral-600 italic mb-4">
                  {voiceText || "\"I'd like to order a garden salad and an iced coffee, please.\""}
                </p>
                
                <div className="bg-neutral-100 rounded-lg p-4">
                  <p className="text-sm font-medium">Recognized Order:</p>
                  <ul className="mt-2 space-y-2">
                    {recognizedItems.length > 0 ? (
                      recognizedItems.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success mr-2 w-5 h-5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{item.quantity}x {item.name}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success mr-2 w-5 h-5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>1x Garden Fresh Salad</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success mr-2 w-5 h-5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>1x Iced Coffee</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <Link href="/voice-order">
                  <Button className="mt-4 bg-primary text-white font-medium py-2 px-6 rounded-lg w-full flex items-center justify-center" onClick={startVoiceRecognition}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 w-5 h-5">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <span>Try Voice Order</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Diet Analysis Demo */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 shadow-lg">
            <h3 className="font-semibold text-2xl mb-4">Diet Analysis</h3>
            <p className="text-neutral-800 mb-6">Get personalized nutrition insights based on your order history.</p>
            
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium">Your Nutrition Overview</h4>
                  <div className="text-sm text-neutral-500">Last 7 days</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-neutral-600">Protein</p>
                    <p className="font-bold text-lg">68<span className="text-xs font-normal">g</span></p>
                    <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-neutral-600">Carbs</p>
                    <p className="font-bold text-lg">210<span className="text-xs font-normal">g</span></p>
                    <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{width: '80%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-neutral-600">Fats</p>
                    <p className="font-bold text-lg">45<span className="text-xs font-normal">g</span></p>
                    <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                      <div className="bg-red-400 h-1.5 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium mb-2">AI Recommendation</h5>
                  <p className="text-sm text-neutral-700">
                    {dietRecommendation?.recommendation || "Based on your recent orders, try adding more vegetables and whole grains to balance your nutrition intake."}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="flex-1 bg-secondary/10 rounded-lg py-2 px-4 mr-2 mb-2 sm:mb-0">
                    <p className="text-xs text-neutral-600">Suggested items</p>
                    <p className="font-medium text-secondary">
                      {dietRecommendation?.suggestedItems?.join(', ') || "Quinoa Bowl, Garden Salad"}
                    </p>
                  </div>
                  <Link href="/diet-analysis">
                    <Button className="bg-secondary text-white font-medium py-2 px-6 rounded-lg whitespace-nowrap">
                      View Full Analysis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chatbot Demo */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg">
            <h3 className="font-semibold text-2xl mb-4">AI Assistant</h3>
            <p className="text-neutral-800 mb-6">Our intelligent chatbot helps with recommendations and answers questions.</p>
            
            <Card className="bg-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <div className="bg-accent rounded-full w-10 h-10 flex items-center justify-center text-white chatbot-animation" style={{ animation: 'pulse 2s infinite' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                      <path d="M7 12h10"></path>
                      <path d="M7 16h10"></path>
                      <path d="M10 9v3"></path>
                      <path d="M14 9v3"></path>
                    </svg>
                  </div>
                  <p className="ml-2 font-medium">CanteenBot</p>
                </div>
                
                <div className="space-y-3 mb-4 h-64 overflow-y-auto">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : ''}`}>
                      <div className={`${
                        message.role === 'user'
                          ? 'bg-neutral-100 rounded-xl rounded-tr-none'
                          : 'bg-accent/10 rounded-xl rounded-tl-none'
                        } py-2 px-4 max-w-[80%]`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center mt-4">
                  <input type="text" placeholder="Ask me anything..." className="w-full border border-neutral-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent" />
                  <Link href="/chatbot">
                    <Button className="ml-2 bg-accent text-white p-2 rounded-lg h-10 w-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Tracking Demo */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg">
            <h3 className="font-semibold text-2xl mb-4">Live Order Tracking</h3>
            <p className="text-neutral-800 mb-6">Track your order status in real-time from preparation to pickup.</p>
            
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-medium">Order #2847</h4>
                    <p className="text-sm text-neutral-500">Estimated ready in: 12 mins</p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 font-medium text-sm py-1 px-3 rounded-full">
                    In Preparation
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-1 bg-neutral-200"></div>
                  
                  <div className="flex items-center relative z-10 mb-6">
                    <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium">Order Received</h5>
                      <p className="text-sm text-neutral-500">10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center relative z-10 mb-6">
                    <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium">Payment Confirmed</h5>
                      <p className="text-sm text-neutral-500">10:31 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center relative z-10 mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white pulse-animation">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium">Preparation</h5>
                      <p className="text-sm text-neutral-500">Started 10:35 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center relative z-10 mb-6 opacity-50">
                    <div className="w-10 h-10 bg-neutral-300 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M5 18 L3 18 L3 16"></path>
                        <path d="M21 18 L23 18 L23 16"></path>
                        <path d="M21 6 L23 6 L23 8"></path>
                        <path d="M5 6 L3 6 L3 8"></path>
                        <rect x="3" y="6" width="18" height="12" rx="2"></rect>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium">Ready for Pickup</h5>
                      <p className="text-sm text-neutral-500">Estimated 10:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center relative z-10 opacity-50">
                    <div className="w-10 h-10 bg-neutral-300 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M17 14h.01"></path>
                        <path d="M7 14h.01"></path>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2"></path>
                        <path d="M8 18 C9.33 19.33 14.67 19.33 16 18"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium">Completed</h5>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}