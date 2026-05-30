import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { InformationPayload } from '@/types/information'

export type InformationFormMode = 'creation' | 'edit'

type InformationFormProps = {
  mode: InformationFormMode
  initialValues?: Partial<InformationPayload>
  isSubmitting?: boolean
  onSubmit: (values: InformationPayload) => void | Promise<void>
  onCancel?: () => void
}

const informationSchema = z.object({
  key: z.string().trim().min(2, 'Clave requerida.'),
  title: z.string().trim().min(2, 'Titulo requerido.'),
  section: z.enum(['HERO', 'MISSION_VISION']),
  value: z.string().trim().min(1, 'Contenido requerido.'),
})

const informationEditSchema = informationSchema.omit({ key: true, section: true })

const sectionOptions = [
  { label: 'Principal', value: 'HERO' },
  { label: 'Mision y Vision', value: 'MISSION_VISION' },
]

export default function InformationForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: InformationFormProps) {
  const { isMobile } = useIsMobile()
  const isEditMode = mode === 'edit'

  const fields: BaseFormField<InformationPayload>[] = [
    {
      name: 'title',
      label: 'Titulo',
      placeholder: 'Titulo Principal',
      rules: { required: 'Titulo requerido.' },
    },
    {
      name: 'value',
      label: 'Contenido',
      placeholder: 'Escribe el contenido de texto...',
      multiline: true,
      rows: 8,
      rules: { required: 'Contenido requerido.' },
    },
  ]

  if (!isEditMode) {
    fields.unshift({
      name: 'key',
      label: 'Clave',
      placeholder: 'hero_title',
      rules: { required: 'Clave requerida.' },
    })

    fields.splice(2, 0, {
      name: 'section',
      label: 'Seccion',
      placeholder: 'Seleccionar seccion',
      select: true,
      options: sectionOptions,
      rules: { required: 'Seccion requerida.' },
    })
  }

  return (
    <BaseForm<InformationPayload>
      className='space-y-3'
      defaultValues={{
        key: initialValues?.key ?? '',
        title: initialValues?.title ?? '',
        section: initialValues?.section ?? 'HERO',
        value: initialValues?.value ?? '',
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        if (isEditMode) {
          const parsed = informationEditSchema.safeParse(values)

          if (!parsed.success) {
            const firstIssue = parsed.error.issues[0]

            if (firstIssue?.path?.[0]) {
              methods.setError(firstIssue.path[0] as keyof InformationPayload, {
                message: firstIssue.message,
              })
            }

            toast.error(firstIssue?.message ?? 'Datos invalidos.')
            return
          }

          const originalKey = initialValues?.key?.trim()

          if (!originalKey) {
            toast.error('No se pudo determinar la clave del registro.')
            return
          }

          const originalSection = initialValues?.section

          if (!originalSection) {
            toast.error('No se pudo determinar la seccion del registro.')
            return
          }

          await onSubmit({
            key: originalKey,
            title: parsed.data.title,
            section: originalSection,
            value: parsed.data.value,
          })
          return
        }

        const parsed = informationSchema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof InformationPayload, {
              message: firstIssue.message,
            })
          }

          toast.error(firstIssue?.message ?? 'Datos invalidos.')
          return
        }

        await onSubmit(parsed.data)
      }}
      width={isMobile ? '100%' : 760}
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
              text={mode === 'creation' ? 'Crear informacion' : 'Guardar cambios'}
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
