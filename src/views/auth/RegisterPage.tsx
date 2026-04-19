import { Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

import type { AuthRole } from '@/api/AuthApi'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import useAcademicLevelsQuery from '@/hooks/useAcademicLevelsQuery'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePageTitle } from '@/hooks/usePageTitle'
import useRegisterMutation from '@/hooks/useRegisterMutation'
import useSubjectsQuery from '@/hooks/useSubjectsQuery'
import { SubjectType } from '@/types/subject'

const baseRegisterSchema = z.object({
  firstName: z.string().min(2, 'Nombres requerido.'),
  lastName: z.string().min(2, 'Apellidos requerido.'),
  email: z.string().email('Correo invalido.'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
  confirmPassword: z.string().min(6, 'Confirmar contrasena es requerido.'),
})

const studentRegisterSchema = baseRegisterSchema
  .extend({
    role: z.literal('STUDENT'),
    age: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.coerce.number().int().min(0, 'Edad invalida.'),
    ),
    principalSubjectId: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.coerce.number().int().positive().optional(),
    ),
  })
  .superRefine((data, context) => {
    if (data.age >= 8 && !data.principalSubjectId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['principalSubjectId'],
        message: 'Para estudiantes de 8 anos o mas, la catedra principal es obligatoria.',
      })
    }
  })

const professorRegisterSchema = baseRegisterSchema.extend({
  role: z.literal('PROFESSOR'),
  academicLevelIds: z.array(z.number().int().positive()).optional(),
  subjectIds: z.array(z.number().int().positive()).optional(),
})

const registerSchema = z.discriminatedUnion('role', [studentRegisterSchema, professorRegisterSchema]).superRefine((data, context) => {
  if (data.password !== data.confirmPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Las contrasenas no coinciden.',
    })
  }
})

type RegisterFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: AuthRole | ''
  age?: number | ''
  principalSubjectId?: number | ''
  academicLevelIds?: number[]
  subjectIds?: number[]
}

const roleOptions: Array<{ value: AuthRole; label: string }> = [
  { value: 'PROFESSOR', label: 'Profesor' },
  { value: 'STUDENT', label: 'Estudiante' },
]

