import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProfessorForm from '@/views/users/professors/components/ProfessorForm'
import useProfessorByUserIdQuery from '@/hooks/useProfessorByUserIdQuery'
import useUpdateProfessorMutation from '@/hooks/useUpdateProfessorMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function EditProfessor() {
  usePageTitle('Editar profesor')

  const navigate = useNavigate()
  const { id } = useParams()
  const userId = Number(id)
  const hasValidUserId = Number.isFinite(userId) && userId > 0

  const professorQuery = useProfessorByUserIdQuery(hasValidUserId ? userId : null)
  const updateProfessorMutation = useUpdateProfessorMutation()

  if (!hasValidUserId) {
    return <Typography color='error'>Identificador de usuario invalido.</Typography>
  }

  const professor = professorQuery.data

  if (professorQuery.isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <CircularProgress />
      </div>
    )
  }

  if (professorQuery.isError || !professor) {
    return <Typography color='error'>No se pudo cargar la informacion del profesor.</Typography>
  }

  const handleSubmit = async (values: {
    firstName: string
    lastName: string
    email: string
    password?: string
    academicLevelIds: number[]
    subjectIds: number[]
  }) => {
    try {
      await updateProfessorMutation.mutateAsync({
        userId,
        professorId: professor.id,
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          ...(values.password ? { password: values.password } : {}),
        },
        professor: {
          academicLevelIds: values.academicLevelIds,
          subjectIds: values.subjectIds,
        },
      })

      toast.success('Profesor actualizado correctamente.')
      navigate('/users/professors')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el profesor.'
      toast.error(message)
    }
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar profesor</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica los datos generales y academicos del profesor.
        </Typography>
      </div>

      <ProfessorForm
        mode='edit'
        initialValues={{
          firstName: professor.user.firstName,
          lastName: professor.user.lastName,
          email: professor.user.email,
          academicLevelIds: professor.academicLevels.map((level) => level.id),
          subjectIds: professor.subjects.map((subject) => subject.id),
        }}
        isSubmitting={updateProfessorMutation.isPending}
        onCancel={() => navigate('/users/professors')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
