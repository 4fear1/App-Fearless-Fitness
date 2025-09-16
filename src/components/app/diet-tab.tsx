"use client";

import { useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Meal = { name: string; description: string; id: number };

export function DietTab() {
  const [meals, setMeals] = useLocalStorage<Meal[]>('my-diet', []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const { toast } = useToast();

  const handleAddMeal = () => {
    if (mealName && mealDesc) {
      setMeals([...meals, { name: mealName, description: mealDesc, id: Date.now() }]);
      setMealName('');
      setMealDesc('');
      setModalOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all meal fields.",
      });
    }
  };

  const handleRemoveMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-headline">My Meals</h2>
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Meal Name (e.g., Breakfast)"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
              <Textarea
                placeholder="Description of food items"
                value={mealDesc}
                onChange={(e) => setMealDesc(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddMeal}>Save Meal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {meals.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>No Meals Logged</CardTitle>
            <CardDescription>Click "Add Meal" to start tracking your diet.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader>
                <CardTitle>{meal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{meal.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveMeal(meal.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
