import { useEffect, useMemo, useState } from 'react'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import { Alert, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BaseTable, type BaseTableColumn } from '@/components/BaseTable'
import { UtilityBar } from '@/components/UtilityBar'
import useDeleteSongCategoryMutation from '@/hooks/useDeleteSongCategoryMutation'
import useSongCategoriesQuery from '@/hooks/useSongCategoriesQuery'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { SongCategory } from '@/types/songCategory'

const PAGE_SIZE = 5

export default function SongCategoryPage() {
  usePageTitle('Categorias')

  const navigate = useNavigate()
  const songCategoriesQuery = useSongCategoriesQuery()
  const deleteSongCategoryMutation = useDeleteSongCategoryMutation()

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return (songCategoriesQuery.data ?? []).filter((row) => {
      if (normalizedSearch.length === 0) {
        return true
      }

      return row.name.toLowerCase().includes(normalizedSearch)
    })
  }, [searchValue, songCategoriesQuery.data])

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

  const columns: BaseTableColumn<SongCategory>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => row.name,
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'center',
      width: '110px',
      render: (row) => (
        <div className='flex justify-center gap-1'>
          <IconButton
            aria-label='Editar categoria'
            onClick={() => navigate(`/song-categories/${row.id}/edit`)}
            size='small'
          >
            <Edit fontSize='small' />
          </IconButton>

          <IconButton
            aria-label='Eliminar categoria'
            disabled={deleteSongCategoryMutation.isPending}
            onClick={async () => {
              const shouldDelete = window.confirm(
                'Esta seguro de eliminar esta categoria? Las canciones asociadas seran reasignadas automaticamente.',
              )

              if (!shouldDelete) {
                return
              }

              try {
                await deleteSongCategoryMutation.mutateAsync(row.id)
                toast.success('Categoria eliminada correctamente. Las canciones fueron reasignadas.')
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : 'No se pudo eliminar la categoria.'
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
        <Typography variant='h5'>Categorias</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona las categorias de canciones.
        </Typography>
      </div>

      <UtilityBar
        createLabel='Nuevo'
        onCreateClick={() => navigate('/song-categories/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por nombre'
        searchValue={searchValue}
        showFilter={false}
      />

      {songCategoriesQuery.isError ? (
        <Alert severity='error'>No se pudo cargar el listado de categorias.</Alert>
      ) : null}

      <BaseTable
        columns={columns}
        emptyMessage={
          songCategoriesQuery.isLoading
            ? 'Cargando categorias...'
            : 'No hay categorias para mostrar.'
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
