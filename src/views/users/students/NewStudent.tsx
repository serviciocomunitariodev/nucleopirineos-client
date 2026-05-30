import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import StudentForm from '@/views/users/students/components/StudentForm'
import useCreateStudentMutation from '@/hooks/useCreateStudentMutation'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { StudentFormSubmitValues } from '@/views/users/students/components/StudentForm'

export default function NewStudent() {
  usePageTitle('Nuevo estudiante')

  const navigate = useNavigate()
  const createStudentMutation = useCreateStudentMutation()

  const handleSubmit = async (values: StudentFormSubmitValues) => {
    if (!values.password) {
      toast.error('La contrasena es obligatoria para crear el usuario.')
      return
    }

    try {
      await createStudentMutation.mutateAsync({
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        },
        student: {
          age: values.age,
          academicLevelId: values.academicLevelId,
          principalSubjectId: values.principalSubjectId ?? undefined,
        },
      })

      toast.success('Estudiante creado correctamente.')
      navigate('/users/students')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el estudiante.'
      toast.error(message)
    }
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nuevo estudiante</Typography>
        <Typography color='text.secondary' variant='body2'>
          Completa la informacion para crear un nuevo estudiante.
        </Typography>
      </div>

      <StudentForm
        mode='creation'
        isSubmitting={createStudentMutation.isPending}
        onCancel={() => navigate('/users/students')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
