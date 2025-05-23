import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Chatbot from "@/components/chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ChatbotPage() {
  return (
    <MainLayout>
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">AI Assistant</h1>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Our intelligent chatbot helps with menu recommendations, answers your questions, and provides personalized assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="shadow-md h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl">Chat with CanteenBot</CardTitle>
                    <CardDescription>
                      Ask about menu items, dietary information, or get personalized recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden">
                    <Chatbot />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar with Help Topics */}
              <div>
                <Card className="shadow-md mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl">Popular Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="food" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="food">Food</TabsTrigger>
                        <TabsTrigger value="dietary">Dietary</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                      </TabsList>
                      <TabsContent value="food" className="space-y-4 mt-4">
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          What are your most popular dishes?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          What's on the breakfast menu?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          Do you serve vegetarian options?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          What's your chef's special today?
                        </div>
                      </TabsContent>
                      <TabsContent value="dietary" className="space-y-4 mt-4">
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          Which dishes are gluten-free?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          I'm looking for low-calorie options
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          Do you have dairy-free alternatives?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          What's high in protein on your menu?
                        </div>
                      </TabsContent>
                      <TabsContent value="orders" className="space-y-4 mt-4">
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          How do I track my order?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          Can I modify my order after placing it?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          What payment methods do you accept?
                        </div>
                        <div className="bg-neutral-100 p-3 rounded-lg text-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                          How long does delivery usually take?
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">Also Try</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-accent/10 rounded-lg p-4">
                      <h3 className="font-medium text-accent mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                        Voice Ordering
                      </h3>
                      <p className="text-sm text-neutral-700 mb-3">
                        Prefer speaking? Try our voice ordering feature for a hands-free experience.
                      </p>
                      <Link href="/voice-order">
                        <Button variant="outline" className="w-full">
                          Try Voice Ordering
                        </Button>
                      </Link>
                    </div>

                    <div className="bg-secondary/10 rounded-lg p-4">
                      <h3 className="font-medium text-secondary mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4.5 12.5l3 3 8.5-8.5"></path>
                          <path d="M20 12a8 8 0 1 1-9.5-7.8"></path>
                        </svg>
                        Diet Analysis
                      </h3>
                      <p className="text-sm text-neutral-700 mb-3">
                        Get personalized nutrition insights based on your order history.
                      </p>
                      <Link href="/diet-analysis">
                        <Button variant="outline" className="w-full">
                          View Diet Analysis
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">AI Assistant Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <path d="M11 11v-3"></path>
                        <path d="M11 11H8"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Menu Assistance</h3>
                    <p className="text-neutral-600">
                      Get detailed information about any menu item, including ingredients, allergens, and preparation methods.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Personalized Recommendations</h3>
                    <p className="text-neutral-600">
                      Receive tailored meal suggestions based on your taste preferences, dietary requirements, and previous orders.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v8"></path>
                        <path d="m4.93 10.93 1.41 1.41"></path>
                        <path d="M2 18h2"></path>
                        <path d="M20 18h2"></path>
                        <path d="m19.07 10.93-1.41 1.41"></path>
                        <path d="M22 22H2"></path>
                        <path d="M16 6a4 4 0 0 0-8 0"></path>
                        <path d="M16 18a4 4 0 0 0-8 0"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Order Assistance</h3>
                    <p className="text-neutral-600">
                      Get help with placing orders, tracking status, and resolving issues with delivery or pickup.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="mt-12 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">How accurate is the AI assistant?</h3>
                    <p className="text-neutral-600 text-sm">
                      Our AI assistant is powered by advanced natural language processing and is continuously trained on our menu and operations. While it's highly accurate, it's always learning and improving.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Is my conversation data private?</h3>
                    <p className="text-neutral-600 text-sm">
                      Yes, all conversations are encrypted and your personal data is protected. We may anonymously use conversation data to improve our services.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Can the AI place orders for me?</h3>
                    <p className="text-neutral-600 text-sm">
                      Yes, the AI can guide you through the ordering process and add items to your cart, but you'll need to confirm and complete the checkout process.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">What if the AI can't answer my question?</h3>
                    <p className="text-neutral-600 text-sm">
                      If the AI is unable to assist you, it will offer to connect you with a human representative or provide alternative ways to get the information you need.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}