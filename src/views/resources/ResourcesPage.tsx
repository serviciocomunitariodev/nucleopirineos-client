import { useEffect, useMemo, useState } from 'react'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BaseCardTable } from '@/components/BaseCardTable'
import { ResourceCard } from '@/components/ResourceCard'
import type { ActiveFilters, FilterGroup } from '@/components/FilterDropdown'
import { UtilityBar } from '@/components/UtilityBar'
import useEducationalMaterialsQuery from '@/hooks/useEducationalMaterialsQuery'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAppStore } from '@/store/useAppStore'
import type { EducationalMaterial } from '@/types/educationalMaterial'
import { UserRole } from '@/types/user'

const PAGE_SIZE = 8

const getFileExtension = (fileUrl: string) => {
  const pathname = fileUrl.split('?')[0] ?? ''
  const filename = pathname.split('/').pop() ?? ''
  const extension = filename.split('.').pop() ?? ''

  return extension.toUpperCase()
}

const estimateFileSize = (fileUrl: string) => {
  const bytes = new TextEncoder().encode(fileUrl).length
  const estimatedMb = Math.max(0.1, bytes / 1024 / 1024)

  return `${estimatedMb.toFixed(1)}mb`
}

export default function ResourcesPage() {
  usePageTitle('Recursos')

  const navigate = useNavigate()
  const educationalMaterialsQuery = useEducationalMaterialsQuery()
  const userRole = useAppStore((state) => state.user.role)

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})
  const canCreateResources = userRole === UserRole.PROFESSOR || userRole === UserRole.ADMIN

  const filterGroups = useMemo<FilterGroup[]>(() => {
    const formats = Array.from(
      new Set((educationalMaterialsQuery.data ?? []).map((item) => getFileExtension(item.fileUrl))),
    )

    return [
      {
        id: 'format',
        title: 'Formato',
        type: 'single',
        options: formats.map((format) => ({ id: format, label: format })),
      },
    ]
  }, [educationalMaterialsQuery.data])

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const selectedFormat = typeof activeFilters.format === 'string' ? activeFilters.format : ''

    return (educationalMaterialsQuery.data ?? []).filter((row) => {
      const extension = getFileExtension(row.fileUrl)
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.title.toLowerCase().includes(normalizedSearch) ||
        extension.toLowerCase().includes(normalizedSearch)

      const matchesFormat = selectedFormat.length === 0 || extension === selectedFormat

      return matchesSearch && matchesFormat
    })
  }, [activeFilters.format, educationalMaterialsQuery.data, searchValue])

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

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Recursos</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona los materiales educativos subidos por profesores.
        </Typography>
      </div>

      <UtilityBar
        createLabel='Nuevo Recurso'
        filterDropdown={{
          activeFilters,
          filterGroups,
          onApplyFilters: setActiveFilters,
          onClearFilters: () => setActiveFilters({}),
        }}
        onCreateClick={() => navigate('/educational-materials/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por nombre o formato'
        searchValue={searchValue}
        showCreate={canCreateResources}
      />

      <BaseCardTable<EducationalMaterial>
        emptyMessage='No hay recursos para mostrar.'
        errorMessage='No se pudo cargar el listado de recursos.'
        isError={educationalMaterialsQuery.isError}
        isLoading={educationalMaterialsQuery.isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        renderCard={(resource) => {
          const card = (
            <ResourceCard
              fileName={resource.title}
              format={getFileExtension(resource.fileUrl) || 'FILE'}
              sizeMb={estimateFileSize(resource.fileUrl)}
            />
          )

          if (!canCreateResources) {
            return (
              <div key={resource.id} className='relative group flex flex-col items-center'>
                {card}
              </div>
            )
          }

          return (
            <button
              key={resource.id}
              className='relative group flex flex-col items-center'
              onClick={() => navigate(`/educational-materials/${resource.id}/edit`)}
              type='button'
            >
              {card}
            </button>
          )
        }}
        rows={pagedRows}
      />
    </main>
  )
}
