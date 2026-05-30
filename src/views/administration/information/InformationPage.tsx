import { useEffect, useMemo, useState } from 'react'
import Edit from '@mui/icons-material/Edit'
import { Alert, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BaseTable, type BaseTableColumn } from '@/components/BaseTable'
import { UtilityBar } from '@/components/UtilityBar'
import useInformationsQuery from '@/hooks/useInformationsQuery'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { InformationItem } from '@/types/information'

const PAGE_SIZE = 6

const sectionLabels: Record<InformationItem['section'], string> = {
  HERO: 'Hero',
  MISSION_VISION: 'Mision y Vision',
}

export default function InformationPage() {
  usePageTitle('Informacion')

  const navigate = useNavigate()
  const informationQuery = useInformationsQuery()
  const { isMobile, isTablet } = useIsMobile()
  const isCompact = isMobile || isTablet

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return (informationQuery.data ?? []).filter((row) => {
      if (normalizedSearch.length === 0) {
        return true
      }

      return (
        row.title.toLowerCase().includes(normalizedSearch) ||
        row.key.toLowerCase().includes(normalizedSearch) ||
        row.value.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [informationQuery.data, searchValue])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<BaseTableColumn<InformationItem>[]>(
    () => [
      {
        key: 'title',
        header: 'Titulo',
        render: (row) => row.title,
      },
      {
        key: 'key',
        header: 'Clave',
        render: (row) => row.key,
      },
      {
        key: 'section',
        header: 'Seccion',
        render: (row) => sectionLabels[row.section],
      },
      {
        key: 'value',
        header: 'Contenido',
        render: (row) => row.value,
      },
      {
        key: 'actions',
        header: 'Acciones',
        align: 'center',
        width: isCompact ? '86px' : '110px',
        render: (row) => (
          <div className='flex justify-center gap-1'>
            <IconButton
              aria-label='Editar informacion'
              onClick={() => navigate(`/information/${row.id}/edit`)}
              size='small'
            >
              <Edit fontSize='small' />
            </IconButton>
          </div>
        ),
      },
    ],
    [isCompact, navigate],
  )

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Informacion</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona los textos editables de la landing.
        </Typography>
      </div>

      <UtilityBar
        createLabel='Nueva'
        onCreateClick={() => navigate('/information/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por titulo, clave o contenido'
        searchValue={searchValue}
        showFilter={false}
      />

      {informationQuery.isError ? (
        <Alert severity='error'>No se pudo cargar la informacion.</Alert>
      ) : null}

      <BaseTable
        columns={columns}
        emptyMessage={
          informationQuery.isLoading
            ? 'Cargando informacion...'
            : 'No hay informacion para mostrar.'
        }
        marqueeCols={['title', 'key', 'value']}
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
    </main>
  )
}
