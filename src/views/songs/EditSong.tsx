import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Alert, CircularProgress, Typography } from '@mui/material'
import useSongQuery from '@/hooks/useSongQuery'
import useUpdateSongMutation from '@/hooks/useUpdateSongMutation'
import SongForm from './components/SongForm'

export default function EditSong() {
  const { id } = useParams()
  const navigate = useNavigate()
  const songId = Number(id)

  const { data: song, isLoading, isError } = useSongQuery(songId)
  const updateSongMutation = useUpdateSongMutation()

  const handleSubmit = async (values: any) => {
    try {
      await updateSongMutation.mutateAsync({ id: songId, payload: values })
      toast.success('Cancion actualizada correctamente.')
      navigate('/songs')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar la cancion.'
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <CircularProgress />
      </div>
    )
  }

  if (isError || !song) {
    return <Alert severity='error'>No se pudo cargar la cancion.</Alert>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar Cancion</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica los detalles de la cancion.
        </Typography>
      </div>

      <SongForm
        mode='edit'
        initialValues={{
          title: song.title,
          url: song.url,
          categoryId: song.categoryId,
        }}
        onCancel={() => navigate('/songs')}
        onSubmit={handleSubmit}
        isSubmitting={updateSongMutation.isPending}
      />
    </main>
  )
}
