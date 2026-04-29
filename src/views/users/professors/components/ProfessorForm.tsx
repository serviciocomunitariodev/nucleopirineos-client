import { Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import useAcademicLevelsQuery from '@/hooks/useAcademicLevelsQuery'
import { useIsMobile } from '@/hooks/useIsMobile'
import useSubjectsQuery from '@/hooks/useSubjectsQuery'

export type ProfessorFormMode = 'creation' | 'edit'

export type ProfessorFormSubmitValues = {
  firstName: string
  lastName: string
  email: string
  password?: string
  academicLevelIds: number[]
  subjectIds: number[]
}

type ProfessorFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  academicLevelIds: number[]
  subjectIds: number[]
}

type ProfessorFormProps = {
  mode: ProfessorFormMode
  initialValues?: Partial<ProfessorFormValues>
  isSubmitting?: boolean
  onSubmit: (values: ProfessorFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const baseSchema = z.object({
  firstName: z.string().min(2, 'Nombres requeridos.'),
  lastName: z.string().min(2, 'Apellidos requeridos.'),
  email: z.string().email('Correo invalido.'),
  academicLevelIds: z.array(z.number().int().positive()).optional(),
  subjectIds: z.array(z.number().int().positive()).optional(),
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

export default function ProfessorForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: ProfessorFormProps) {
  const { isMobile } = useIsMobile()
  const academicLevelsQuery = useAcademicLevelsQuery()
  const subjectsQuery = useSubjectsQuery()

  const fields: BaseFormField<ProfessorFormValues>[] = [
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

  const defaultValues: ProfessorFormValues = {
    firstName: initialValues?.firstName ?? '',
    lastName: initialValues?.lastName ?? '',
    email: initialValues?.email ?? '',
    password: '',
    confirmPassword: '',
    academicLevelIds: initialValues?.academicLevelIds ?? [],
    subjectIds: initialValues?.subjectIds ?? [],
  }

  return (
    <BaseForm<ProfessorFormValues>
      className={isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-x-3 gap-y-3'}
      defaultValues={defaultValues}
      fields={fields}
      onSubmit={async (values, methods) => {
        const schema = mode === 'creation' ? creationSchema : editSchema
        const parsed = schema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof ProfessorFormValues, {
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
          password: parsed.data.password?.trim() || undefined,
          academicLevelIds: parsed.data.academicLevelIds ?? [],
          subjectIds: parsed.data.subjectIds ?? [],
        })
      }}
      width={isMobile ? '100%' : 780}
    >
      {({ methods }) => {
        const selectedAcademicLevelIds = methods.watch('academicLevelIds') ?? []
        const selectedSubjectIds = methods.watch('subjectIds') ?? []

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
          <div className={isMobile ? 'space-y-3' : 'col-span-2 space-y-3'}>
            <div>
              <Typography variant='subtitle2'>Niveles academicos</Typography>
              <FormGroup>
                {(academicLevelsQuery.data ?? []).map((level) => (
                  <FormControlLabel
                    key={level.id}
                    control={
                      <Checkbox
                        checked={selectedAcademicLevelIds.includes(level.id)}
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
              <Typography variant='subtitle2'>Catedras</Typography>
              <FormGroup>
                {(subjectsQuery.data ?? []).map((subject) => (
                  <FormControlLabel
                    key={subject.id}
                    control={
                      <Checkbox
                        checked={selectedSubjectIds.includes(subject.id)}
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

            {academicLevelsQuery.isLoading || subjectsQuery.isLoading ? (
              <Typography variant='body2'>Cargando catalogos...</Typography>
            ) : null}

            {academicLevelsQuery.isError || subjectsQuery.isError ? (
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
                  text={mode === 'creation' ? 'Crear profesor' : 'Guardar cambios'}
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
