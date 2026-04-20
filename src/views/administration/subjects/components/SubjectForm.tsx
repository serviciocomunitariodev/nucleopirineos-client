import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'
import { SubjectType } from '@/types/subject'

export type SubjectFormMode = 'creation' | 'edit'

export type SubjectFormSubmitValues = {
  name: string
  type: SubjectType
}

type SubjectFormValues = {
  name: string
  type: SubjectType | ''
}

type SubjectFormProps = {
  mode: SubjectFormMode
  initialValues?: Partial<SubjectFormValues>
  isSubmitting?: boolean
  onSubmit: (values: SubjectFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const subjectSchema = z.object({
  name: z.string().min(2, 'Nombre requerido.'),
  type: z.nativeEnum(SubjectType),
})

const subjectTypeOptions: Array<{ label: string; value: SubjectType }> = [
  { label: 'Principal', value: SubjectType.PRINCIPAL },
  { label: 'Complementaria', value: SubjectType.COMPLEMENTARY },
  { label: 'Grupal', value: SubjectType.GROUP },
]

export default function SubjectForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SubjectFormProps) {
  const { isMobile } = useIsMobile()

  const fields: BaseFormField<SubjectFormValues>[] = [
    {
      name: 'name',
      label: 'Nombre',
      placeholder: 'Nombre de la catedra',
      rules: { required: 'Nombre requerido.' },
    },
    {
      name: 'type',
      label: 'Tipo',
      placeholder: 'Selecciona un tipo',
      select: true,
      options: subjectTypeOptions,
      rules: { required: 'Tipo requerido.' },
    },
  ]

  return (
    <BaseForm<SubjectFormValues>
      className='space-y-3'
      defaultValues={{
        name: initialValues?.name ?? '',
        type: initialValues?.type ?? '',
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        const parsed = subjectSchema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof SubjectFormValues, {
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

          <div className='w-full sm:w-[220px]'>
            <BaseButton
              fullWidth
              loading={isSubmitting}
              text={mode === 'creation' ? 'Crear catedra' : 'Guardar cambios'}
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
