import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'

export type AcademicLevelFormMode = 'creation' | 'edit'

export type AcademicLevelFormSubmitValues = {
  name: string
  minAge: number
  maxAge: number | null
}

type AcademicLevelFormValues = {
  name: string
  minAge: string
  maxAge: string
}

type AcademicLevelFormProps = {
  mode: AcademicLevelFormMode
  initialValues?: Partial<AcademicLevelFormSubmitValues>
  isSubmitting?: boolean
  onSubmit: (values: AcademicLevelFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const academicLevelSchema = z
  .object({
    name: z.string().min(2, 'Nombre requerido.'),
    minAge: z.coerce.number().int('Edad minima invalida.').min(0, 'Edad minima invalida.'),
    maxAge: z
      .preprocess((value) => (value === '' || value === undefined ? null : value), z.coerce.number().int('Edad maxima invalida.').min(0, 'Edad maxima invalida.').nullable()),
  })
  .refine((data) => data.maxAge === null || data.maxAge >= data.minAge, {
    path: ['maxAge'],
    message: 'Edad maxima debe ser mayor o igual a edad minima.',
  })

export default function AcademicLevelForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: AcademicLevelFormProps) {
  const { isMobile } = useIsMobile()

  const fields: BaseFormField<AcademicLevelFormValues>[] = [
    {
      name: 'name',
      label: 'Nombre',
      placeholder: 'Ej. Primaria',
      rules: { required: 'Nombre requerido.' },
    },
    {
      name: 'minAge',
      label: 'Edad minima',
      placeholder: 'Ej. 6',
      type: 'number',
      rules: { required: 'Edad minima requerida.' },
    },
    {
      name: 'maxAge',
      label: 'Edad maxima (opcional)',
      placeholder: 'Ej. 11',
      type: 'number',
    },
  ]

  return (
    <BaseForm<AcademicLevelFormValues>
      className='space-y-3'
      defaultValues={{
        name: initialValues?.name ?? '',
        minAge: initialValues?.minAge !== undefined ? String(initialValues.minAge) : '',
        maxAge: initialValues?.maxAge !== null && initialValues?.maxAge !== undefined ? String(initialValues.maxAge) : '',
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        const parsed = academicLevelSchema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof AcademicLevelFormValues, {
              message: firstIssue.message,
            })
          }

          toast.error(firstIssue?.message ?? 'Datos invalidos.')
          return
        }

        await onSubmit(parsed.data)
      }}
      width={isMobile ? '100%' : 640}
    >
      {() => (
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

          <div className='w-full sm:w-[250px]'>
            <BaseButton
              fullWidth
              loading={isSubmitting}
              text={mode === 'creation' ? 'Crear nivel academico' : 'Guardar cambios'}
              type='submit'
            />
          </div>

          <Typography className='sr-only' component='span'>
            Acciones del formulario
          </Typography>
        </div>
      )}
    </BaseForm>
  )
}
