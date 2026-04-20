import { useEffect, useMemo, useState } from 'react'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import { Alert, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BaseTable, type BaseTableColumn } from '@/components/BaseTable'
import type { ActiveFilters, FilterGroup } from '@/components/FilterDropdown'
import { UtilityBar } from '@/components/UtilityBar'
import useAcademicLevelsQuery from '@/hooks/useAcademicLevelsQuery'
import useDeleteAcademicLevelMutation from '@/hooks/useDeleteAcademicLevelMutation'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { AcademicLevel } from '@/types/academicLevel'

const PAGE_SIZE = 5

const formatAgeRange = (row: AcademicLevel) => {
  const maxAgeLabel = row.maxAge ?? 'Sin maximo'
  return `${row.minAge} - ${maxAgeLabel}`
}

export default function AcademicLevelsPage() {
  usePageTitle('Niveles academicos')

  const navigate = useNavigate()
  const academicLevelsQuery = useAcademicLevelsQuery()
  const deleteAcademicLevelMutation = useDeleteAcademicLevelMutation()

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})

  const filterGroups = useMemo<FilterGroup[]>(() => {
    const options = (academicLevelsQuery.data ?? []).map((row) => ({
      id: `level-${row.id}`,
      label: formatAgeRange(row),
    }))

    return [
      {
        id: 'ageRange',
        title: 'Rango de edad',
        type: 'single',
        options,
      },
    ]
  }, [academicLevelsQuery.data])

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const selectedAgeRange =
      typeof activeFilters.ageRange === 'string' ? activeFilters.ageRange : ''

    return (academicLevelsQuery.data ?? []).filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 || row.name.toLowerCase().includes(normalizedSearch)
      const matchesAgeRange =
        selectedAgeRange.length === 0 || selectedAgeRange === `level-${row.id}`

      return matchesSearch && matchesAgeRange
    })
  }, [academicLevelsQuery.data, activeFilters.ageRange, searchValue])

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

  const columns: BaseTableColumn<AcademicLevel>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => row.name,
    },
    {
      key: 'ageRange',
      header: 'Rango de edad',
      render: (row) => formatAgeRange(row),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'center',
      width: '110px',
      render: (row) => (
        <div className='flex justify-center gap-1'>
          <IconButton
            aria-label='Editar nivel academico'
            onClick={() => navigate(`/academic-levels/${row.id}/edit`)}
            size='small'
          >
            <Edit fontSize='small' />
          </IconButton>

          <IconButton
            aria-label='Eliminar nivel academico'
            disabled={deleteAcademicLevelMutation.isPending}
            onClick={async () => {
              const shouldDelete = window.confirm('Esta seguro de eliminar este nivel academico?')

              if (!shouldDelete) {
                return
              }

              try {
                await deleteAcademicLevelMutation.mutateAsync(row.id)
                toast.success('Nivel academico eliminado correctamente.')
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : 'No se pudo eliminar el nivel academico.'
                toast.error(message)
              }
            }}
            size='small'
          >
            <Delete fontSize='small' />
          </IconButton>
        </div>
      ),
    },
  ]

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Niveles academicos</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona niveles academicos y sus rangos de edad.
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
        onCreateClick={() => navigate('/academic-levels/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por nombre'
        searchValue={searchValue}
      />

      {academicLevelsQuery.isError ? (
        <Alert severity='error'>No se pudo cargar el listado de niveles academicos.</Alert>
      ) : null}

      <BaseTable
        columns={columns}
        emptyMessage={
          academicLevelsQuery.isLoading
            ? 'Cargando niveles academicos...'
            : 'No hay niveles academicos para mostrar.'
        }
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
