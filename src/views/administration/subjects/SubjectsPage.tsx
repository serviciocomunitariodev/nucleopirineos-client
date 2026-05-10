import { useEffect, useMemo, useState } from 'react'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import { Alert, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BaseTable, type BaseTableColumn } from '@/components/BaseTable'
import BaseModal from '@/components/BaseModal'
import type { ActiveFilters, FilterGroup } from '@/components/FilterDropdown'
import { UtilityBar } from '@/components/UtilityBar'
import useDeleteSubjectMutation from '@/hooks/useDeleteSubjectMutation'
import { usePageTitle } from '@/hooks/usePageTitle'
import useSubjectsQuery from '@/hooks/useSubjectsQuery'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Subject } from '@/types/subject'
import { SubjectType } from '@/types/subject'

const PAGE_SIZE = 5

const subjectTypeLabelMap: Record<SubjectType, string> = {
  [SubjectType.PRINCIPAL]: 'Principal',
  [SubjectType.COMPLEMENTARY]: 'Complementaria',
  [SubjectType.GROUP]: 'Grupal',
}

export default function SubjectsPage() {
  usePageTitle('Catedras')

  const navigate = useNavigate()
  const subjectsQuery = useSubjectsQuery()
  const deleteSubjectMutation = useDeleteSubjectMutation()
  const { isMobile, isTablet } = useIsMobile()
  const isCompact = isMobile || isTablet

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null)

  const filterGroups = useMemo<FilterGroup[]>(
    () => [
      {
        id: 'type',
        title: 'Tipo',
        type: 'single',
        options: [
          { id: SubjectType.PRINCIPAL, label: 'Principal' },
          { id: SubjectType.COMPLEMENTARY, label: 'Complementaria' },
          { id: SubjectType.GROUP, label: 'Grupal' },
        ],
      },
    ],
    [],
  )

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const selectedType = typeof activeFilters.type === 'string' ? activeFilters.type : ''

    return (subjectsQuery.data ?? []).filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 || row.name.toLowerCase().includes(normalizedSearch)
      const matchesType = selectedType.length === 0 || row.type === selectedType

      return matchesSearch && matchesType
    })
  }, [activeFilters.type, searchValue, subjectsQuery.data])

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

  const columns: BaseTableColumn<Subject>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => row.name,
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (row) => subjectTypeLabelMap[row.type],
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'center',
      width: isCompact ? '86px' : '110px',
      render: (row) => (
        <div className='flex justify-center gap-1'>
          <IconButton
            aria-label='Editar catedra'
            onClick={() => navigate(`/subjects/${row.id}/edit`)}
            size='small'
          >
            <Edit fontSize='small' />
          </IconButton>

          <IconButton
            aria-label='Eliminar catedra'
            disabled={deleteSubjectMutation.isPending}
            onClick={() => setSubjectToDelete(row)}
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
        <Typography variant='h5'>Catedras</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona las catedras principales, complementarias y grupales.
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
        onCreateClick={() => navigate('/subjects/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por nombre'
        searchValue={searchValue}
      />

      {subjectsQuery.isError ? <Alert severity='error'>No se pudo cargar el listado de catedras.</Alert> : null}

      <BaseTable
        columns={columns}
        emptyMessage={subjectsQuery.isLoading ? 'Cargando catedras...' : 'No hay catedras para mostrar.'}
        marqueeCols={['name']}
        marqueeDirection='rtl'
        marqueeEffect={isCompact}
        marqueeSpeed={8}
        pagination={{
          enabled: true,
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        rowKey={(row) => String(row.id)}
        rows={pagedRows}
      />

      <BaseModal
        open={subjectToDelete !== null}
        onClose={() => setSubjectToDelete(null)}
        title='Eliminar catedra'
        description={
          subjectToDelete
            ? `¿Estás seguro de eliminar la catedra "${subjectToDelete.name}"?`
            : '¿Estás seguro de eliminar esta catedra?'
        }
        actions={(
          <>
            <button
              className='rounded-[10px] border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100'
              onClick={() => setSubjectToDelete(null)}
              type='button'
            >
              Cancelar
            </button>
            <button
              className='rounded-[10px] bg-[#974F43] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#7E4137] disabled:cursor-not-allowed disabled:opacity-60'
              disabled={deleteSubjectMutation.isPending}
              onClick={async () => {
                if (!subjectToDelete) {
                  return
                }

                try {
                  await deleteSubjectMutation.mutateAsync(subjectToDelete.id)
                  toast.success('Catedra eliminada correctamente.')
                  setSubjectToDelete(null)
                } catch (error) {
                  const message =
                    error instanceof Error ? error.message : 'No se pudo eliminar la catedra.'
                  toast.error(message)
                }
              }}
              type='button'
            >
              Eliminar
            </button>
          </>
        )}
      />
    </main>
  )
}
