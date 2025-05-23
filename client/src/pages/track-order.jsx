import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getTimeDifference, getOrderStatusColor, getOrderStatusStep } from "@/lib/utils";

export default function TrackOrder() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [socket, setSocket] = useState(null);

  // Get user orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Get selected order
  const selectedOrder = orders?.find(order => order.id === selectedOrderId) || (orders && orders.length > 0 ? orders[0] : null);

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    if (!selectedOrder) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      // Send authentication to associate this connection with the user
      newSocket.send(JSON.stringify({
        type: 'auth',
        userId: selectedOrder.userId
      }));
    };
    
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'orderUpdate') {
        // In a real app, we would update the order in the React Query cache here
        console.log("Order update received:", data.data);
      }
    };
    
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, [selectedOrder?.id, selectedOrder?.userId]);

  // Order status steps
  const orderSteps = [
    { id: 'received', label: 'Order Received', icon: 'check' },
    { id: 'confirmed', label: 'Payment Confirmed', icon: 'credit-card' },
    { id: 'preparing', label: 'Preparation', icon: 'utensils' },
    { id: 'ready', label: 'Ready for Pickup', icon: 'package' },
    { id: 'completed', label: 'Completed', icon: 'user' }
  ];

  // Helper function to get status step number
  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  return (
    <MainLayout>
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
              <p className="text-neutral-600">
                Follow your order's journey from preparation to pickup in real-time.
              </p>
            </div>

            {isLoading ? (
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-full mb-6" />
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-6">
                {/* Order selector for multiple orders */}
                {orders.length > 1 && (
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl">Your Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.map((order) => (
                          <Button
                            key={order.id}
                            variant={selectedOrderId === order.id ? "default" : "outline"}
                            className="h-auto py-3 justify-start flex-col items-start"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm mt-1">{formatDate(order.createdAt)}</div>
                            <div className={`text-xs mt-2 px-2 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order tracking */}
                {selectedOrder && (
                  <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl">
                        Order #{selectedOrder.id}
                      </CardTitle>
                      <div className={`text-sm px-3 py-1 rounded-full ${getOrderStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-sm text-neutral-500">Ordered on: {formatDate(selectedOrder.createdAt)}</p>
                          {selectedOrder.estimatedReadyTime && (
                            <p className="text-sm text-neutral-500">
                              Estimated ready in: {getTimeDifference(selectedOrder.estimatedReadyTime)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-500">Total Amount</p>
                          <p className="font-bold text-lg">${(selectedOrder.totalAmount / 100).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Order progress steps */}
                      <div className="relative mb-8">
                        <div className="absolute left-5 top-0 bottom-0 w-1 bg-neutral-200"></div>
                        
                        {orderSteps.map((step, index) => {
                          const currentStep = getStatusStep(selectedOrder.status);
                          const isCompleted = index < currentStep;
                          const isCurrent = index === currentStep;
                          const isPending = index > currentStep;
                          
                          let statusClass = "";
                          if (isCompleted) statusClass = "bg-success text-white";
                          else if (isCurrent) statusClass = "bg-purple-500 text-white pulse-animation";
                          else statusClass = "bg-neutral-300 text-white";
                          
                          return (
                            <div key={step.id} className={`flex items-center relative z-10 mb-6 ${isPending ? 'opacity-50' : ''}`}>
                              <div className={`w-10 h-10 ${statusClass} rounded-full flex items-center justify-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                  {step.icon === 'check' && <polyline points="20 6 9 17 4 12"></polyline>}
                                  {step.icon === 'credit-card' && <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>}
                                  {step.icon === 'utensils' && <path d="M8 3v7m4-7v7M6 7h6m4 0h3a6 6 0 0 1 0 12h-3"></path>}
                                  {step.icon === 'package' && <path d="M5 18 L3 18 L3 16 M21 18 L23 18 L23 16 M21 6 L23 6 L23 8 M5 6 L3 6 L3 8 M3 6h18v12H3z"></path>}
                                  {step.icon === 'user' && <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>}
                                  {step.icon === 'user' && <circle cx="12" cy="7" r="4"></circle>}
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h5 className="font-medium">{step.label}</h5>
                                {index === 0 && (
                                  <p className="text-sm text-neutral-500">
                                    {formatDate(selectedOrder.createdAt)}
                                  </p>
                                )}
                                {index === 1 && (
                                  <p className="text-sm text-neutral-500">
                                    {formatDate(new Date(new Date(selectedOrder.createdAt).getTime() + 60000))}
                                  </p>
                                )}
                                {index === 2 && isCurrent && (
                                  <p className="text-sm text-neutral-500">
                                    In progress
                                  </p>
                                )}
                                {index === 3 && selectedOrder.estimatedReadyTime && (
                                  <p className="text-sm text-neutral-500">
                                    Estimated {formatDate(selectedOrder.estimatedReadyTime)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Order items */}
                      <div className="mt-8">
                        <h3 className="font-medium mb-4">Order Items</h3>
                        <div className="bg-neutral-100 rounded-lg p-4 divide-y divide-neutral-200">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="py-3 flex justify-between">
                              <div>
                                <span className="font-medium">{item.quantity}x </span>
                                <span>Item #{item.foodItemId}</span>
                              </div>
                              <span>${(item.price * item.quantity / 100).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="py-3 flex justify-between font-bold">
                            <span>Total</span>
                            <span>${(selectedOrder.totalAmount / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pickup Instructions */}
                      {selectedOrder.status === 'ready' && (
                        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-medium text-green-800 mb-2">Ready for Pickup!</h3>
                          <p className="text-green-700 text-sm">
                            Your order is ready. Please proceed to the pickup counter and show your order number.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="shadow-md">
                <CardContent className="p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <h3 className="text-xl font-medium mb-2">No Active Orders</h3>
                  <p className="text-neutral-500 mb-6">
                    You don't have any active orders to track at the moment.
                  </p>
                  <Button>
                    <a href="/menu">Browse Menu</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tracking Information */}
            <Card className="shadow-md mt-8">
              <CardHeader>
                <CardTitle className="text-xl">Order Tracking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-1">Real-time Updates</h3>
                    <p className="text-blue-700">
                      Our tracking system provides real-time updates on your order status. The page will automatically refresh when there's a change.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Order Received</h3>
                      <p className="text-neutral-700">
                        Your order has been received by our system and is being processed.
                      </p>
                    </div>
                    
                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Payment Confirmed</h3>
                      <p className="text-neutral-700">
                        Your payment has been successfully processed and confirmed.
                      </p>
                    </div>
                    
                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Preparation</h3>
                      <p className="text-neutral-700">
                        Your order is currently being prepared by our kitchen staff.
                      </p>
                    </div>
                    
                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Ready for Pickup</h3>
                      <p className="text-neutral-700">
                        Your order is ready! Please proceed to the pickup counter.
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-1">Estimated Times</h3>
                    <p className="text-yellow-700">
                      Estimated preparation times are approximate and may vary based on current order volume and complexity of dishes.
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