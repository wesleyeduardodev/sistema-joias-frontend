import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/features/auth/stores/authStore';

const registroSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter no minimo 3 caracteres'),
    email: z.string().min(1, 'E-mail e obrigatorio').email('E-mail invalido'),
    cpf: z.string().min(11, 'CPF invalido'),
    telefone: z.string().min(10, 'Telefone invalido'),
    senha: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'Senhas nao coincidem',
    path: ['confirmarSenha'],
  });

type RegistroForm = z.infer<typeof registroSchema>;

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: '', color: '', width: '0%' };
  if (password.length < 6) return { label: 'Fraca', color: 'bg-red-500', width: '25%' };
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasNumber, hasSpecial, password.length >= 8].filter(Boolean).length;
  if (score <= 1) return { label: 'Fraca', color: 'bg-red-500', width: '25%' };
  if (score === 2) return { label: 'Media', color: 'bg-yellow-500', width: '50%' };
  if (score === 3) return { label: 'Boa', color: 'bg-blue-500', width: '75%' };
  return { label: 'Forte', color: 'bg-green-500', width: '100%' };
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const registro = useAuthStore((s) => s.registro);
  const isLoading = useAuthStore((s) => s.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<RegistroForm>({
    resolver: zodResolver(registroSchema),
  });

  const senhaValue = watch('senha', '');
  const strength = getPasswordStrength(senhaValue);

  const onSubmit = async (data: RegistroForm) => {
    try {
      await registro({
        nome: data.nome,
        email: data.email,
        cpf: data.cpf.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, ''),
        senha: data.senha,
      });
      setSuccessMessage(
        'Solicitacao enviada! Sua conta sera ativada apos aprovacao do administrador.'
      );
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setError('root', {
        message: 'Erro ao solicitar acesso. Tente novamente.',
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Hero left side */}
      <div className="relative hidden w-[60%] bg-[#1A1A1A] lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 to-[#1A1A1A]/40" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <h1 className="text-2xl font-bold tracking-[0.3em] text-gold">
            JOIASGESTOR
          </h1>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 p-10">
          <h2 className="text-3xl font-bold text-white">
            Gestao inteligente para
            <br />
            sua joalheria
          </h2>
          <div className="mt-4 h-1 w-12 bg-gold" />
        </div>
      </div>

      {/* Form right side */}
      <div className="flex w-full flex-col items-center justify-center px-8 py-10 lg:w-[40%]">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <h1 className="text-2xl font-bold tracking-[0.3em] text-gold">
            JOIASGESTOR
          </h1>
        </div>

        <div className="w-full max-w-[400px]">
          <h2 className="text-3xl font-bold text-foreground">Criar Conta</h2>
          <p className="mt-2 text-muted-foreground">
            Preencha seus dados para solicitar acesso
          </p>

          {successMessage && (
            <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {errors.root && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome" className="text-xs font-semibold uppercase tracking-wider">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  className="pl-10"
                  {...register('nome')}
                />
              </div>
              {errors.nome && (
                <p className="text-xs text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@joalheria.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-xs font-semibold uppercase tracking-wider">
                  CPF
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    className="pl-10"
                    {...register('cpf', {
                      onChange: (e) => {
                        setValue('cpf', formatCPF(e.target.value));
                      },
                    })}
                  />
                </div>
                {errors.cpf && (
                  <p className="text-xs text-red-500">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-xs font-semibold uppercase tracking-wider">
                  Telefone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    className="pl-10"
                    {...register('telefone', {
                      onChange: (e) => {
                        setValue('telefone', formatPhone(e.target.value));
                      },
                    })}
                  />
                </div>
                {errors.telefone && (
                  <p className="text-xs text-red-500">
                    {errors.telefone.message}
                  </p>
                )}
              </div>
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
              {senhaValue && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Forca da senha: <span className="font-medium">{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.senha && (
                <p className="text-xs text-red-500">{errors.senha.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha" className="text-xs font-semibold uppercase tracking-wider">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="********"
                  className="pl-10"
                  {...register('confirmarSenha')}
                />
              </div>
              {errors.confirmarSenha && (
                <p className="text-xs text-red-500">
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gold to-gold-light px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Solicitar Acesso'}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Sua conta sera ativada apos aprovacao do administrador
            </p>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Ja tem conta?{' '}
            <Link
              to="/login"
              className="font-medium text-gold hover:text-gold-dark"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
