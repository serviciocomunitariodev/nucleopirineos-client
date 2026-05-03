import { useEffect, useMemo, useState } from 'react'
import { Alert, IconButton, Typography } from '@mui/material'
import Edit from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import { BaseTable, type BaseTableColumn } from '@/components/BaseTable'
import type { ActiveFilters, FilterGroup } from '@/components/FilterDropdown'
import { UtilityBar } from '@/components/UtilityBar'
import useStudentsQuery from '@/hooks/useStudentsQuery'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { StudentRecord } from '@/types/users'
import { useIsMobile } from '@/hooks/useIsMobile'

const PAGE_SIZE = 5

export default function StudentsPage() {
  usePageTitle('Estudiantes')

  const navigate = useNavigate()
  const studentsQuery = useStudentsQuery()
  const isMobile = useIsMobile()

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})

  const filterGroups = useMemo<FilterGroup[]>(() => {
    const rows = studentsQuery.data ?? []

    const levelOptions = Array.from(
      new Map(
        rows.map((row) => [
          `level-${row.academicLevel.id}`,
          { id: `level-${row.academicLevel.id}`, label: row.academicLevel.name },
        ]),
      ).values(),
    )

    const principalSubjectOptions = Array.from(
      new Map(
        rows
          .filter((row) => row.principalSubject)
          .map((row) => [
            `principal-${row.principalSubject?.id}`,
            {
              id: `principal-${row.principalSubject?.id}`,
              label: row.principalSubject?.name ?? 'No asignada',
            },
          ]),
      ).values(),
    )

    return [
      {
        id: 'academicLevels',
        title: 'Nivel academico',
        type: 'multilevel',
        options: levelOptions,
      },
      {
        id: 'principalSubjects',
        title: 'Catedra principal',
        type: 'multilevel',
        options: principalSubjectOptions,
      },
    ]
  }, [studentsQuery.data])

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const selectedLevels = Array.isArray(activeFilters.academicLevels)
      ? activeFilters.academicLevels
      : []
    const selectedPrincipalSubjects = Array.isArray(activeFilters.principalSubjects)
      ? activeFilters.principalSubjects
      : []

    return (studentsQuery.data ?? []).filter((row) => {
      const fullName = `${row.user.firstName} ${row.user.lastName}`.toLowerCase()
      const email = row.user.email.toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0 ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch)

      const matchesLevel =
        selectedLevels.length === 0 ||
        selectedLevels.includes(`level-${row.academicLevel.id}`)

      const matchesPrincipal =
        selectedPrincipalSubjects.length === 0 ||
        (row.principalSubject
          ? selectedPrincipalSubjects.includes(`principal-${row.principalSubject.id}`)
          : false)

      return matchesSearch && matchesLevel && matchesPrincipal
    })
  }, [
    activeFilters.academicLevels,
    activeFilters.principalSubjects,
    searchValue,
    studentsQuery.data,
  ])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilters, searchValue])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns: BaseTableColumn<StudentRecord>[] = [
    {
      key: 'fullName',
      header: isMobile ? 'Nombre' : 'Nombre completo',
      render: (row) => `${row.user.firstName} ${row.user.lastName}`,
    },
    {
      key: 'email',
      header: 'Correo',
      render: (row) => row.user.email,
    },
    {
      key: 'age',
      header: 'Edad',
      align: 'center',
      width: '90px',
      render: (row) => row.age,
    },
    {
      key: 'academicLevel',
      header: isMobile ? 'Nivel' : 'Nivel academico',
      render: (row) => row.academicLevel.name,
    },
    {
      key: 'principalSubject',
      header: isMobile ? 'Catedra' : 'Catedra principal',
      render: (row) => row.principalSubject?.name ?? 'No asignada',
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'center',
      width: '90px',
      render: (row) => (
        <div className='flex justify-center'>
          <IconButton
            aria-label='Editar estudiante'
            onClick={() => navigate(`/users/students/${row.userId}/edit`)}
            size='small'
          >
            <Edit fontSize='small' />
          </IconButton>
        </div>
      ),
    },
  ]

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Estudiantes</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona los usuarios con rol estudiante.
        </Typography>
      </div>

      <UtilityBar
        createLabel='Nuevo'
        filterDropdown={{
          activeFilters,
          filterGroups,
          onApplyFilters: setActiveFilters,
          onClearFilters: () => setActiveFilters({}),
        }}
        onCreateClick={() => navigate('/users/students/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por nombre o correo'
        searchValue={searchValue}
      />

      {studentsQuery.isError ? (
        <Alert severity='error'>No se pudo cargar el listado de estudiantes.</Alert>
      ) : null}

      <BaseTable
        columns={columns}
        emptyMessage={studentsQuery.isLoading ? 'Cargando estudiantes...' : 'No hay estudiantes para mostrar.'}
        pagination={{
          enabled: true,
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        rowKey={(row) => String(row.id)}
        rows={pagedRows}
      />
    </main>
  )
}
