import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceRecognition } from "@/lib/voice-recognition";
import { processVoiceOrder } from "@/lib/openai";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function VoiceOrder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognizedItems, setRecognizedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  // Check if browser supports speech recognition
  useEffect(() => {
    const recognition = new VoiceRecognition();
    setIsBrowserSupported(recognition.isSupported());
  }, []);

  const startVoiceRecognition = () => {
    if (!isBrowserSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    // Reset states
    setTranscript("");
    setRecognizedItems([]);
    setIsListening(true);

    const recognition = new VoiceRecognition({
      onStart: () => {
        setIsListening(true);
      },
      onResult: (text) => {
        setTranscript(text);
      },
      onEnd: async () => {
        setIsListening(false);
        if (transcript) {
          setIsProcessing(true);
          try {
            const response = await processVoiceOrder(transcript);
            setRecognizedItems(response.recognizedOrder);
          } catch (error) {
            console.error("Error processing voice order:", error);
            toast({
              title: "Processing Error",
              description: "We couldn't process your voice order. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        }
      },
      onError: (error) => {
        console.error("Voice recognition error:", error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: error,
          variant: "destructive",
        });
      }
    });

    recognition.start();
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
  };

  const addToCart = () => {
    if (recognizedItems.length === 0) return;

    setIsAddingToCart(true);
    // Get current cart from query cache or initialize empty array
    const currentCart = queryClient.getQueryData(['/cart-items']) || [];
    
    // Add recognized items to cart
    queryClient.setQueryData(['/cart-items'], [
      ...currentCart,
      ...recognizedItems
    ]);
    
    setTimeout(() => {
      setIsAddingToCart(false);
      toast({
        title: "Added to cart",
        description: `${recognizedItems.length} item(s) added to your cart`,
      });
      setRecognizedItems([]);
      setTranscript("");
    }, 1000);
  };

  // Calculate total price
  const totalPrice = recognizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <MainLayout>
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Voice Ordering</h1>
              <p className="text-neutral-600">
                Just speak naturally to place your order. Our AI will understand your preferences.
              </p>
            </div>

            <Card className="mb-8 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Speak Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <div className={`flex items-end space-x-1 h-20 ${isListening ? '' : 'opacity-30'}`}>
                    <div className="w-3 h-10 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '-0.3s' }}></div>
                    <div className="w-3 h-16 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '-0.2s' }}></div>
                    <div className="w-3 h-20 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '-0.1s' }}></div>
                    <div className="w-3 h-14 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none' }}></div>
                    <div className="w-3 h-8 bg-primary mx-1 rounded voice-wave" style={{ animation: isListening ? 'wave 1.5s infinite' : 'none', animationDelay: '0.1s' }}></div>
                  </div>
                </div>

                <div className="mb-6 text-center">
                  <p className="text-sm text-neutral-500 mb-2">Try saying something like:</p>
                  <p className="italic text-neutral-700">"I'd like to order a garden salad and an iced coffee, please."</p>
                </div>

                <div className="bg-neutral-100 rounded-lg p-4 mb-6">
                  <p className="font-medium mb-2">Your voice input:</p>
                  <p className="text-neutral-800">{transcript || "Your spoken order will appear here..."}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {isListening ? (
                    <Button
                      onClick={stopVoiceRecognition}
                      variant="destructive"
                      size="lg"
                      className="gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="6" width="12" height="12"></rect>
                      </svg>
                      Stop Listening
                    </Button>
                  ) : (
                    <Button
                      onClick={startVoiceRecognition}
                      size="lg"
                      className="bg-primary text-white gap-2"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                          </svg>
                          Start Voice Order
                        </>
                      )}
                    </Button>
                  )}

                  <Link href="/menu">
                    <Button variant="outline" size="lg" className="gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M3 12h18M3 18h18"></path>
                      </svg>
                      Browse Menu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recognized Items */}
            {(recognizedItems.length > 0 || isProcessing) && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Recognized Order</CardTitle>
                </CardHeader>
                <CardContent>
                  {isProcessing ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <ul className="mb-6 divide-y">
                        {recognizedItems.map((item, index) => (
                          <li key={index} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 h-5 w-5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              <span className="font-medium">
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            <span className="text-neutral-700">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex justify-between items-center border-t pt-4">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-lg">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <Button 
                          onClick={addToCart} 
                          size="lg" 
                          className="bg-primary text-white gap-2"
                          disabled={isAddingToCart}
                        >
                          {isAddingToCart ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Adding to Cart...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                              </svg>
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Voice Tips */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">Voice Ordering Tips</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Speak clearly and at a normal pace.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Mention the quantity and the exact name of the items.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>You can say things like "I'd like to order..." or "I want..."</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>If you need to restart, just click "Stop Listening" and then "Start Voice Order" again.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}