import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import SongCategoryForm from '@/views/administration/categories/components/SongCategoryForm'
import useSongCategoryQuery from '@/hooks/useSongCategoryQuery'
import useUpdateSongCategoryMutation from '@/hooks/useUpdateSongCategoryMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function EditSongCategory() {
  usePageTitle('Editar categoria')

  const navigate = useNavigate()
  const { id } = useParams()
  const categoryId = Number(id)
  const hasValidId = Number.isFinite(categoryId) && categoryId > 0

  const songCategoryQuery = useSongCategoryQuery(hasValidId ? categoryId : null)
  const updateSongCategoryMutation = useUpdateSongCategoryMutation()

  if (!hasValidId) {
    return <Typography color='error'>Identificador de categoria invalido.</Typography>
  }

  if (songCategoryQuery.isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <CircularProgress />
      </div>
    )
  }

  if (songCategoryQuery.isError || !songCategoryQuery.data) {
    return <Typography color='error'>No se pudo cargar la categoria.</Typography>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar categoria</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica la informacion de la categoria.
        </Typography>
      </div>

      <SongCategoryForm
        mode='edit'
        initialValues={{
          name: songCategoryQuery.data.name,
        }}
        isSubmitting={updateSongCategoryMutation.isPending}
        onCancel={() => navigate('/song-categories')}
        onSubmit={async (values) => {
          try {
            await updateSongCategoryMutation.mutateAsync({
              id: categoryId,
              payload: values,
            })
            toast.success('Categoria actualizada correctamente.')
            navigate('/song-categories')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'No se pudo actualizar la categoria.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
