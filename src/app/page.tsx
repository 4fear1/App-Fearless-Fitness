import { MainDashboard } from '@/components/app/main-dashboard';
import { Dumbbell } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline">
              Hub de Fitness Pessoal
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <MainDashboard />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Construído com ❤️. Seu companheiro de fitness tudo-em-um.
          </p>
        </div>
      </footer>
    </div>
  );
}
