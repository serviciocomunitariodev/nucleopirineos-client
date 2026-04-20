import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProfessorForm from '@/views/users/professors/components/ProfessorForm'
import useCreateProfessorMutation from '@/hooks/useCreateProfessorMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NewProfessor() {
  usePageTitle('Nuevo profesor')

  const navigate = useNavigate()
  const createProfessorMutation = useCreateProfessorMutation()

  const handleSubmit = async (values: {
    firstName: string
    lastName: string
    email: string
    password?: string
    academicLevelIds: number[]
    subjectIds: number[]
  }) => {
    if (!values.password) {
      toast.error('La contrasena es obligatoria para crear el usuario.')
      return
    }

    try {
      await createProfessorMutation.mutateAsync({
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        },
        professor: {
          academicLevelIds: values.academicLevelIds,
          subjectIds: values.subjectIds,
        },
      })

      toast.success('Profesor creado correctamente.')
      navigate('/users/professors')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el profesor.'
      toast.error(message)
    }
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nuevo profesor</Typography>
        <Typography color='text.secondary' variant='body2'>
          Completa la informacion para crear un nuevo profesor.
        </Typography>
      </div>

      <ProfessorForm
        mode='creation'
        isSubmitting={createProfessorMutation.isPending}
        onCancel={() => navigate('/users/professors')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