export default function RegisterPage() {
  usePageTitle('Registro')

  const navigate = useNavigate()
  const { isMobile } = useIsMobile()
  const registerMutation = useRegisterMutation()
  const academicLevelsQuery = useAcademicLevelsQuery()
  const principalSubjectsQuery = useSubjectsQuery({ type: SubjectType.PRINCIPAL })
  const allSubjectsQuery = useSubjectsQuery()

  const resolveAcademicLevelByAge = (age: number) => {
    const levels = academicLevelsQuery.data ?? []

    return levels
      .filter((level) => age >= level.minAge && (level.maxAge === null || age < level.maxAge))
      .sort((a, b) => b.minAge - a.minAge)[0]
  }

  const onSubmit = async (values: RegisterFormValues, methods?: { setError: (name: keyof RegisterFormValues, error: { message: string }) => void }) => {
    const parsed = registerSchema.safeParse(values)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      if (firstIssue?.path?.[0] && methods?.setError) {
        methods.setError(firstIssue.path[0] as keyof RegisterFormValues, {
          message: firstIssue.message,
        })
      }
      toast.error(firstIssue?.message ?? 'Datos invalidos.')
      return
    }

    try {
      if (parsed.data.role === 'STUDENT') {
        const level = resolveAcademicLevelByAge(parsed.data.age)

        if (!level) {
          toast.error('No existe un nivel academico para la edad indicada.')
          return
        }

        await registerMutation.mutateAsync({
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          password: parsed.data.password,
          role: parsed.data.role,
          age: parsed.data.age,
          principalSubjectId: parsed.data.principalSubjectId,
        })
      }

      if (parsed.data.role === 'PROFESSOR') {
        await registerMutation.mutateAsync({
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          password: parsed.data.password,
          role: parsed.data.role,
          academicLevelIds: parsed.data.academicLevelIds,
          subjectIds: parsed.data.subjectIds,
        })
      }

      toast.success('Usuario registrado. Ahora inicia sesion.')
      navigate('/auth/login', { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo completar el registro.'
      toast.error(message)
    }
  }

  //Nota: user undefined en el ternario es o mismo que no poner el atributo class en el DOM, es como decir que no hay clase extra que aplicar
  const registerFields: BaseFormField<RegisterFormValues>[] = [
    {
      name: 'firstName',
      label: 'Nombres',
      placeholder: 'Nombres',
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Nombres requerido.' },
    },
    {
      name: 'lastName',
      label: 'Apellidos',
      placeholder: 'Apellidos',
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Apellidos requerido.' },
    },
    {
      name: 'email',
      label: 'Correo institucional',
      placeholder: 'ejemplo@unet.edu.ve',
      type: 'email' as const,
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Correo requerido.' },
    },
    {
      name: 'role',
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
  ]

  return (
    <main className='min-h-screen bg-[#F1F5F9] px-4 py-8 relative'>
      <div
        className='mx-auto flex w-full flex-col items-center'
        style={{ rowGap: isMobile ? 40 : 80 }}
      >
        <header className='flex items-center justify-center'>
          <div className='flex h-[100px] w-[100px] items-center justify-center rounded-[12px] bg-white shadow-[0px_4px_6px_4px_rgba(0,0,0,0.25)]'>
            <span className='text-sm font-semibold text-[#065F46]'>LOGO</span>
          </div>
        </header>

        <BaseForm<RegisterFormValues>
          className={isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-x-3 gap-y-3'}
          defaultValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
            age: '',
            principalSubjectId: '',
            academicLevelIds: [],
            subjectIds: [],
          }}
          fields={registerFields}
          id='register-form'
          onSubmit={async (values, methods) => onSubmit(values, methods)}
          width={isMobile ? '100%' : 700}
        >
          {({ methods }) => {
            const selectedRole = methods.watch('role')
            const ageValue = methods.watch('age')
            const professorAcademicLevelIds = methods.watch('academicLevelIds') ?? []
            const professorSubjectIds = methods.watch('subjectIds') ?? []
            const password = methods.watch('password')
            const confirmPassword = methods.watch('confirmPassword')
            const passwordsMatch = password && confirmPassword && password === confirmPassword
            const normalizedAge = typeof ageValue === 'number' ? ageValue : Number(ageValue)
            const ageIsValid = Number.isFinite(normalizedAge) && normalizedAge >= 0
            const detectedAcademicLevel = ageIsValid ? resolveAcademicLevelByAge(normalizedAge) : undefined

            const toggleSelection = (
              fieldName: 'academicLevelIds' | 'subjectIds',
              value: number,
              checked: boolean,
            ) => {
              const currentValues = methods.getValues(fieldName) ?? []

              if (checked) {
                methods.setValue(fieldName, [...currentValues, value])
                return
              }

              methods.setValue(
                fieldName,
                currentValues.filter((currentValue) => currentValue !== value),
              )
            }

            return (
              <div className={isMobile ? 'space-y-3' : 'col-span-2'}>
                {selectedRole === 'STUDENT' ? (
                  <div className='flex flex-col gap-y-4 mb-3'>
                    <TextField
                      fullWidth
                      label='Edad'
                      size='small'
                      type='number'
                      value={ageValue ?? ''}
                      onChange={(event) => {
                        const rawValue = event.target.value
                        methods.setValue('age', rawValue === '' ? '' : Number(rawValue))
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Nivel academico asignado'
                      size='small'
                      value={detectedAcademicLevel ? detectedAcademicLevel.name : 'Sin nivel asignado'}
                      disabled
                    />

                    {ageIsValid && normalizedAge >= 8 ? (
                      <TextField
                        fullWidth
                        label='Catedra principal'
                        select
                        size='small'
                        value={methods.watch('principalSubjectId') ?? ''}
                        onChange={(event) => {
                          const rawValue = event.target.value
                          methods.setValue('principalSubjectId', rawValue === '' ? '' : Number(rawValue))
                        }}
                      >
                        <MenuItem value=''>Seleccionar catedra principal</MenuItem>
                        {(principalSubjectsQuery.data ?? []).map((subject) => (
                          <MenuItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : null}
                  </div>
                ) : null}

                {selectedRole === 'PROFESSOR' ? (
                  <div className='space-y-3'>
                    <div>
                      <Typography variant='subtitle2'>Niveles academicos (opcional)</Typography>
                      <FormGroup>
                        {(academicLevelsQuery.data ?? []).map((level) => (
                          <FormControlLabel
                            key={level.id}
                            control={
                              <Checkbox
                                checked={professorAcademicLevelIds.includes(level.id)}
                                onChange={(event) =>
                                  toggleSelection('academicLevelIds', level.id, event.target.checked)
                                }
                              />
                            }
                            label={level.name}
                          />
                        ))}
                      </FormGroup>
                    </div>

                    <div>
                      <Typography variant='subtitle2'>Catedras (opcional)</Typography>
                      <FormGroup>
                        {(allSubjectsQuery.data ?? []).map((subject) => (
                          <FormControlLabel
                            key={subject.id}
                            control={
                              <Checkbox
                                checked={professorSubjectIds.includes(subject.id)}
                                onChange={(event) =>
                                  toggleSelection('subjectIds', subject.id, event.target.checked)
                                }
                              />
                            }
                            label={`${subject.name} (${subject.type})`}
                          />
                        ))}
                      </FormGroup>
                    </div>
                  </div>
                ) : null}

                {!passwordsMatch && confirmPassword ? (
                  <Typography color='error' variant='body2'>
                    Las contrasenas no coinciden.
                  </Typography>
                ) : null}

                {(academicLevelsQuery.isLoading || principalSubjectsQuery.isLoading || allSubjectsQuery.isLoading) ? (
                  <Typography variant='body2'>Cargando catalogos...</Typography>
                ) : null}

                {(academicLevelsQuery.isError || principalSubjectsQuery.isError || allSubjectsQuery.isError) ? (
                  <Typography color='error' variant='body2'>
                    No se pudieron cargar los catalogos para el registro.
                  </Typography>
                ) : null}

                <div className='grid grid-cols-1 gap-3'>
                  <TextField
                    fullWidth
                    label='Contraseña'
                    placeholder='Contraseña'
                    size='small'
                    type='password'
                    {...methods.register('password', { required: 'Contraseña requerida.' })}
                  />

                  <TextField
                    fullWidth
                    label='Confirmar contrasena'
                    placeholder='Repetir contrasena'
                    size='small'
                    type='password'
                    {...methods.register('confirmPassword', {
                      required: 'Confirmar contraseña es requerido.',
                    })}
                  />
                </div>
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