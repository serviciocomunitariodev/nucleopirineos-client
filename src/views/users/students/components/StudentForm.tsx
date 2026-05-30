import { MenuItem, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import useAcademicLevelsQuery from '@/hooks/useAcademicLevelsQuery'
import { useIsMobile } from '@/hooks/useIsMobile'
import useSubjectsQuery from '@/hooks/useSubjectsQuery'
import { SubjectType } from '@/types/subject'

export type StudentFormMode = 'creation' | 'edit'

export type StudentFormSubmitValues = {
  firstName: string
  lastName: string
  email: string
  age: number
  academicLevelId: number
  principalSubjectId: number | null
  password?: string
}

type StudentFormValues = {
  firstName: string
  lastName: string
  email: string
  age: number | ''
  academicLevelId: number | ''
  principalSubjectId: number | ''
  password: string
  confirmPassword: string
}

type StudentFormProps = {
  mode: StudentFormMode
  initialValues?: Partial<StudentFormValues>
  isSubmitting?: boolean
  onSubmit: (values: StudentFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const baseSchema = z.object({
  firstName: z.string().min(2, 'Nombres requeridos.'),
  lastName: z.string().min(2, 'Apellidos requeridos.'),
  email: z.string().email('Correo invalido.'),
  age: z.preprocess((value) => (value === '' ? undefined : value), z.coerce.number().int().min(0, 'Edad invalida.')),
  academicLevelId: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.coerce.number().int().positive('Nivel academico requerido.'),
  ),
  principalSubjectId: z.preprocess(
    (value) => (value === '' ? null : value),
    z.coerce.number().int().positive().nullable(),
  ),
})

const creationSchema = baseSchema
  .extend({
    password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
    confirmPassword: z.string().min(6, 'Debes confirmar la contrasena.'),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Las contrasenas no coinciden.',
      })
    }
  })

const editSchema = baseSchema
  .extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, context) => {
    const password = data.password?.trim() ?? ''
    const confirmPassword = data.confirmPassword?.trim() ?? ''

    if (password.length > 0 && password.length < 6) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'La contrasena debe tener al menos 6 caracteres.',
      })
    }

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Las contrasenas no coinciden.',
        })
      }
    }
  })

export default function StudentForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const { isMobile } = useIsMobile()
  const academicLevelsQuery = useAcademicLevelsQuery()
  const principalSubjectsQuery = useSubjectsQuery({ type: SubjectType.PRINCIPAL })

  const fields: BaseFormField<StudentFormValues>[] = [
    {
      name: 'firstName',
      label: 'Nombres',
      placeholder: 'Nombres',
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Nombres requeridos.' },
    },
    {
      name: 'lastName',
      label: 'Apellidos',
      placeholder: 'Apellidos',
      className: isMobile ? undefined : 'col-span-1',
      rules: { required: 'Apellidos requeridos.' },
    },
    {
      name: 'email',
      label: 'Correo institucional',
      placeholder: 'ejemplo@unet.edu.ve',
      type: 'email',
      className: isMobile ? undefined : 'col-span-2',
      rules: { required: 'Correo requerido.' },
    },
  ]

  const defaultValues: StudentFormValues = {
    firstName: initialValues?.firstName ?? '',
    lastName: initialValues?.lastName ?? '',
    email: initialValues?.email ?? '',
    age: initialValues?.age ?? '',
    academicLevelId: initialValues?.academicLevelId ?? '',
    principalSubjectId: initialValues?.principalSubjectId ?? '',
    password: '',
    confirmPassword: '',
  }

  return (
    <BaseForm<StudentFormValues>
      className={isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-x-3 gap-y-3'}
      defaultValues={defaultValues}
      fields={fields}
      onSubmit={async (values, methods) => {
        const schema = mode === 'creation' ? creationSchema : editSchema
        const parsed = schema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof StudentFormValues, {
              message: firstIssue.message,
            })
          }

          toast.error(firstIssue?.message ?? 'Datos invalidos.')
          return
        }

        await onSubmit({
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          age: parsed.data.age,
          academicLevelId: parsed.data.academicLevelId,
          principalSubjectId: parsed.data.principalSubjectId,
          password: parsed.data.password?.trim() || undefined,
        })
      }}
      width={isMobile ? '100%' : 780}
    >
      {({ methods }) => {
        const ageValue = methods.watch('age')

        return (
          <div className={isMobile ? 'space-y-3' : 'col-span-2 space-y-3'}>
            <div className='grid grid-cols-1 gap-3'>
              <div>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 0.8, color: '#000' }}>
                  Edad
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Edad'
                  size='small'
                  type='number'
                  value={ageValue ?? ''}
                  onChange={(event) => {
                    const rawValue = event.target.value
                    methods.setValue('age', rawValue === '' ? '' : Number(rawValue))
                  }}
                />
              </div>

              <div>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 0.8, color: '#000' }}>
                  Nivel academico
                </Typography>
                <TextField
                  fullWidth
                  select
                  size='small'
                  value={methods.watch('academicLevelId') ?? ''}
                  onChange={(event) => {
                    const rawValue = event.target.value
                    methods.setValue('academicLevelId', rawValue === '' ? '' : Number(rawValue))
                  }}
                >
                  <MenuItem value=''>Seleccionar nivel academico</MenuItem>
                  {(academicLevelsQuery.data ?? []).map((level) => (
                    <MenuItem key={level.id} value={level.id}>
                      {level.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 0.8, color: '#000' }}>
                  Catedra principal (opcional)
                </Typography>
                <TextField
                  fullWidth
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
              </div>
            </div>

            {academicLevelsQuery.isLoading || principalSubjectsQuery.isLoading ? (
              <Typography variant='body2'>Cargando catalogos...</Typography>
            ) : null}

            {academicLevelsQuery.isError || principalSubjectsQuery.isError ? (
              <Typography color='error' variant='body2'>
                No se pudieron cargar los catalogos del formulario.
              </Typography>
            ) : null}

            <div className='grid grid-cols-1 gap-3'>
              <div>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 0.8, color: '#000' }}>
                  {mode === 'creation' ? 'Contraseña' : 'Nueva contraseña (opcional)'}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={mode === 'creation' ? 'Contraseña' : 'Dejar en blanco para mantener'}
                  size='small'
                  type='password'
                  {...methods.register('password')}
                />
              </div>

              <div>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 0.8, color: '#000' }}>
                  Confirmar contraseña
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Repetir contraseña'
                  size='small'
                  type='password'
                  {...methods.register('confirmPassword')}
                />
              </div>
            </div>

            <div className='flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end'>
              {onCancel ? (
                <div className='w-full sm:w-[180px]'>
                  <BaseButton
                    fullWidth
                    onClick={onCancel}
                    text='Cancelar'
                    tone='secondary'
                    type='button'
                  />
                </div>
              ) : null}

              <div className='w-full sm:w-[220px]'>
                <BaseButton
                  fullWidth
                  loading={isSubmitting}
                  text={mode === 'creation' ? 'Crear estudiante' : 'Guardar cambios'}
                  type='submit'
                />
              </div>
            </div>
          </div>
        )
      }}
    </BaseForm>
  )
}
