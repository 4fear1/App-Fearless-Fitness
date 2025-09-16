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
      setResult(`You should drink about ${ml} ml (${(+ml / 1000).toFixed(2)} L) of water per day.`);
    } else {
      setResult('Please enter a valid weight.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="text-primary" />
          Daily Water Intake
        </CardTitle>
        <CardDescription>Estimate your daily hydration needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="weight-water">Your Weight (kg)</Label>
          <Input
            id="weight-water"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 70"
            aria-label="Weight for water calculation"
          />
        </div>
        <Button onClick={calculateWater} className="w-full">Calculate</Button>
      </CardContent>
      {result && (
        <CardFooter>
          <p className="text-sm font-medium text-center w-full text-primary">{result}</p>
        </CardFooter>
      )}
    </Card>
  );
}
