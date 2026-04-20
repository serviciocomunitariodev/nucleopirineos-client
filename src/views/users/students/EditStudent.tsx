import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import StudentForm from '@/views/users/students/components/StudentForm'
import useStudentByUserIdQuery from '@/hooks/useStudentByUserIdQuery'
import useUpdateStudentMutation from '@/hooks/useUpdateStudentMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function EditStudent() {
  usePageTitle('Editar estudiante')

  const navigate = useNavigate()
  const { id } = useParams()
  const userId = Number(id)
  const hasValidUserId = Number.isFinite(userId) && userId > 0

  const studentQuery = useStudentByUserIdQuery(hasValidUserId ? userId : null)
  const updateStudentMutation = useUpdateStudentMutation()

  if (!hasValidUserId) {
    return <Typography color='error'>Identificador de usuario invalido.</Typography>
  }

  const student = studentQuery.data

  if (studentQuery.isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <CircularProgress />
      </div>
    )
  }

  if (studentQuery.isError || !student) {
    return <Typography color='error'>No se pudo cargar la informacion del estudiante.</Typography>
  }

  const handleSubmit = async (values: {
    firstName: string
    lastName: string
    email: string
    age: number
    principalSubjectId: number | null
    complementarySubjectIds: number[]
    password?: string
  }) => {
    try {
      await updateStudentMutation.mutateAsync({
        userId,
        studentId: student.id,
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          ...(values.password ? { password: values.password } : {}),
        },
        student: {
          age: values.age,
          principalSubjectId: values.principalSubjectId,
          complementarySubjectIds: values.complementarySubjectIds,
        },
      })

      toast.success('Estudiante actualizado correctamente.')
      navigate('/users/students')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el estudiante.'
      toast.error(message)
    }
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar estudiante</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica los datos generales y academicos del estudiante.
        </Typography>
      </div>

      <StudentForm
        mode='edit'
        initialValues={{
          firstName: student.user.firstName,
          lastName: student.user.lastName,
          email: student.user.email,
          age: student.age,
          principalSubjectId: student.principalSubjectId ?? '',
          complementarySubjectIds: student.complementarySubjects.map((subject) => subject.id),
        }}
        isSubmitting={updateStudentMutation.isPending}
        onCancel={() => navigate('/users/students')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
