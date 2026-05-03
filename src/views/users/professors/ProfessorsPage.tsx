import { useEffect, useMemo, useState } from 'react'
import { Alert, IconButton, Typography } from '@mui/material'
import Edit from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import { BaseTable, type BaseTableColumn } from '@/components/BaseTable'
import type { ActiveFilters, FilterGroup } from '@/components/FilterDropdown'
import { UtilityBar } from '@/components/UtilityBar'
import useProfessorsQuery from '@/hooks/useProfessorsQuery'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { ProfessorRecord } from '@/types/users'
import { useIsMobile } from '@/hooks/useIsMobile'

const PAGE_SIZE = 5

export default function ProfessorsPage() {
  usePageTitle('Profesores')

  const navigate = useNavigate()
  const professorsQuery = useProfessorsQuery()
  const isMobile = useIsMobile()

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})

  const filterGroups = useMemo<FilterGroup[]>(() => {
    const rows = professorsQuery.data ?? []

    const levelOptions = Array.from(
      new Map(
        rows
          .flatMap((row) => row.academicLevels)
          .map((level) => [`level-${level.id}`, { id: `level-${level.id}`, label: level.name }]),
      ).values(),
    )

    const subjectOptions = Array.from(
      new Map(
        rows
          .flatMap((row) => row.subjects)
          .map((subject) => [`subject-${subject.id}`, { id: `subject-${subject.id}`, label: subject.name }]),
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
        id: 'subjects',
        title: 'Catedras',
        type: 'multilevel',
        options: subjectOptions,
      },
    ]
  }, [professorsQuery.data])

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const selectedLevels = Array.isArray(activeFilters.academicLevels)
      ? activeFilters.academicLevels
      : []
    const selectedSubjects = Array.isArray(activeFilters.subjects)
      ? activeFilters.subjects
      : []

    return (professorsQuery.data ?? []).filter((row) => {
      const fullName = `${row.user.firstName} ${row.user.lastName}`.toLowerCase()
      const email = row.user.email.toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0 ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch)

      const matchesLevels =
        selectedLevels.length === 0 ||
        row.academicLevels.some((level) => selectedLevels.includes(`level-${level.id}`))

      const matchesSubjects =
        selectedSubjects.length === 0 ||
        row.subjects.some((subject) => selectedSubjects.includes(`subject-${subject.id}`))

      return matchesSearch && matchesLevels && matchesSubjects
    })
  }, [activeFilters.academicLevels, activeFilters.subjects, professorsQuery.data, searchValue])

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

  const columns: BaseTableColumn<ProfessorRecord>[] = [
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
      key: 'academicLevels',
      header: 'Niveles',
      render: (row) =>
        row.academicLevels.length > 0
          ? row.academicLevels.map((level) => level.name).join(', ')
          : 'Sin asignar',
    },
    {
      key: 'subjects',
      header: 'Catedras',
      render: (row) =>
        row.subjects.length > 0
          ? row.subjects.map((subject) => subject.name).join(', ')
          : 'Sin asignar',
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'center',
      width: '90px',
      render: (row) => (
        <div className='flex justify-center'>
          <IconButton
            aria-label='Editar profesor'
            onClick={() => navigate(`/users/professors/${row.userId}/edit`)}
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
        <Typography variant='h5'>Profesores</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona los usuarios con rol profesor.
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
        onCreateClick={() => navigate('/users/professors/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por nombre o correo'
        searchValue={searchValue}
      />

      {professorsQuery.isError ? (
        <Alert severity='error'>No se pudo cargar el listado de profesores.</Alert>
      ) : null}

      <BaseTable
        columns={columns}
        emptyMessage={professorsQuery.isLoading ? 'Cargando profesores...' : 'No hay profesores para mostrar.'}
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
