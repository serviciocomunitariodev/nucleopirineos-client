import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SongCategoryForm from '@/views/administration/categories/components/SongCategoryForm'
import useCreateSongCategoryMutation from '@/hooks/useCreateSongCategoryMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NewSongCategory() {
  usePageTitle('Nueva categoria')

  const navigate = useNavigate()
  const createSongCategoryMutation = useCreateSongCategoryMutation()

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nueva categoria</Typography>
        <Typography color='text.secondary' variant='body2'>
          Completa la informacion para crear una nueva categoria de canciones.
        </Typography>
      </div>

      <SongCategoryForm
        mode='creation'
        isSubmitting={createSongCategoryMutation.isPending}
        onCancel={() => navigate('/song-categories')}
        onSubmit={async (values) => {
          try {
            await createSongCategoryMutation.mutateAsync(values)
            toast.success('Categoria creada correctamente.')
            navigate('/song-categories')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'No se pudo crear la categoria.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
