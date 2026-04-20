import { Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Typography } from '@mui/material'
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
  principalSubjectId: number | null
  complementarySubjectIds: number[]
  password?: string
}

type StudentFormValues = {
  firstName: string
  lastName: string
  email: string
  age: number | ''
  principalSubjectId: number | ''
  complementarySubjectIds: number[]
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
  principalSubjectId: z.preprocess(
    (value) => (value === '' ? null : value),
    z.coerce.number().int().positive().nullable(),
  ),
  complementarySubjectIds: z.array(z.number().int().positive()).optional(),
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

    if (data.age >= 8 && !data.principalSubjectId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['principalSubjectId'],
        message: 'Para estudiantes de 8 anos o mas, la catedra principal es obligatoria.',
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

    if (data.age >= 8 && !data.principalSubjectId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['principalSubjectId'],
        message: 'Para estudiantes de 8 anos o mas, la catedra principal es obligatoria.',
      })
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
  const complementarySubjectsQuery = useSubjectsQuery({ type: SubjectType.COMPLEMENTARY })

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
    principalSubjectId: initialValues?.principalSubjectId ?? '',
    complementarySubjectIds: initialValues?.complementarySubjectIds ?? [],
    password: '',
    confirmPassword: '',
  }

  const resolveAcademicLevelByAge = (age: number) => {
    const levels = academicLevelsQuery.data ?? []

    return levels
      .filter((level) => age >= level.minAge && (level.maxAge === null || age < level.maxAge))
      .sort((a, b) => b.minAge - a.minAge)[0]
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
          principalSubjectId: parsed.data.principalSubjectId,
          complementarySubjectIds: parsed.data.complementarySubjectIds ?? [],
          password: parsed.data.password?.trim() || undefined,
        })
      }}
      width={isMobile ? '100%' : 780}
    >
      {({ methods }) => {
        const ageValue = methods.watch('age')
        const normalizedAge = typeof ageValue === 'number' ? ageValue : Number(ageValue)
        const ageIsValid = Number.isFinite(normalizedAge) && normalizedAge >= 0
        const detectedAcademicLevel = ageIsValid ? resolveAcademicLevelByAge(normalizedAge) : undefined
        const complementarySubjectIds = methods.watch('complementarySubjectIds') ?? []

        const toggleComplementary = (subjectId: number, checked: boolean) => {
          const currentValues = methods.getValues('complementarySubjectIds') ?? []

          if (checked) {
            methods.setValue('complementarySubjectIds', [...currentValues, subjectId])
            return
          }

          methods.setValue(
            'complementarySubjectIds',
            currentValues.filter((currentValue) => currentValue !== subjectId),
          )
        }

        return (
          <div className={isMobile ? 'space-y-3' : 'col-span-2 space-y-3'}>
            <div className='grid grid-cols-1 gap-3'>
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

            <div>
              <Typography variant='subtitle2'>Catedras complementarias</Typography>
              <FormGroup>
                {(complementarySubjectsQuery.data ?? []).map((subject) => (
                  <FormControlLabel
                    key={subject.id}
                    control={
                      <Checkbox
                        checked={complementarySubjectIds.includes(subject.id)}
                        onChange={(event) => toggleComplementary(subject.id, event.target.checked)}
                      />
                    }
                    label={subject.name}
                  />
                ))}
              </FormGroup>
            </div>

            {academicLevelsQuery.isLoading || principalSubjectsQuery.isLoading || complementarySubjectsQuery.isLoading ? (
              <Typography variant='body2'>Cargando catalogos...</Typography>
            ) : null}

            {academicLevelsQuery.isError || principalSubjectsQuery.isError || complementarySubjectsQuery.isError ? (
              <Typography color='error' variant='body2'>
                No se pudieron cargar los catalogos del formulario.
              </Typography>
            ) : null}

            <div className='grid grid-cols-1 gap-3'>
              <TextField
                fullWidth
                label={mode === 'creation' ? 'Contrasena' : 'Nueva contrasena (opcional)'}
                placeholder={mode === 'creation' ? 'Contrasena' : 'Dejar en blanco para mantener'}
                size='small'
                type='password'
                {...methods.register('password')}
              />

              <TextField
                fullWidth
                label='Confirmar contrasena'
                placeholder='Repetir contrasena'
                size='small'
                type='password'
                {...methods.register('confirmPassword')}
              />
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
