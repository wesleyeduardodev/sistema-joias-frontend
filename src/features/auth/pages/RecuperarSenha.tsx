import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import api from '@/lib/api';

const schema = z.object({
  email: z.string().min(1, 'E-mail e obrigatorio').email('E-mail invalido'),
});

type RecuperarSenhaForm = z.infer<typeof schema>;

export function RecuperarSenha() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarSenhaForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RecuperarSenhaForm) => {
    setLoading(true);
    try {
      await api.post('/auth/recuperar-senha', { email: data.email });
    } catch {
      // Even if it fails, show success for security
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-[420px] shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <Lock className="h-8 w-8 text-gold" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Recuperar Senha
          </h2>
          <p className="text-sm text-muted-foreground">
            {sent
              ? 'Se o e-mail estiver cadastrado, voce recebera um link de recuperacao.'
              : 'Informe seu e-mail para receber o link de redefinicao.'}
          </p>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gold to-gold-light px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>
            </form>
          ) : (
            <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-700">
              Verifique sua caixa de entrada e siga as instrucoes.
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
