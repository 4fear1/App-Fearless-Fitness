"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/app/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    if (login(username, password)) {
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: "Nome de usuário ou senha incorretos.",
      });
    }
  };

  const handleRegister = () => {
    try {
      register(username, password);
      toast({
        title: "Cadastro Realizado",
        description: "Você foi cadastrado com sucesso! Agora pode fazer o login.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Dumbbell className="h-10 w-10 text-primary" />
          <CardTitle className="text-3xl font-bold font-headline">Fearless Fitness</CardTitle>
          <CardDescription>Faça login ou cadastre-se para continuar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Seu nome de usuário" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" />
          </div>
          <div className="flex flex-col space-y-2">
            <Button onClick={handleLogin}>Entrar</Button>
            <Button variant="outline" onClick={handleRegister}>Cadastrar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
