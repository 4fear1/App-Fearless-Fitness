"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';
import { Label } from '../ui/label';

export function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState('');

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      let status = '';
      if (bmi < 18.5) status = 'Underweight';
      else if (bmi < 25) status = 'Normal weight';
      else if (bmi < 30) status = 'Overweight';
      else status = 'Obesity';
      setResult(`Your BMI is ${bmi.toFixed(1)} (${status}).`);
    } else {
      setResult('Please enter valid weight and height.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="text-primary" />
          BMI Calculator
        </CardTitle>
        <CardDescription>Calculate your Body Mass Index.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight-bmi">Weight (kg)</Label>
            <Input id="weight-bmi" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 70" />
          </div>
          <div>
            <Label htmlFor="height-bmi">Height (m)</Label>
            <Input id="height-bmi" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 1.75" />
          </div>
        </div>
        <Button onClick={calculateBmi} className="w-full">Calculate</Button>
      </CardContent>
      {result && (
        <CardFooter>
          <p className="text-sm font-medium text-center w-full text-primary">{result}</p>
        </CardFooter>
      )}
    </Card>
  );
}
