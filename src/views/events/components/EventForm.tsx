import { Typography } from '@mui/material'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import useAcademicLevelsQuery from '@/hooks/useAcademicLevelsQuery'
import { useIsMobile } from '@/hooks/useIsMobile'
import useSubjectsQuery from '@/hooks/useSubjectsQuery'

export type EventFormMode = 'creation' | 'edit'

export type EventFormSubmitValues = {
  title: string
  description: string
  startDate: string
  endDate?: string
  endTime?: string
  location: string
  responsible?: string
  time: string
  subjectId?: number
  academicLevelId?: number
}

type EventFormValues = {
  title: string
  description: string
  startDate: string
  endDate: string
  endTime: string
  location: string
  responsible: string
  time: string
  subjectId: string
  academicLevelId: string
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
    endTime: z.string().optional(),
    location: z.string().min(2, 'Ubicacion requerida.'),
    responsible: z.string().optional(),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora invalida.'),
    subjectId: z.string().optional(),
    academicLevelId: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.endDate && data.endDate < data.startDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'La fecha de fin no puede ser menor a la fecha de inicio.',
      })
    }

    if (data.endTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.endTime)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Hora de fin invalida.',
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
  const subjectsQuery = useSubjectsQuery()
  const academicLevelsQuery = useAcademicLevelsQuery()

  const subjectOptions = useMemo(
    () =>
      (subjectsQuery.data ?? []).map((subject) => ({
        value: String(subject.id),
        label: `${subject.name} (${subject.type})`,
      })),
    [subjectsQuery.data],
  )

  const academicLevelOptions = useMemo(
    () =>
      (academicLevelsQuery.data ?? []).map((level) => ({
        value: String(level.id),
        label: level.name,
      })),
    [academicLevelsQuery.data],
  )

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
      label: 'Fecha fin (opcional)',
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
    {
      name: 'endTime',
      label: 'Hora fin (opcional)',
      type: 'time',
      placeholder: 'Opcional',
    },
    {
      name: 'responsible',
      label: 'Responsable (opcional)',
      placeholder: 'Nombre del responsable',
    },
    {
      name: 'subjectId',
      label: 'Catedra (opcional)',
      placeholder: 'Selecciona una catedra',
      select: true,
      options: subjectOptions,
    },
    {
      name: 'academicLevelId',
      label: 'Nivel academico (opcional)',
      placeholder: 'Selecciona un nivel academico',
      select: true,
      options: academicLevelOptions,
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
        endTime: initialValues?.endTime ?? '',
        location: initialValues?.location ?? '',
        responsible: initialValues?.responsible ?? '',
        time: initialValues?.time ?? '',
        subjectId: initialValues?.subjectId ? String(initialValues.subjectId) : '',
        academicLevelId: initialValues?.academicLevelId ? String(initialValues.academicLevelId) : '',
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
          endTime: parsed.data.endTime?.trim() ? parsed.data.endTime : undefined,
          responsible: parsed.data.responsible?.trim() ? parsed.data.responsible.trim() : undefined,
          subjectId: parsed.data.subjectId?.trim() ? Number(parsed.data.subjectId) : undefined,
          academicLevelId: parsed.data.academicLevelId?.trim()
            ? Number(parsed.data.academicLevelId)
            : undefined,
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
