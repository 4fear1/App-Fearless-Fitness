import { BmiCalculator } from '@/components/app/bmi-calculator';
import { BodyFatCalculator } from '@/components/app/bf-calculator';
import { WaterCalculator } from '@/components/app/water-calculator';

export function CalculatorsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WaterCalculator />
      <BmiCalculator />
      <BodyFatCalculator />
    </div>
  );
}
