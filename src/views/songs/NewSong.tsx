import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Typography } from '@mui/material'
import useCreateSongMutation from '@/hooks/useCreateSongMutation'
import SongForm from './components/SongForm'

export default function NewSong() {
  const navigate = useNavigate()
  const createSongMutation = useCreateSongMutation()

  const handleSubmit = async (values: any) => {
    try {
      await createSongMutation.mutateAsync(values)
      toast.success('Cancion creada correctamente.')
      navigate('/songs')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear la cancion.'
      toast.error(message)
    }
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nueva Cancion</Typography>
        <Typography color='text.secondary' variant='body2'>
          Ingresa los detalles para crear una nueva cancion.
        </Typography>
      </div>

      <SongForm
        mode='creation'
        onCancel={() => navigate('/songs')}
        onSubmit={handleSubmit}
        isSubmitting={createSongMutation.isPending}
      />
    </main>
  )
}
