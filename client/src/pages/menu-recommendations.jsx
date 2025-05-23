import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { Loader2, InfoIcon, ThumbsUp } from 'lucide-react';
import { getMenuRecommendations } from '@/lib/openai';

// UI components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'low-carb', label: 'Low Carb' },
  { id: 'high-protein', label: 'High Protein' },
  { id: 'low-fat', label: 'Low Fat' },
  { id: 'low-calorie', label: 'Low Calorie' }
];

const preferenceOptions = [
  { id: 'spicy', label: 'Spicy' },
  { id: 'sweet', label: 'Sweet' },
  { id: 'savory', label: 'Savory' },
  { id: 'fresh', label: 'Fresh' },
  { id: 'comfort-food', label: 'Comfort Food' }
];

const mealTypeOptions = [
  { id: 'any', label: 'Any Meal' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' }
];

export default function MenuRecommendations() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState([]);
  const [dietaryRequirements, setDietaryRequirements] = useState([]);
  const [mealType, setMealType] = useState('any');
  const [recommendations, setRecommendations] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Load recommendations on initial load if user is logged in
  useEffect(() => {
    if (user && !recommendations && !isGenerating) {
      generateRecommendations();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const togglePreference = (id) => {
    setPreferences(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleDietaryRequirement = (id) => {
    setDietaryRequirements(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleMealTypeChange = (value) => {
    setMealType(value);
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const data = await getMenuRecommendations(preferences, dietaryRequirements, mealType);
      setRecommendations(data);
      toast({
        title: "Recommendations Generated",
        description: "Your personalized menu recommendations are ready!",
      });
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const showFoodDetails = (food) => {
    setSelectedFood(food);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Menu Recommendations</h1>
          <p className="text-muted-foreground">
            Get personalized menu recommendations based on your preferences and dietary requirements.
          </p>
        </div>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
                <CardDescription>
                  Customize your recommendations by selecting your preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Meal Type</h3>
                    <Select value={mealType} onValueChange={handleMealTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypeOptions.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Taste Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                      {preferenceOptions.map(option => (
                        <Badge 
                          key={option.id} 
                          variant={preferences.includes(option.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => togglePreference(option.id)}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Dietary Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map(option => (
                        <Badge 
                          key={option.id} 
                          variant={dietaryRequirements.includes(option.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleDietaryRequirement(option.id)}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={generateRecommendations} 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Recommendations'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            {isGenerating ? (
              <Card className="flex flex-col items-center justify-center min-h-[400px]">
                <CardContent className="pt-6 text-center">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
                  <h3 className="text-lg font-medium mb-2">Generating Your AI Recommendations</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Our AI is analyzing your preferences, dietary requirements, and previous orders to create personalized recommendations just for you.
                  </p>
                </CardContent>
              </Card>
            ) : recommendations ? (
              <div className="space-y-6">
                {recommendations.personalizedMessage && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 flex items-start gap-4">
                      <InfoIcon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">Personalized Recommendation</h3>
                        <p className="text-sm text-muted-foreground">
                          {recommendations.personalizedMessage}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Tabs defaultValue="recommendations" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recommendations">Top Recommendations</TabsTrigger>
                    <TabsTrigger value="healthy">Healthy Alternatives</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recommendations" className="space-y-4 pt-4">
                    {recommendations.topRecommendations?.length > 0 ? (
                      recommendations.topRecommendations.map((item, index) => (
                        <Card key={`rec-${index}`} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {item.image && (
                              <div className="md:w-1/3">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-48 md:h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className={`flex-1 p-4 ${!item.image ? 'md:w-full' : ''}`}>
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <Badge variant={item.isHealthy ? "default" : "secondary"}>
                                  {item.isHealthy ? "Healthy" : item.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 mb-3">
                                {item.description}
                              </p>
                              <div className="text-sm flex flex-wrap gap-2 mb-3">
                                <span className="text-primary font-medium">${item.price?.toFixed(2)}</span>
                                {item.calories && <span>{item.calories} cal</span>}
                              </div>
                              <div className="bg-muted/50 rounded-md p-3 mb-3">
                                <div className="flex items-start gap-2">
                                  <ThumbsUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <p className="text-sm">{item.reason}</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => showFoodDetails(item)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recommendations available</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="healthy" className="space-y-4 pt-4">
                    {recommendations.healthyAlternatives?.length > 0 ? (
                      recommendations.healthyAlternatives.map((item, index) => (
                        <Card key={`healthy-${index}`} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {item.image && (
                              <div className="md:w-1/3">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-48 md:h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className={`flex-1 p-4 ${!item.image ? 'md:w-full' : ''}`}>
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <Badge variant="default">Healthy</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 mb-3">
                                {item.description}
                              </p>
                              <div className="text-sm flex flex-wrap gap-2 mb-3">
                                <span className="text-primary font-medium">${item.price?.toFixed(2)}</span>
                                {item.calories && <span>{item.calories} cal</span>}
                              </div>
                              <div className="bg-muted/50 rounded-md p-3 mb-3">
                                <div className="flex items-start gap-2">
                                  <ThumbsUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <p className="text-sm">{item.reason}</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => showFoodDetails(item)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No healthy alternatives available</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center pt-6">
                  <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Use the options on the left to generate personalized AI menu recommendations based on your preferences.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Food Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedFood && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedFood.name}</DialogTitle>
              <DialogDescription>
                {selectedFood.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedFood.image && (
                <div className="rounded-md overflow-hidden">
                  <img 
                    src={selectedFood.image} 
                    alt={selectedFood.name} 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Badge variant={selectedFood.isHealthy ? "default" : "secondary"}>
                  {selectedFood.isHealthy ? "Healthy" : selectedFood.category}
                </Badge>
                <Badge variant="outline">${selectedFood.price?.toFixed(2)}</Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-medium">{selectedFood.calories || "N/A"}</p>
                </div>
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-medium">{selectedFood.protein ? `${selectedFood.protein}g` : "N/A"}</p>
                </div>
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-medium">{selectedFood.carbs ? `${selectedFood.carbs}g` : "N/A"}</p>
                </div>
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="text-xs text-muted-foreground">Fats</p>
                  <p className="font-medium">{selectedFood.fats ? `${selectedFood.fats}g` : "N/A"}</p>
                </div>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                <h4 className="font-medium mb-1">Why we recommend this</h4>
                <p className="text-sm">{selectedFood.reason}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>Close</Button>
              <Button>Add to Order</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}