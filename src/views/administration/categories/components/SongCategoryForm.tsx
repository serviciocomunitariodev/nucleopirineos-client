import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'

export type SongCategoryFormMode = 'creation' | 'edit'

export type SongCategoryFormSubmitValues = {
  name: string
}

type SongCategoryFormProps = {
  mode: SongCategoryFormMode
  initialValues?: Partial<SongCategoryFormSubmitValues>
  isSubmitting?: boolean
  onSubmit: (values: SongCategoryFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const songCategorySchema = z.object({
  name: z.string().trim().min(2, 'Nombre requerido.'),
})

export default function SongCategoryForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SongCategoryFormProps) {
  const { isMobile } = useIsMobile()

  const fields: BaseFormField<SongCategoryFormSubmitValues>[] = [
    {
      name: 'name',
      label: 'Nombre',
      placeholder: 'Nombre de la categoria',
      rules: { required: 'Nombre requerido.' },
    },
  ]

  return (
    <BaseForm<SongCategoryFormSubmitValues>
      className='space-y-3'
      defaultValues={{
        name: initialValues?.name ?? '',
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        const parsed = songCategorySchema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof SongCategoryFormSubmitValues, {
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
              text={mode === 'creation' ? 'Crear categoria' : 'Guardar cambios'}
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
