import { useState, useMemo, useRef } from 'react'
import { Typography } from '@mui/material'
import { File } from 'lucide-react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'
import useProfessorsQuery from '@/hooks/useProfessorsQuery'
import useSubjectsQuery from '@/hooks/useSubjectsQuery'
import { validateFileSize } from '@/utils/sizeLimitUtil'

export type ResourceFormMode = 'creation' | 'edit'

export type ResourceFormSubmitValues = {
  title: string
  professorId: number
  subjectId: number
  file?: File
}

type ResourceFormValues = {
  title: string
  professorId: string | ''
  subjectId: string | ''
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
})

export default function ResourceForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: ResourceFormProps) {
  const { isMobile } = useIsMobile()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)

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

        if (mode === 'creation' && !file) {
          toast.error('Debes adjuntar un archivo.')
          return
        }

        await onSubmit({ ...parsed.data, file: file || undefined })
      }}
      width={isMobile ? '100%' : 640}
    >
      {() => {
        const fileName = file ? file.name : (initialValues?.title ? `Archivo de ${initialValues.title}` : '')

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
                <Typography className='text-gray-500 text-center text-sm mt-[-4px] mb-2'>
                  (Máx. 5MB)
                </Typography>

                <input
                  accept='*/*'
                  className='hidden'
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0]

                    if (!selectedFile) {
                      return
                    }

                    if (!validateFileSize(selectedFile, 5, fileInputRef)) {
                      return
                    }

                    setFile(selectedFile)
                  }}
                  ref={fileInputRef}
                  type='file'
                />

                <div className="flex flex-col gap-2 w-full max-w-[260px]">
                  <button
                    className='h-11 w-full rounded-[10px] bg-secondary text-base font-semibold text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#854339]'
                    onClick={() => fileInputRef.current?.click()}
                    type='button'
                  >
                    {file ? 'Cambiar archivo' : 'Subir archivo'}
                  </button>

                  {mode === 'edit' && !file && initialValues?.fileUrl ? (
                    <a
                      href={initialValues.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='flex items-center justify-center h-11 w-full rounded-[10px] border border-secondary text-secondary text-base font-semibold shadow-[0px_2px_4px_rgba(0,0,0,0.05)] transition-colors hover:bg-secondary hover:text-white'
                    >
                      Ver archivo actual
                    </a>
                  ) : null}
                </div>

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
