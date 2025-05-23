import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateQRCode } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

export default function QRMenu() {
  const [qrCode, setQrCode] = useState("");
  const [tableNumber, setTableNumber] = useState("1");
  const [qrType, setQrType] = useState("table");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch food items
  const { data: foodItems } = useQuery({
    queryKey: ["/api/food-items"],
  });

  // Categories for filtering
  const categories = foodItems 
    ? [...new Set(foodItems.map(item => item.category))]
    : ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Healthy"];

  const handleGenerateTableQR = () => {
    const menuUrl = `${window.location.origin}/menu?table=${tableNumber}`;
    const qrCodeUrl = generateQRCode(menuUrl);
    setQrCode(qrCodeUrl);
  };

  const handleGenerateCategoryQR = () => {
    const menuUrl = `${window.location.origin}/menu?filter=${selectedCategory}`;
    const qrCodeUrl = generateQRCode(menuUrl);
    setQrCode(qrCodeUrl);
  };

  return (
    <MainLayout>
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">QR Code Menu</h1>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Generate QR codes for easy menu access. Scan with your smartphone to browse our menu and place orders directly from your table.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* QR Code Generator */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Generate QR Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={qrType} value={qrType} onValueChange={setQrType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="table">Table QR</TabsTrigger>
                      <TabsTrigger value="category">Category QR</TabsTrigger>
                    </TabsList>

                    <TabsContent value="table" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tableNumber">Select Table Number</Label>
                        <Select 
                          value={tableNumber} 
                          onValueChange={setTableNumber}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a table" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                Table {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleGenerateTableQR} 
                        className="w-full"
                      >
                        Generate Table QR Code
                      </Button>
                      <p className="text-sm text-neutral-500">
                        This QR code will direct customers to the menu for table {tableNumber}.
                      </p>
                    </TabsContent>

                    <TabsContent value="category" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Select Food Category</Label>
                        <Select 
                          value={selectedCategory} 
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleGenerateCategoryQR} 
                        className="w-full"
                        disabled={!selectedCategory}
                      >
                        Generate Category QR Code
                      </Button>
                      <p className="text-sm text-neutral-500">
                        This QR code will direct customers to {selectedCategory || "selected"} menu items.
                      </p>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">QR Code Usage Guide</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>Print and place QR codes on tables for easy customer access.</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>Add category QR codes to promotional materials and displays.</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>Customers can scan with any smartphone camera - no app needed.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Display */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Your QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center min-h-[300px]">
                    {qrCode ? (
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                          <img 
                            src={qrCode} 
                            alt="Generated QR code" 
                            className="max-w-full h-auto"
                          />
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" onClick={() => window.open(qrCode, '_blank')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                          </Button>
                          <Button variant="outline" onClick={() => setQrCode("")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20v-6M6 20V10M18 20V4"></path>
                            </svg>
                            Reset
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="border-4 border-neutral-200 w-48 h-48 flex flex-col items-center justify-center text-neutral-400 mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <rect x="7" y="7" width="3" height="3"></rect>
                            <rect x="14" y="7" width="3" height="3"></rect>
                            <rect x="7" y="14" width="3" height="3"></rect>
                            <rect x="14" y="14" width="3" height="3"></rect>
                          </svg>
                          <p className="text-sm font-medium">QR Code Preview</p>
                          <p className="text-xs">Generate to view</p>
                        </div>
                        <p className="mt-4 text-neutral-600">
                          Select options and click generate to create your QR code.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Section */}
            <div className="mt-12 bg-neutral-900 text-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6">Benefits of QR Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <h3 className="text-lg font-semibold mb-2">Faster Service</h3>
                  </div>
                  <p className="text-neutral-300">
                    Customers can place orders directly from their table without waiting for staff, reducing wait times and increasing table turnover.
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Eco-Friendly</h3>
                  </div>
                  <p className="text-neutral-300">
                    Reduce paper waste by eliminating the need for printed menus. Update your digital menu instantly without reprinting.
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 11h.01"></path>
                        <path d="M11 15h.01"></path>
                        <path d="M16 16h.01"></path>
                        <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"></path>
                        <path d="M5.71 17.11A17.04 17.04 0 0 1 7.6 10"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Better Hygiene</h3>
                  </div>
                  <p className="text-neutral-300">
                    Contactless ordering reduces the handling of physical menus, promoting better hygiene and health safety.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/menu">
                  <Button className="bg-white text-neutral-900 hover:bg-neutral-100 transition-colors">
                    Browse Our Menu
                  </Button>
                </Link>
              </div>
            </div>

            {/* How it Works Section */}
            <Card className="mt-8 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-medium mb-2">Generate QR</h3>
                    <p className="text-sm text-neutral-600">
                      Create QR codes for tables or menu categories
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-medium mb-2">Place QR Codes</h3>
                    <p className="text-sm text-neutral-600">
                      Put the QR codes on tables or display stands
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-medium mb-2">Customers Scan</h3>
                    <p className="text-sm text-neutral-600">
                      Diners scan with their smartphone camera
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-lg">4</span>
                    </div>
                    <h3 className="font-medium mb-2">Order & Enjoy</h3>
                    <p className="text-sm text-neutral-600">
                      They browse, order, and enjoy their meal
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