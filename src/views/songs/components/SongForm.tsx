import { useState, useRef } from 'react'
import { Typography } from '@mui/material'
import { File } from 'lucide-react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BaseButton } from '@/components/BaseButton'
import { BaseForm, type BaseFormField } from '@/components/BaseForm'
import { useIsMobile } from '@/hooks/useIsMobile'
import useSongCategoriesQuery from '@/hooks/useSongCategoriesQuery'
import { validateFileSize } from '@/utils/sizeLimitUtil'

export type SongFormMode = 'creation' | 'edit'

export type SongFormSubmitValues = {
  title: string
  categoryId: number
  file?: File
  url?: string
}

type SongFormValues = {
  title: string
  categoryId: string | ''
}

type SongFormProps = {
  mode: SongFormMode
  initialValues?: Partial<{
    title: string
    url: string
    categoryId: number | string
    isExternalUrl: boolean
  }>
  isSubmitting?: boolean
  onSubmit: (values: SongFormSubmitValues) => void | Promise<void>
  onCancel?: () => void
}

const songSchema = z.object({
  title: z.string().min(2, 'Titulo requerido.'),
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { data: categories = [], isLoading: isLoadingCategories } = useSongCategoriesQuery()
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string>(initialValues?.isExternalUrl && initialValues?.url ? initialValues.url : '')
  const [activeTab, setActiveTab] = useState<'file' | 'url'>(initialValues?.isExternalUrl ? 'url' : 'file')

  const handleTabChange = (tab: 'file' | 'url') => {
    setActiveTab(tab)
    if (tab === 'file') {
      setUrl('')
    } else {
      setFile(null)
    }
  }

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

        if (mode === 'creation' && !file && !url) {
          toast.error('Debes adjuntar un archivo o ingresar una URL.')
          return
        }

        await onSubmit({ ...parsed.data, file: file || undefined, url: url || undefined })
      }}
      width={isMobile ? '100%' : 640}
    >
      {() => {
        const fileName = file ? file.name : (initialValues?.title ? `Archivo de ${initialValues.title}` : '')

        return (
          <div className='flex flex-col gap-3 pt-2'>
            <section className='rounded-[10px] border border-slate-400 p-4 flex flex-col items-center'>
              <div className="flex bg-gray-200 rounded-[10px] p-1 w-full max-w-[400px] mb-4">
                <button
                  type="button"
                  onClick={() => handleTabChange('file')}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'file' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                >
                  Archivo subido
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('url')}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'url' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                >
                  URL externa
                </button>
              </div>

              {activeTab === 'file' && (
                <div className='flex flex-col items-center gap-3 w-full'>
                  <div className='flex h-[76px] w-[76px] items-center justify-center rounded-[10px]  bg-white'>
                    <File size={80} strokeWidth={1.5} />
                  </div>

                  <Typography className='text-ownText text-center text-base'>
                    {fileName || 'Nombre del archivo'}
                  </Typography>
                  <Typography className='text-gray-500 text-center text-sm mt-[-4px] mb-2'>
                    Solo se aceptan archivos .mp3 (Máx. 4MB)
                  </Typography>

                  <input
                    accept='.mp3,audio/mpeg'
                    className='hidden'
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0]

                      if (!selectedFile) {
                        return
                      }

                      if (!validateFileSize(selectedFile, 4, fileInputRef)) {
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

                    {mode === 'edit' && !file && initialValues?.url && !initialValues.isExternalUrl ? (
                      <a
                        href={initialValues.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='flex items-center justify-center h-11 w-full rounded-[10px] border border-secondary text-secondary text-base font-semibold shadow-[0px_2px_4px_rgba(0,0,0,0.05)] transition-colors hover:bg-secondary hover:text-white'
                      >
                        Ver archivo actual
                      </a>
                    ) : null}
                  </div>
                </div>
              )}

              {activeTab === 'url' && (
                <div className='flex flex-col w-full max-w-[400px] gap-2 py-4'>
                  <label htmlFor="song-url" className="text-sm font-semibold text-gray-700">
                    URL de la canción (Ej: YouTube, Spotify)
                  </label>
                  <input
                    id="song-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full h-11 px-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                  {mode === 'edit' && initialValues?.url && initialValues.isExternalUrl ? (
                    <a
                      href={initialValues.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-secondary hover:underline mt-1 inline-block text-center"
                    >
                      Ver URL actual
                    </a>
                  ) : null}
                </div>
              )}
            </section>
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
          </div>
        )
      }}
    </BaseForm>
  )
}
