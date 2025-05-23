import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getDietRecommendation } from "@/lib/openai";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function DietAnalysis() {
  const [period, setPeriod] = useState("week");

  // Diet analysis API call
  const { data: dietAnalysis, isLoading } = useQuery({
    queryKey: ["/api/diet-analysis/latest"],
  });

  // Get AI recommendation
  const { data: recommendation, isLoading: isRecommendationLoading } = useQuery({
    queryKey: ['/diet-recommendation'],
    queryFn: getDietRecommendation,
    enabled: !!dietAnalysis,
  });

  // Sample nutrition goals
  const nutritionGoals = [
    {
      name: "Protein",
      current: dietAnalysis?.totalProtein || 68,
      target: 90,
      unit: "g",
      color: "bg-blue-500",
    },
    {
      name: "Carbs",
      current: dietAnalysis?.totalCarbs || 210,
      target: 250,
      unit: "g",
      color: "bg-yellow-500",
    },
    {
      name: "Fats",
      current: dietAnalysis?.totalFats || 45,
      target: 60,
      unit: "g",
      color: "bg-red-400",
    },
    {
      name: "Calories",
      current: dietAnalysis?.totalCalories || 1850,
      target: 2000,
      unit: "kcal",
      color: "bg-green-500",
    },
  ];

  // Sample meal history (in a real app, this would come from the API)
  const mealHistory = [
    {
      date: "Today",
      meals: [
        { name: "Protein Quinoa Bowl", calories: 450, protein: 28, carbs: 42, fats: 18 },
        { name: "Iced Coffee", calories: 120, protein: 2, carbs: 18, fats: 4 },
      ],
    },
    {
      date: "Yesterday",
      meals: [
        { name: "Margherita Pizza", calories: 850, protein: 22, carbs: 95, fats: 32 },
        { name: "Garden Fresh Salad", calories: 250, protein: 5, carbs: 12, fats: 15 },
      ],
    },
    {
      date: "2 days ago",
      meals: [
        { name: "Chicken Burger", calories: 650, protein: 32, carbs: 45, fats: 28 },
        { name: "Creamy Pasta", calories: 750, protein: 18, carbs: 85, fats: 32 },
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Diet Analysis</h1>
              <p className="text-neutral-600">
                Track your nutrition intake and get personalized recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Nutrition Overview */}
              <div className="lg:col-span-2">
                <Card className="shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Nutrition Overview</CardTitle>
                    <Tabs defaultValue={period} onValueChange={setPeriod}>
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i}>
                            <div className="flex justify-between mb-2">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-6 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {nutritionGoals.map((goal) => (
                          <div key={goal.name}>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{goal.name}</span>
                              <span>
                                {goal.current} / {goal.target} {goal.unit}
                              </span>
                            </div>
                            <Progress
                              value={(goal.current / goal.target) * 100}
                              className="h-3"
                              indicatorClassName={goal.color}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 bg-neutral-100 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Nutrient Balance</h3>
                      <div className="flex items-center">
                        <div className="w-1/2 h-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-400 rounded-l-full"></div>
                        <div className="w-1/2 flex">
                          <div className="h-4 bg-blue-500 w-1/3 text-[8px] text-center text-white">P</div>
                          <div className="h-4 bg-yellow-500 w-1/3 text-[8px] text-center text-white">C</div>
                          <div className="h-4 bg-red-400 w-1/3 text-[8px] text-center text-white rounded-r-full">F</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-neutral-600">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendation */}
                <Card className="shadow-md mt-6">
                  <CardHeader>
                    <CardTitle className="text-xl">AI Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isRecommendationLoading ? (
                      <Skeleton className="h-24 w-full" />
                    ) : (
                      <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <p className="text-neutral-700">
                          {recommendation?.recommendation || dietAnalysis?.aiRecommendation || 
                            "Based on your recent orders, try adding more vegetables and whole grains to balance your nutrition intake."}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="flex-1 bg-secondary/10 rounded-lg py-2 px-4 mr-0 sm:mr-2 mb-4 sm:mb-0">
                        <p className="text-xs text-neutral-600">Suggested items</p>
                        <p className="font-medium text-secondary">
                          {recommendation?.suggestedItems?.join(', ') || "Quinoa Bowl, Garden Salad"}
                        </p>
                      </div>
                      
                      <Link href="/menu?filter=healthy">
                        <Button className="whitespace-nowrap bg-secondary text-white">
                          Browse Healthy Options
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Meal History */}
              <div>
                <Card className="shadow-md h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Meals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mealHistory.map((day, index) => (
                        <div key={index}>
                          <h3 className="font-medium text-sm text-neutral-500 mb-2">{day.date}</h3>
                          <div className="space-y-3">
                            {day.meals.map((meal, mealIndex) => (
                              <div key={mealIndex} className="bg-white border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">{meal.name}</span>
                                  <span className="text-sm text-neutral-500">
                                    {meal.calories} kcal
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="bg-blue-50 p-1 rounded text-center">
                                    <span className="block text-blue-700">{meal.protein}g</span>
                                    <span className="text-neutral-500">Protein</span>
                                  </div>
                                  <div className="bg-yellow-50 p-1 rounded text-center">
                                    <span className="block text-yellow-700">{meal.carbs}g</span>
                                    <span className="text-neutral-500">Carbs</span>
                                  </div>
                                  <div className="bg-red-50 p-1 rounded text-center">
                                    <span className="block text-red-700">{meal.fats}g</span>
                                    <span className="text-neutral-500">Fats</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button variant="outline">View Complete History</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Health Tips */}
            <Card className="shadow-md mt-8">
              <CardHeader>
                <CardTitle className="text-xl">Healthy Eating Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.1 2.87a2.5 2.5 0 0 1 4 0l2.28 3.65a2.5 2.5 0 0 1-2 3.98H15.8a2.5 2.5 0 0 1-2-3.98z"></path>
                        <path d="M10.85 9.5h3.3L12 5.5z"></path>
                        <path d="M8.9 14.5H5.1a2.5 2.5 0 0 1-2-3.98l2.28-3.65a2.5 2.5 0 0 1 4 0l2.28 3.65a2.5 2.5 0 0 1-2 3.98z"></path>
                        <path d="M7.85 9.5 6 6l-1.85 3.5"></path>
                        <path d="M17.1 19.5H5.1a2.5 2.5 0 0 1-2-3.98l2.28-3.65a2.5 2.5 0 0 1 4 0l2.28 3.65a2.5 2.5 0 0 1-2 3.98z"></path>
                        <path d="M16.85 14.5 15 11l-1.85 3.5"></path>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Eat more plants</h3>
                    <p className="text-sm text-neutral-700">
                      Aim to fill half your plate with vegetables and fruits at each meal for essential vitamins and minerals.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3v3M16 3v3M4 11h16M6 19h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Regular meal timing</h3>
                    <p className="text-sm text-neutral-700">
                      Eating at consistent times helps regulate your metabolism and maintain steady energy levels.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20v-6M6 20V10M18 20V4"></path>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Balance is key</h3>
                    <p className="text-sm text-neutral-700">
                      Include a good balance of protein, healthy fats, and complex carbohydrates in each meal.
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