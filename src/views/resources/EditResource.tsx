import { Alert, CircularProgress, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useState } from 'react'
import BaseModal from '@/components/BaseModal'
import { BaseButton } from '@/components/BaseButton'
import useEducationalMaterialQuery from '@/hooks/useEducationalMaterialQuery'
import useUpdateEducationalMaterialMutation from '@/hooks/useUpdateEducationalMaterialMutation'
import useDeleteEducationalMaterialMutation from '@/hooks/useDeleteEducationalMaterialMutation'
import ResourceForm, { type ResourceFormSubmitValues } from './components/ResourceForm'

export default function EditResource() {
  const { id } = useParams()
  const navigate = useNavigate()
  const educationalMaterialId = Number(id)

  const educationalMaterialQuery = useEducationalMaterialQuery(educationalMaterialId)
  const updateEducationalMaterialMutation = useUpdateEducationalMaterialMutation()
  const deleteEducationalMaterialMutation = useDeleteEducationalMaterialMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleSubmit = async (values: ResourceFormSubmitValues) => {
    try {
      await updateEducationalMaterialMutation.mutateAsync({
        id: educationalMaterialId,
        payload: values,
      })
      toast.success('Recurso actualizado correctamente.')
      navigate('/educational-materials')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el recurso.'
      toast.error(message)
    }
  }

  if (educationalMaterialQuery.isLoading) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <CircularProgress />
      </div>
    )
  }

  if (educationalMaterialQuery.isError || !educationalMaterialQuery.data) {
    return <Alert severity='error'>No se pudo cargar el recurso.</Alert>
  }

  return (
    <main className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <Typography variant='h5'>Editar Recurso</Typography>
          <Typography color='text.secondary' variant='body2'>
            Modifica los detalles del recurso educativo.
          </Typography>
        </div>
        <IconButton
          color='error'
          disabled={deleteEducationalMaterialMutation.isPending}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </div>

      <ResourceForm
        initialValues={{
          title: educationalMaterialQuery.data.title,
          professorId: educationalMaterialQuery.data.professorId,
          subjectId: educationalMaterialQuery.data.subjectId,
          fileUrl: educationalMaterialQuery.data.fileUrl,
        }}
        isSubmitting={updateEducationalMaterialMutation.isPending}
        mode='edit'
        onCancel={() => navigate('/educational-materials')}
        onSubmit={handleSubmit}
      />

      <BaseModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Eliminar recurso ${educationalMaterialQuery.data.title}`}
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
              loading={deleteEducationalMaterialMutation.isPending}
              onClick={async () => {
                try {
                  await deleteEducationalMaterialMutation.mutateAsync(educationalMaterialId)
                  toast.success('Recurso eliminado correctamente.')
                  setIsDeleteModalOpen(false)
                  navigate('/educational-materials')
                } catch (error) {
                  const message = error instanceof Error ? error.message : 'No se pudo eliminar el recurso.'
                  toast.error(message)
                }
              }}
              text='Eliminar'
            />
          </>
        )}
      />
    </main>
  )
}
