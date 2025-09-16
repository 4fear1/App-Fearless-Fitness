"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function BodyFatCalculator() {
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState('');

  const calculateBf = () => {
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    let bf = 0;

    if (gender === 'male') {
      if (h > 0 && n > 0 && w > 0) {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      } else {
        setResult('Please fill in all fields correctly.');
        return;
      }
    } else {
      const hipVal = parseFloat(hip);
      if (h > 0 && n > 0 && w > 0 && hipVal > 0) {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hipVal - n) + 0.22100 * Math.log10(h)) - 450;
      } else {
        setResult('Please fill in all fields correctly.');
        return;
      }
    }

    if (bf > 0) {
      setResult(`Your estimated body fat is ${bf.toFixed(1)}%.`);
    } else {
      setResult('Calculation failed. Please check your measurements.');
    }
  };

  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="text-primary" />
          Body Fat Calculator
        </CardTitle>
        <CardDescription>Estimate your body fat percentage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Gender</Label>
          <RadioGroup defaultValue="male" onValueChange={(val) => { setGender(val); setResult(''); }} className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label></div>
          </RadioGroup>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div><Label htmlFor="height-bf">Height (cm)</Label><Input id="height-bf" type="number" value={height} onChange={e => setHeight(e.target.value)} /></div>
          <div><Label htmlFor="neck-bf">Neck (cm)</Label><Input id="neck-bf" type="number" value={neck} onChange={e => setNeck(e.target.value)} /></div>
          <div><Label htmlFor="waist-bf">Waist (cm)</Label><Input id="waist-bf" type="number" value={waist} onChange={e => setWaist(e.target.value)} /></div>
        </div>
        {gender === 'female' && (
          <div>
            <Label htmlFor="hip-bf">Hip (cm)</Label>
            <Input id="hip-bf" type="number" value={hip} onChange={e => setHip(e.target.value)} placeholder="Required for female" />
          </div>
        )}
        <Button onClick={calculateBf} className="w-full">Calculate</Button>
      </CardContent>
      {result && (
        <CardFooter>
          <p className="text-sm font-medium text-center w-full text-primary">{result}</p>
        </CardFooter>
      )}
    </Card>
  );
}
