import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Alert, Box, CircularProgress, Typography, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { BaseButton } from '@/components/BaseButton'
import BaseModal from '@/components/BaseModal'
import useEducationalMaterialQuery from '@/hooks/useEducationalMaterialQuery'
import useDeleteEducationalMaterialMutation from '@/hooks/useDeleteEducationalMaterialMutation'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { UserRole } from '@/types/user'

export default function ResourceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const resourceId = Number(id)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data: resource, isLoading, isError } = useEducationalMaterialQuery(resourceId)
  const deleteResourceMutation = useDeleteEducationalMaterialMutation()
  
  const userRole = useAppStore((state) => state.user.role)
  const canEditOrDelete = userRole === UserRole.PROFESSOR || userRole === UserRole.ADMIN

  const handleDelete = async () => {
    if (!resource) {
      setIsDeleteModalOpen(false)
      return
    }

    try {
      await deleteResourceMutation.mutateAsync(resourceId)
      toast.success('Recurso eliminado correctamente.')
      navigate('/educational-materials')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el recurso.'
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

  if (isError || !resource) {
    return <Alert severity='error'>No se pudo cargar el recurso.</Alert>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Detalles del Recurso</Typography>
        <Typography color='text.secondary' variant='body2'>
          Información detallada del recurso educativo seleccionado.
        </Typography>
      </div>

      <Paper className='p-6 space-y-4 rounded-2xl shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Typography variant='subtitle2' color='text.secondary'>Nombre</Typography>
            <Typography variant='body1' className='font-medium'>{resource.title}</Typography>
          </div>
          <div>
            <Typography variant='subtitle2' color='text.secondary'>Profesor</Typography>
            <Typography variant='body1' className='font-medium'>{resource.professor?.fullName ?? 'Sin profesor'}</Typography>
          </div>
          <div>
            <Typography variant='subtitle2' color='text.secondary'>Cátedra</Typography>
            <Typography variant='body1' className='font-medium'>{resource.subject?.name ?? 'Sin cátedra'}</Typography>
          </div>
          <div>
            <Typography variant='subtitle2' color='text.secondary'>Fecha de subida</Typography>
            <Typography variant='body1' className='font-medium'>
              {new Date(resource.uploadDate).toLocaleDateString()}
            </Typography>
          </div>
          <div className='md:col-span-2'>
            <div className='mt-2'>
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className='inline-flex items-center justify-center h-11 px-6 rounded-[10px] bg-secondary text-base font-semibold text-black shadow-[0px_2px_4px_rgba(0,0,0,0.25)] transition-colors hover:brightness-90'
              >
                Ver archivo
              </a>
            </div>
          </div>
        </div>

        <Divider className='my-6' />

        <div className='flex flex-col min-[816px]:flex-row gap-3 my-6 justify-between'>
          <div className='w-full min-[816px]:w-[150px]'>
            <BaseButton
              fullWidth
              onClick={() => navigate('/educational-materials')}
              text='Volver'
              tone='secondary'
              startIcon={<ArrowBackIcon />}
            />
          </div>
          
          {canEditOrDelete && (
            <div className='flex gap-2 max-[816px]:flex-col'>
              <div className='w-full min-[816px]:w-[150px]'>
                <BaseButton
                  fullWidth
                  onClick={() => navigate(`/educational-materials/${resource.id}/edit`)}
                  text='Editar'
                  startIcon={<EditIcon />}
                />
              </div>
              <div className='w-full min-[816px]:w-[150px]'>
                <BaseButton
                  fullWidth
                  onClick={() => setIsDeleteModalOpen(true)}
                  text='Eliminar'
                  loading={deleteResourceMutation.isPending}
                  startIcon={<DeleteIcon />}
                />
              </div>
            </div>
          )}

        </div>
      </Paper>
      <BaseModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Eliminar recurso ${resource.title}`}
        description='¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.'
        actions={(
          <>
            <BaseButton
              fullWidth={false}
              onClick={() => setIsDeleteModalOpen(false)}
              text='Cancelar'
              tone='secondary'
            />
            <BaseButton
              fullWidth={false}
              loading={deleteResourceMutation.isPending}
              onClick={handleDelete}
              text='Eliminar'
            />
          </>
        )}
      />
    </main>
  )
}
