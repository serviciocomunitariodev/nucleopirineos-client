import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'
import useSongCategoriesQuery from '@/hooks/useSongCategoriesQuery'

export type SongFormMode = 'creation' | 'edit'

export type SongFormSubmitValues = {
  title: string
  url: string
  categoryId: number
}

type SongFormValues = {
  title: string
  url: string
  categoryId: string | ''
}

type SongFormProps = {
  mode: SongFormMode
  initialValues?: Partial<{
    title: string
    url: string
    categoryId: number | string
  }>
  isSubmitting?: boolean
  onSubmit: (values: SongFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const songSchema = z.object({
  title: z.string().min(2, 'Titulo requerido.'),
  url: z.string().url('URL invalida.'),
  categoryId: z.coerce.number().int().positive('Categoria requerida.'),
})

export default function SongForm({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SongFormProps) {
  const { isMobile } = useIsMobile()
  const { data: categories = [], isLoading: isLoadingCategories } = useSongCategoriesQuery()

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: String(cat.id),
  }))

  const fields: BaseFormField<SongFormValues>[] = [
    {
      name: 'title',
      label: 'Titulo',
      placeholder: 'Titulo de la cancion',
      rules: { required: 'Titulo requerido.' },
    },
    {
      name: 'url',
      label: 'URL (Video/Audio)',
      placeholder: 'https://youtube.com/...',
      rules: { required: 'URL requerida.' },
    },
    {
      name: 'categoryId',
      label: 'Categoria',
      placeholder: isLoadingCategories ? 'Cargando categorias...' : 'Selecciona una categoria',
      select: true,
      options: categoryOptions,
      rules: { required: 'Categoria requerida.' },
      disabled: isLoadingCategories,
    },
  ]

  return (
    <BaseForm<SongFormValues>
      className='space-y-3'
      defaultValues={{
        title: initialValues?.title ?? '',
        url: initialValues?.url ?? '',
        categoryId: initialValues?.categoryId ? String(initialValues.categoryId) : '',
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        const parsed = songSchema.safeParse(values)

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof SongFormValues, {
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
              text={mode === 'creation' ? 'Crear cancion' : 'Guardar cambios'}
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
