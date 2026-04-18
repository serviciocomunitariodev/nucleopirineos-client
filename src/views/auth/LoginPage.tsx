import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

import { AuthApi } from '@/api/AuthApi'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { Logo } from '@/components/Logo'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAppStore } from '@/store/useAppStore'

const loginSchema = z.object({
  correo: z.string().email('Correo invalido.'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  usePageTitle('Login')

  const navigate = useNavigate()
  const { isMobile } = useIsMobile()
  const setSession = useAppStore((state) => state.setSession)
  const setUser = useAppStore((state) => state.setUser)

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const parsed = loginSchema.safeParse(values)

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? 'Datos invalidos.')
      }

      console.log('Login payload:', parsed.data)

      return AuthApi.login(parsed.data)
    },
    onSuccess: (result) => {
      setSession(result.token)
      setUser(result.user)
      toast.success('Inicio de sesion exitoso.')
      navigate('/', { replace: true })
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'No se pudo iniciar sesion.'
      toast.error(message)
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Datos invalidos.')
      return
    }

    await loginMutation.mutateAsync(values)
  }

  const loginFields: BaseFormField<LoginFormValues>[] = [
    {
      name: 'correo',
      label: 'Usuario',
      placeholder: 'Escribe tu usuario aca...',
      type: 'text' as const,
      rules: {
        required: 'El usuario es requerido.',
      },
    },
    {
      name: 'password',
      label: 'Contraseña',
      placeholder: 'Escribe tu contraseña aca...',
      type: 'password' as const,
      rules: {
        required: 'La contraseña es requerida.',
      },
    },
  ]

  return (
    <main className='min-h-screen bg-[#F1F5F9] px-4 py-8 relative'>
      <div
        className='mx-auto flex w-full max-w-[390px] flex-col'
        style={{ rowGap: isMobile ? 40 : 80 }}
      >
        <header className='flex items-center justify-center'>
          <div className='flex h-[100px] w-[100px] items-center justify-center rounded-[12px] bg-white shadow-[0px_4px_6px_4px_rgba(0,0,0,0.25)]'>
            <Logo alt='Logo de RegalUnet' className='h-20 w-20' />
          </div>
        </header>


        <BaseForm<LoginFormValues>
          className='space-y-3'
          defaultValues={{
            correo: '',
            password: '',
          }}
          fields={loginFields}
          id='login-form'
          onSubmit={onSubmit}
        />


        <div className='mx-auto w-[220px]'>
          <BaseButton
            className='min-h-[50px] text-[28px]'
            form='login-form'
            loading={loginMutation.isPending}
            text='Iniciar Sesion'
            type='submit'
            tone='primary'
            sx={{
              backgroundColor: '#065F46',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0px 4px 6px 4px rgba(0,0,0,0.25)',
              fontWeight: 700,
              letterSpacing: '0.2px',
              fontSize: '20px',
              minHeight: 50,
              py: 1.5,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                backgroundColor: '#064E3B',
                boxShadow: '0 0 10px rgba(6, 95, 70, 0.6), 0 0 20px rgba(6, 95, 70, 0.4), 0 0 30px rgba(6, 95, 70, 0.2)',
                transform: 'translateY(-2px)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::before': {
                left: '100%',
              }
            }}
          />
        </div>
      </div>

      {!isMobile && (
        <div className='fixed bottom-6 right-6 z-50 transition-all duration-300'>

          <div className='group h-16 w-16 bg-[#F1F5F9] rounded-lg shadow-[0px_4px_6px_4px_rgba(0,0,0,0.25)] hover:bg-sidebar hover:scale-110 transition-all duration-300 flex items-center justify-center md:h-20 md:w-20'>

            <img
              src='/UNET_LOGO.png'
              alt='University Logo'
              className='h-12 w-12 transition-all duration-300 md:h-16 md:w-16 group-hover:brightness-0 group-hover:invert'
              decoding='async'
              loading='eager'
            />

          </div>
        </div>
      )}
    </main>
  )
}