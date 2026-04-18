import { Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

import type { AuthRole } from '@/api/AuthApi'
import { AuthApi } from '@/api/AuthApi'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { Logo } from '@/components/Logo'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePageTitle } from '@/hooks/usePageTitle'

const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombres requerido.'),
  apellido: z.string().min(2, 'Apellidos requerido.'),
  correo: z.string().email('Correo invalido.'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
  confirmPassword: z.string().min(6, 'Confirmar contrasena es requerido.'),
  rol: z.string().min(1, 'Rol requerido.'),
  isActive: z.string().min(1, 'Estado requerido.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden.',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const roleOptions: Array<{ value: AuthRole; label: string }> = [
  { value: 'PROFESOR', label: 'Profesor' },
  { value: 'ADMIN', label: 'Admin' },
]

export function RegisterPage() {
  usePageTitle('Registro')

  const navigate = useNavigate()
  const { isMobile } = useIsMobile()

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const parsed = registerSchema.safeParse(values)

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? 'Datos invalidos.')
      }

      const payload = {
        nombre: parsed.data.nombre,
        apellido: parsed.data.apellido,
        correo: parsed.data.correo,
        password: parsed.data.password,
        rol: parsed.data.rol as AuthRole,
        isActive: parsed.data.isActive === 'true',
      }

      console.log('Register payload:', payload)

      return AuthApi.register(payload)
    },
    onSuccess: () => {
      toast.success('Usuario registrado. Ahora inicia sesion.')
      navigate('/auth/login', { replace: true })
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'No se pudo completar el registro.'
      toast.error(message)
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    const parsed = registerSchema.safeParse(values)

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Datos invalidos.')
      return
    }

    await registerMutation.mutateAsync(values)
  }

  //Nota: user undefined en el ternario es o mismo que no poner el atributo class en el DOM, es como decir que no hay clase extra que aplicar
  const registerFields: BaseFormField<RegisterFormValues>[] = [
    {
      name: 'nombre',
      label: 'Nombres',
      placeholder: 'Nombres',
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Nombres requerido.' },
    },
    {
      name: 'apellido',
      label: 'Apellidos',
      placeholder: 'Apellidos',
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Apellidos requerido.' },
    },
    {
      name: 'correo',
      label: 'Correo institucional',
      placeholder: 'ejemplo@unet.edu.ve',
      type: 'email' as const,
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Correo requerido.' },
    },
    {
      name: 'rol',
      label: 'Rol',
      placeholder: 'Seleccionar rol - - - ->',
      select: true,
      className: isMobile ? undefined : 'col-span-1',
      options: roleOptions.map((option) => ({
        label: option.label,
        value: option.value,
      })),
      rules: { required: 'Rol requerido.' },
    },
    {
      name: 'isActive',
      label: 'Estado',
      placeholder: 'Seleccionar estado - - - ->',
      select: true,
      className: isMobile ? undefined : 'col-span-1',
      options: [
        { label: 'Activo', value: 'true' },
        { label: 'Inactivo', value: 'false' },
      ],
      rules: { required: 'Estado requerido.' },
    },
    {
      name: 'password',
      label: 'Contraseña',
      placeholder: 'Contraseña',
      type: 'password' as const,
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Contraseña requerida.' },
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar contrasena',
      placeholder: 'Repetir contrasena',
      type: 'password' as const,
      className: isMobile ? undefined : 'col-span-2',
      rules: { required: 'Confirmar contraseña es requerido.' },
    },
  ]

  return (
    <main className='min-h-screen bg-[#F1F5F9] px-4 py-8 relative'>
      <div
        className='mx-auto flex w-full flex-col items-center'
        style={{ rowGap: isMobile ? 40 : 80 }}
      >
        <header className='flex items-center justify-center'>
          <div className='flex h-[100px] w-[100px] items-center justify-center rounded-[12px] bg-white shadow-[0px_4px_6px_4px_rgba(0,0,0,0.25)]'>
            <Logo alt='Logo de RegalUnet' className='h-20 w-20' />
          </div>
        </header>

        <BaseForm<RegisterFormValues>
          className={isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-x-3 gap-y-3'}
          defaultValues={{
            nombre: '',
            apellido: '',
            correo: '',
            password: '',
            confirmPassword: '',
            rol: '',
            isActive: '',
          }}
          fields={registerFields}
          id='register-form'
          onSubmit={onSubmit}
          width={isMobile ? '100%' : 700}
        >
          {({ methods }) => {
            const password = methods.watch('password')
            const confirmPassword = methods.watch('confirmPassword')
            const passwordsMatch = password && confirmPassword && password === confirmPassword

            return (
              <div className={isMobile ? 'space-y-3' : 'col-span-2'}>
                {!passwordsMatch && confirmPassword ? (
                  <Typography color='error' variant='body2'>
                    Las contrasenas no coinciden.
                  </Typography>
                ) : null}
              </div>
            )
          }}
        </BaseForm>

        <div className='mx-auto w-[220px]'>
          <BaseButton
            className='min-h-[50px] text-[28px]'
            form='register-form'
            loading={registerMutation.isPending}
            text='Registrarse'
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