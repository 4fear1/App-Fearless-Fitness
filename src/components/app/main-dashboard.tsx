"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutTab } from '@/components/app/workout-tab';
import { DietTab } from '@/components/app/diet-tab';
import { CalculatorsTab } from '@/components/app/calculators-tab';
import { Dumbbell, Utensils, Calculator } from 'lucide-react';

export function MainDashboard() {
  return (
    <Tabs defaultValue="workout" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-14 rounded-lg">
        <TabsTrigger value="workout" className="text-sm md:text-base h-full gap-2 rounded-l-md">
          <Dumbbell className="h-5 w-5" />
          Treino
        </TabsTrigger>
        <TabsTrigger value="diet" className="text-sm md:text-base h-full gap-2">
          <Utensils className="h-5 w-5" />
          Dieta
        </TabsTrigger>
        <TabsTrigger value="calculators" className="text-sm md:text-base h-full gap-2 rounded-r-md">
          <Calculator className="h-5 w-5" />
          Calculadoras
        </TabsTrigger>
      </TabsList>
      <TabsContent value="workout" className="mt-6">
        <WorkoutTab />
      </TabsContent>
      <TabsContent value="diet" className="mt-6">
        <DietTab />
      </TabsContent>
      <TabsContent value="calculators" className="mt-6">
        <CalculatorsTab />
      </TabsContent>
    </Tabs>
  );
}
