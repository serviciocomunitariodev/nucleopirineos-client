import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SubjectForm from '@/views/administration/subjects/components/SubjectForm'
import useCreateSubjectMutation from '@/hooks/useCreateSubjectMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NewSubject() {
  usePageTitle('Nueva catedra')

  const navigate = useNavigate()
  const createSubjectMutation = useCreateSubjectMutation()

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nueva catedra</Typography>
        <Typography color='text.secondary' variant='body2'>
          Completa la informacion para crear una nueva catedra.
        </Typography>
      </div>

      <SubjectForm
        mode='creation'
        isSubmitting={createSubjectMutation.isPending}
        onCancel={() => navigate('/subjects')}
        onSubmit={async (values) => {
          try {
            await createSubjectMutation.mutateAsync(values)
            toast.success('Catedra creada correctamente.')
            navigate('/subjects')
          } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo crear la catedra.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
