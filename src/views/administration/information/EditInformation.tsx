import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import InformationForm from '@/views/administration/information/components/InformationForm'
import useInformationQuery from '@/hooks/useInformationQuery'
import useUpdateInformationMutation from '@/hooks/useUpdateInformationMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function EditInformation() {
  usePageTitle('Editar informacion')

  const navigate = useNavigate()
  const { id } = useParams()
  const informationId = Number(id)
  const hasValidId = Number.isFinite(informationId) && informationId > 0

  const informationQuery = useInformationQuery(hasValidId ? informationId : null)
  const updateInformationMutation = useUpdateInformationMutation()

  if (!hasValidId) {
    return <Typography color='error'>Identificador de informacion invalido.</Typography>
  }

  if (informationQuery.isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <CircularProgress />
      </div>
    )
  }

  if (informationQuery.isError || !informationQuery.data) {
    return <Typography color='error'>No se pudo cargar la informacion.</Typography>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar informacion</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica el contenido textual mostrado en la landing.
        </Typography>
      </div>

      <InformationForm
        mode='edit'
        initialValues={{
          key: informationQuery.data.key,
          title: informationQuery.data.title,
          section: informationQuery.data.section,
          value: informationQuery.data.value,
        }}
        isSubmitting={updateInformationMutation.isPending}
        onCancel={() => navigate('/information')}
        onSubmit={async (values) => {
          try {
            await updateInformationMutation.mutateAsync({
              id: informationId,
              payload: values,
            })
            toast.success('Informacion actualizada correctamente.')
            navigate('/information')
          } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo actualizar la informacion.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
