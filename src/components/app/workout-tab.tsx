"use client";

import { useState, useTransition } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { generatePersonalizedWorkoutPlan } from '@/ai/flows/generate-personalized-workout-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Loader2, Plus, Trash2, Wand2 } from 'lucide-react';

type Exercise = { name: string; series: string; reps: string; rest: string; completed: boolean; id: number };
type WorkoutPlans = { [key: string]: Exercise[] };

export function WorkoutTab() {
  const { toast } = useToast();
  const [plans, setPlans] = useLocalStorage<WorkoutPlans>('my-workouts', { 'Workout A': [] });
  const [activePlan, setActivePlan] = useState(Object.keys(plans)[0] || '');

  const [isAddPlanOpen, setAddPlanOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');

  const [isAddExerciseOpen, setAddExerciseOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSeries, setExerciseSeries] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseRest, setExerciseRest] = useState('');
  
  const [isGenerating, startTransition] = useTransition();
  const [isGenerateOpen, setGenerateOpen] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState('beginner');
  const [goals, setGoals] = useState('');
  const [equipment, setEquipment] = useState('');

  const handleAddPlan = () => {
    if (newPlanName && !plans[newPlanName]) {
      const newPlans = { ...plans, [newPlanName]: [] };
      setPlans(newPlans);
      setActivePlan(newPlanName);
      setNewPlanName('');
      setAddPlanOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Plan name is invalid or already exists.",
      });
    }
  };
  
  const handleRemovePlan = (planName: string) => {
    if (Object.keys(plans).length <= 1) {
      toast({
        variant: "destructive",
        title: "Cannot remove",
        description: "You must have at least one workout plan.",
      });
      return;
    }
    const newPlans = { ...plans };
    delete newPlans[planName];
    setPlans(newPlans);
    setActivePlan(Object.keys(newPlans)[0]);
  };
  
  const handleAddExercise = () => {
    if (exerciseName && exerciseSeries && exerciseReps && exerciseRest) {
      const newExercise = { name: exerciseName, series: exerciseSeries, reps: exerciseReps, rest: exerciseRest, completed: false, id: Date.now() };
      const newPlans = { ...plans, [activePlan]: [...plans[activePlan], newExercise] };
      setPlans(newPlans);
      setExerciseName('');
      setExerciseSeries('');
      setExerciseReps('');
      setExerciseRest('');
      setAddExerciseOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all exercise fields.",
      });
    }
  };
  
  const handleRemoveExercise = (id: number) => {
    const newPlans = { ...plans, [activePlan]: plans[activePlan].filter(ex => ex.id !== id) };
    setPlans(newPlans);
  };
  
  const toggleExerciseComplete = (id: number) => {
    const newPlans = { ...plans, [activePlan]: plans[activePlan].map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex) };
    setPlans(newPlans);
  };
  
  const handleGeneratePlan = () => {
    if (!goals || !equipment) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide your goals and available equipment.',
      });
      return;
    }
    startTransition(async () => {
      try {
        const result = await generatePersonalizedWorkoutPlan({ fitnessLevel, goals, equipment });
        const parsedExercises: Exercise[] = result.workoutPlan.split('\n\n').map(exString => {
            const [name, details] = exString.split('\n');
            const seriesMatch = details?.match(/Series: ([\w\d\s-]+)/);
            const repsMatch = details?.match(/Reps: ([\w\d\s-]+)/);
            const restMatch = details?.match(/Rest: ([\w\d\s-]+)/);
            return {
                name: name || "Unnamed Exercise",
                series: seriesMatch?.[1] || '3',
                reps: repsMatch?.[1] || '10',
                rest: restMatch?.[1] || '60s',
                completed: false,
                id: Date.now() + Math.random(),
            };
        }).filter(ex => ex.name !== "Unnamed Exercise");
        
        const newPlanName = `AI Plan - ${new Date().toLocaleDateString()}`;
        const newPlans = { ...plans, [newPlanName]: parsedExercises };
        setPlans(newPlans);
        setActivePlan(newPlanName);

        toast({
          title: 'Workout Plan Generated!',
          description: `Your new plan "${newPlanName}" has been added.`,
        });
        setGenerateOpen(false);
        setGoals('');
        setEquipment('');

      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'Could not generate workout plan. Please try again.',
        });
      }
    });
  };

  const planNames = Object.keys(plans);

  return (
    <div className="space-y-6">
      <Tabs value={activePlan} onValueChange={setActivePlan} className="w-full">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <TabsList>
            {planNames.map(name => (
              <TabsTrigger key={name} value={name} className="relative group">
                {name}
                <button onClick={(e) => { e.stopPropagation(); handleRemovePlan(name); }} className="absolute -top-2 -right-2 bg-muted-foreground/50 hover:bg-destructive text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </TabsTrigger>
            ))}
          </TabsList>
          <Dialog open={isAddPlanOpen} onOpenChange={setAddPlanOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" /> Add Plan</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Add New Workout Plan</DialogTitle></DialogHeader>
              <Input placeholder="e.g. Leg Day" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} />
              <DialogFooter><Button onClick={handleAddPlan}>Save Plan</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {planNames.map(name => (
          <TabsContent key={name} value={name} className="space-y-4">
            {plans[name]?.length === 0 ? (
              <Card className="text-center py-12">
                <CardHeader>
                  <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
                  <CardTitle>Empty Workout</CardTitle>
                  <CardDescription>Add an exercise or generate a plan with AI to get started.</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plans[name].map(ex => (
                  <Card key={ex.id} className={ex.completed ? 'bg-accent/50' : ''}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        {ex.name}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveExercise(ex.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </CardTitle>
                      <CardDescription>{`Sets: ${ex.series} | Reps: ${ex.reps} | Rest: ${ex.rest}`}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`cb-${ex.id}`} checked={ex.completed} onCheckedChange={() => toggleExerciseComplete(ex.id)} />
                        <Label htmlFor={`cb-${ex.id}`} className="text-sm font-medium leading-none cursor-pointer">
                          Mark as completed
                        </Label>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex flex-wrap gap-4 pt-4 border-t">
        <Dialog open={isAddExerciseOpen} onOpenChange={setAddExerciseOpen}>
          <DialogTrigger asChild><Button disabled={!activePlan}><Plus className="mr-2 h-4 w-4" /> Add Exercise</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Exercise to {activePlan}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Exercise Name" value={exerciseName} onChange={e => setExerciseName(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Series" value={exerciseSeries} onChange={e => setExerciseSeries(e.target.value)} />
                <Input placeholder="Reps" value={exerciseReps} onChange={e => setExerciseReps(e.target.value)} />
                <Input placeholder="Rest" value={exerciseRest} onChange={e => setExerciseRest(e.target.value)} />
              </div>
            </div>
            <DialogFooter><Button onClick={handleAddExercise}>Save Exercise</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isGenerateOpen} onOpenChange={setGenerateOpen}>
          <DialogTrigger asChild><Button variant="secondary" disabled={!activePlan}><Wand2 className="mr-2 h-4 w-4" /> Generate with AI</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Generate Workout Plan</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Fitness Level</Label>
                <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Fitness Goals</Label><Textarea placeholder="e.g., Build muscle, lose weight" value={goals} onChange={e => setGoals(e.target.value)} /></div>
              <div><Label>Available Equipment</Label><Textarea placeholder="e.g., Dumbbells, resistance bands, treadmill" value={equipment} onChange={e => setEquipment(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button onClick={handleGeneratePlan} disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
