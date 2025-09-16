"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Droplets } from 'lucide-react';
import { Label } from '../ui/label';

export function WaterCalculator() {
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState('');

  const calculateWater = () => {
    const w = parseFloat(weight);
    if (w > 0) {
      const ml = (w * 35).toFixed(0);
      setResult(`Você deve beber cerca de ${ml} ml (${(+ml / 1000).toFixed(2)} L) de água por dia.`);
    } else {
      setResult('Por favor, insira um peso válido.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="text-primary" />
          Consumo Diário de Água
        </CardTitle>
        <CardDescription>Estime suas necessidades diárias de hidratação.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="weight-water">Seu Peso (kg)</Label>
          <Input
            id="weight-water"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="ex: 70"
            aria-label="Peso para cálculo de água"
          />
        </div>
        <Button onClick={calculateWater} className="w-full">Calcular</Button>
      </CardContent>
      {result && (
        <CardFooter>
          <p className="text-sm font-medium text-center w-full text-primary">{result}</p>
        </CardFooter>
      )}
    </Card>
  );
}
