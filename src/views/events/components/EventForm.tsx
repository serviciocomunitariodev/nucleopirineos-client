import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'

export type EventFormMode = 'creation' | 'edit'

export type EventFormSubmitValues = {
  title: string
  description: string
  startDate: string
  endDate?: string
  location: string
  time: string
}

type EventFormValues = {
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  time: string
}

type EventFormProps = {
  mode: EventFormMode
  initialValues?: Partial<EventFormValues>
  isSubmitting?: boolean
  onSubmit: (values: EventFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const eventSchema = z
  .object({
    title: z.string().min(2, 'Titulo requerido.'),
    description: z.string().min(2, 'Descripcion requerida.'),
    startDate: z.string().min(1, 'Fecha de inicio requerida.'),
    endDate: z.string().optional(),
    location: z.string().min(2, 'Ubicacion requerida.'),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora invalida.'),
  })
  .superRefine((data, context) => {
    if (data.endDate && data.endDate < data.startDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'La fecha de fin no puede ser menor a la fecha de inicio.',
      })
    }
  })

export default function EventForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const { isMobile } = useIsMobile()

  const fields: BaseFormField<EventFormValues>[] = [
    {
      name: 'title',
      label: 'Titulo',
      placeholder: 'Titulo del evento',
      rules: { required: 'Titulo requerido.' },
    },
    {
      name: 'description',
      label: 'Descripcion',
      placeholder: 'Descripcion del evento',
      multiline: true,
      rows: 4,
      rules: { required: 'Descripcion requerida.' },
    },
    {
      name: 'startDate',
      label: 'Fecha inicio',
      type: 'date',
      rules: { required: 'Fecha de inicio requerida.' },
    },
    {
      name: 'endDate',
      label: 'Fecha fin',
      type: 'date',
      placeholder: 'Opcional',
    },
    {
      name: 'location',
      label: 'Ubicacion',
      placeholder: 'Ubicacion',
      rules: { required: 'Ubicacion requerida.' },
    },
    {
      name: 'time',
      label: 'Hora',
      type: 'time',
      rules: { required: 'Hora requerida.' },
    },
  ]

  return (
    <BaseForm<EventFormValues>
      className='space-y-3'
      defaultValues={{
        title: initialValues?.title ?? '',
        description: initialValues?.description ?? '',
        startDate: initialValues?.startDate ?? '',
        endDate: initialValues?.endDate ?? '',
        location: initialValues?.location ?? '',
        time: initialValues?.time ?? '',
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        const parsed = eventSchema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof EventFormValues, {
              message: firstIssue.message,
            })
          }

          toast.error(firstIssue?.message ?? 'Datos invalidos.')
          return
        }

        await onSubmit({
          ...parsed.data,
          endDate: parsed.data.endDate?.trim() ? parsed.data.endDate : undefined,
        })
      }}
      width={isMobile ? '100%' : 680}
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
              text={mode === 'creation' ? 'Crear evento' : 'Guardar cambios'}
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
