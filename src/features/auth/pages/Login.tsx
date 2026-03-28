import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/features/auth/stores/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail e obrigatorio').email('E-mail invalido'),
  senha: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.senha);
      navigate('/');
    } catch {
      setError('root', {
        message: 'E-mail ou senha incorretos',
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Hero left side */}
      <div className="relative hidden w-[60%] bg-[#1A1A1A] lg:flex lg:flex-col lg:justify-between">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 to-[#1A1A1A]/40" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <h1 className="text-2xl font-bold tracking-[0.3em] text-gold">
            JOIASGESTOR
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Gestao inteligente para sua joalheria
          </p>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 p-10">
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Gestao de alta joalheria &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Form right side */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-[40%]">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <h1 className="text-2xl font-bold tracking-[0.3em] text-gold">
            JOIASGESTOR
          </h1>
        </div>

        <div className="w-full max-w-[400px]">
          <h2 className="text-3xl font-bold text-foreground">Entrar</h2>
          <p className="mt-2 text-muted-foreground">
            Acesse sua conta para continuar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {errors.root && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

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
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-xs font-semibold uppercase tracking-wider">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="pl-10 pr-10"
                  {...register('senha')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="text-xs text-red-500">{errors.senha.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Lembrar de mim
                </label>
              </div>
              <Link
                to="/recuperar-senha"
                className="text-sm font-medium text-gold hover:text-gold-dark"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gold to-gold-light px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">ou</span>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Nao possui uma conta?{' '}
            <Link
              to="/registro"
              className="font-medium text-gold hover:text-gold-dark"
            >
              Criar uma conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
