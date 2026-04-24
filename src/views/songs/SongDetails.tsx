import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Alert, Box, CircularProgress, Typography, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { BaseButton } from '@/components/BaseButton'
import useSongQuery from '@/hooks/useSongQuery'
import useDeleteSongMutation from '@/hooks/useDeleteSongMutation'

export default function SongDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const songId = Number(id)

  const { data: song, isLoading, isError } = useSongQuery(songId)
  const deleteSongMutation = useDeleteSongMutation()

  const handleDelete = async () => {
    const shouldDelete = window.confirm(`¿Está seguro de eliminar la canción "${song?.title}"?`)

    if (!shouldDelete) {
      return
    }

    try {
      await deleteSongMutation.mutateAsync(songId)
      toast.success('Canción eliminada correctamente.')
      navigate('/songs')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar la canción.'
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', h: '200px', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !song) {
    return <Alert severity='error'>No se pudo cargar la canción.</Alert>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Detalles de la Canción</Typography>
        <Typography color='text.secondary' variant='body2'>
          Información detallada de la canción seleccionada.
        </Typography>
      </div>

      <Paper className='p-6 space-y-4 rounded-2xl shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Typography variant='subtitle2' color='text.secondary'>Nombre</Typography>
            <Typography variant='body1' className='font-medium'>{song.title}</Typography>
          </div>
          <div>
            <Typography variant='subtitle2' color='text.secondary'>Categoría</Typography>
            <Typography variant='body1' className='font-medium'>{song.category?.name ?? 'Sin categoría'}</Typography>
          </div>
          <div className='md:col-span-2'>
            <Typography variant='subtitle2' color='text.secondary'>Enlace / URL</Typography>
            <Typography variant='body1' className='break-all text-primary-600'>
              <a href={song.url} target='_blank' rel='noopener noreferrer' className='hover:underline'>
                {song.url}
              </a>
            </Typography>
          </div>
        </div>

        <Divider className='my-6' />

        <div className='flex flex-col min-[816px]:flex-row gap-3 my-6 justify-between'>
          <div className='w-full min-[816px]:w-[150px]'>
            <BaseButton
              fullWidth
              onClick={() => navigate('/songs')}
              text='Volver'
              tone='secondary'
              startIcon={<ArrowBackIcon />}
            />
          </div>
          <div className='flex gap-2 max-[816px]:flex-col'>
            <div className='w-full min-[816px]:w-[150px]'>
              <BaseButton
                fullWidth
                onClick={() => navigate(`/songs/${song.id}/edit`)}
                text='Editar'
                startIcon={<EditIcon />}
              />
            </div>
            <div className='w-full min-[816px]:w-[150px]'>
              <BaseButton
                fullWidth
                onClick={handleDelete}
                text='Eliminar'
                loading={deleteSongMutation.isPending}
                startIcon={<DeleteIcon />}
              />
            </div>
          </div>

        </div>
      </Paper>
    </main>
  )
}
