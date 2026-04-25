import { Typography } from '@mui/material'
import { File } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'
import useProfessorsQuery from '@/hooks/useProfessorsQuery'
import useSubjectsQuery from '@/hooks/useSubjectsQuery'

export type ResourceFormMode = 'creation' | 'edit'

export type ResourceFormSubmitValues = {
  title: string
  professorId: number
  subjectId: number
  fileUrl: string
}

type ResourceFormValues = {
  title: string
  professorId: string | ''
  subjectId: string | ''
  fileUrl: string
}

type ResourceFormProps = {
  mode: ResourceFormMode
  initialValues?: Partial<{
    title: string
    professorId: number | string
    subjectId: number | string
    fileUrl: string
  }>
  isSubmitting?: boolean
  onSubmit: (values: ResourceFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const resourceSchema = z.object({
  title: z.string().min(2, 'Nombre requerido.'),
  professorId: z.coerce.number().int().positive('Profesor requerido.'),
  subjectId: z.coerce.number().int().positive('Catedra requerida.'),
  fileUrl: z.string().min(1, 'Archivo requerido.'),
})

const getFileNameFromUrl = (fileUrl: string) => {
  if (!fileUrl) {
    return ''
  }

  const pathname = fileUrl.split('?')[0] ?? ''
  return pathname.split('/').pop() ?? fileUrl
}

export default function ResourceForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: ResourceFormProps) {
  const { isMobile } = useIsMobile()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const professorsQuery = useProfessorsQuery()
  const subjectsQuery = useSubjectsQuery()

  const professorOptions = useMemo(
    () =>
      (professorsQuery.data ?? []).map((professor) => ({
        label: `${professor.user.firstName} ${professor.user.lastName}`,
        value: String(professor.id),
      })),
    [professorsQuery.data],
  )

  const subjectOptions = useMemo(
    () =>
      (subjectsQuery.data ?? []).map((subject) => ({
        label: subject.name,
        value: String(subject.id),
      })),
    [subjectsQuery.data],
  )

  const fields: BaseFormField<ResourceFormValues>[] = [
    {
      name: 'title',
      label: 'Nombre',
      placeholder: 'Nombre',
      rules: { required: 'Nombre requerido.' },
    },
    {
      name: 'professorId',
      label: 'Profesor',
      placeholder: professorsQuery.isLoading ? 'Cargando profesores...' : 'Seleccionar profesor',
      select: true,
      options: professorOptions,
      rules: { required: 'Profesor requerido.' },
      disabled: professorsQuery.isLoading,
    },
    {
      name: 'subjectId',
      label: 'Catedra',
      placeholder: subjectsQuery.isLoading ? 'Cargando catedras...' : 'Seleccionar catedra',
      select: true,
      options: subjectOptions,
      rules: { required: 'Catedra requerida.' },
      disabled: subjectsQuery.isLoading,
    },
  ]

  return (
    <BaseForm<ResourceFormValues>
      className='space-y-3'
      defaultValues={{
        title: initialValues?.title ?? '',
        professorId: initialValues?.professorId ? String(initialValues.professorId) : '',
        subjectId: initialValues?.subjectId ? String(initialValues.subjectId) : '',
        fileUrl: initialValues?.fileUrl ?? '',
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        const parsed = resourceSchema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof ResourceFormValues, {
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
      {({ methods }) => {
        const fileUrlValue = methods.watch('fileUrl')
        const fileName = getFileNameFromUrl(fileUrlValue)
        const fileError = methods.formState.errors.fileUrl?.message

        return (
          <div className='space-y-3 pt-2'>
            <section className='rounded-[10px] border border-slate-400 p-4'>
              <div className='flex flex-col items-center gap-3'>
                <div className='flex h-[76px] w-[76px] items-center justify-center rounded-[10px]  bg-white'>
                  <File size={80} strokeWidth={1.5} />
                </div>

                <Typography className='text-ownText text-center text-base'>
                  {fileName || 'Nombre del archivo'}
                </Typography>

                <input
                  accept='*/*'
                  className='hidden'
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0]

                    if (!selectedFile) {
                      return
                    }

                    methods.setValue('fileUrl', `uploads/${selectedFile.name}`, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                    methods.clearErrors('fileUrl')
                  }}
                  ref={fileInputRef}
                  type='file'
                />

                <button
                  className='h-11 w-full max-w-[260px] rounded-[10px] bg-secondary text-base font-semibold text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#854339]'
                  onClick={() => fileInputRef.current?.click()}
                  type='button'
                >
                  Subir archivo
                </button>

                {fileError ? <Typography color='error'>{String(fileError)}</Typography> : null}
              </div>
            </section>

            {professorsQuery.isError || subjectsQuery.isError ? (
              <Typography color='error' variant='body2'>
                No se pudieron cargar los catalogos del formulario.
              </Typography>
            ) : null}

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
                  text={mode === 'creation' ? 'Crear recurso' : 'Guardar cambios'}
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
