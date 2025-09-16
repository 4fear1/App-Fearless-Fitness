"use client";

import { useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Plus, Trash2 } from 'lucide-react';

type Exercise = { name: string; series: string; reps: string; rest: string; completed: boolean; id: number };
type WorkoutPlans = { [key: string]: Exercise[] };

export function WorkoutTab() {
  const { toast } = useToast();
  const [plans, setPlans] = useLocalStorage<WorkoutPlans>('my-workouts', { 'Treino A': [] });
  const [activePlan, setActivePlan] = useState(Object.keys(plans)[0] || '');

  const [isAddPlanOpen, setAddPlanOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');

  const [isAddExerciseOpen, setAddExerciseOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSeries, setExerciseSeries] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseRest, setExerciseRest] = useState('');
  
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
        title: "Erro",
        description: "O nome do plano é inválido ou já existe.",
      });
    }
  };
  
  const handleRemovePlan = (planName: string) => {
    if (Object.keys(plans).length <= 1) {
      toast({
        variant: "destructive",
        title: "Não é possível remover",
        description: "Você deve ter pelo menos um plano de treino.",
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
        title: "Erro",
        description: "Por favor, preencha todos os campos do exercício.",
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
  
  const planNames = Object.keys(plans);

  return (
    <div className="space-y-6">
      <Tabs value={activePlan} onValueChange={setActivePlan} className="w-full">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <TabsList>
            {planNames.map(name => (
              <TabsTrigger key={name} value={name} className="relative group">
                {name}
                <div role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); handleRemovePlan(name); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleRemovePlan(name); } }} className="absolute -top-2 -right-2 bg-muted-foreground/50 hover:bg-destructive text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Trash2 className="w-2.5 h-2.5" />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <Dialog open={isAddPlanOpen} onOpenChange={setAddPlanOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" /> Adicionar Plano</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Adicionar Novo Plano de Treino</DialogTitle></DialogHeader>
              <Input placeholder="ex: Dia de Perna" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} />
              <DialogFooter><Button onClick={handleAddPlan}>Salvar Plano</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {planNames.map(name => (
          <TabsContent key={name} value={name} className="space-y-4">
            {plans[name]?.length === 0 ? (
              <Card className="text-center py-12">
                <CardHeader>
                  <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
                  <CardTitle>Treino Vazio</CardTitle>
                  <CardDescription>Adicione um exercício para começar.</CardDescription>
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
                      <CardDescription>{`Séries: ${ex.series} | Repetições: ${ex.reps} | Descanso: ${ex.rest}`}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`cb-${ex.id}`} checked={ex.completed} onCheckedChange={() => toggleExerciseComplete(ex.id)} />
                        <Label htmlFor={`cb-${ex.id}`} className="text-sm font-medium leading-none cursor-pointer">
                          Marcar como concluído
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
          <DialogTrigger asChild><Button disabled={!activePlan}><Plus className="mr-2 h-4 w-4" /> Adicionar Exercício</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Adicionar Exercício a {activePlan}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nome do Exercício" value={exerciseName} onChange={e => setExerciseName(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Séries" value={exerciseSeries} onChange={e => setExerciseSeries(e.target.value)} />
                <Input placeholder="Repetições" value={exerciseReps} onChange={e => setExerciseReps(e.target.value)} />
                <Input placeholder="Descanso" value={exerciseRest} onChange={e => setExerciseRest(e.target.value)} />
              </div>
            </div>
            <DialogFooter><Button onClick={handleAddExercise}>Salvar Exercício</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
