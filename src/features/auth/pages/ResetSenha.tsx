import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import api from '@/lib/api';

const schema = z
  .object({
    senha: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'Senhas nao coincidem',
    path: ['confirmarSenha'],
  });

type ResetForm = z.infer<typeof schema>;

export function ResetSenha() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-senha', { token, novaSenha: data.senha });
      navigate('/login');
    } catch {
      setError('Link invalido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-[420px] shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <Lock className="h-8 w-8 text-gold" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Nova Senha</h2>
          <p className="text-sm text-muted-foreground">
            Defina sua nova senha
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-xs font-semibold uppercase tracking-wider">
                Nova Senha
              </Label>
              <Input
                id="senha"
                type="password"
                placeholder="********"
                {...register('senha')}
              />
              {errors.senha && (
                <p className="text-xs text-red-500">{errors.senha.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha" className="text-xs font-semibold uppercase tracking-wider">
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="********"
                {...register('confirmarSenha')}
              />
              {errors.confirmarSenha && (
                <p className="text-xs text-red-500">
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gold to-gold-light px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-gold hover:text-gold-dark"
            >
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
