import { useEffect, useMemo, useState } from 'react'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import { Alert, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BaseTable, type BaseTableColumn } from '@/components/BaseTable'
import BaseModal from '@/components/BaseModal'
import { UtilityBar } from '@/components/UtilityBar'
import useDeleteSongCategoryMutation from '@/hooks/useDeleteSongCategoryMutation'
import useSongCategoriesQuery from '@/hooks/useSongCategoriesQuery'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { SongCategory } from '@/types/songCategory'

const PAGE_SIZE = 5

export default function SongCategoryPage() {
  usePageTitle('Categorias')

  const navigate = useNavigate()
  const songCategoriesQuery = useSongCategoriesQuery()
  const deleteSongCategoryMutation = useDeleteSongCategoryMutation()
  const { isMobile, isTablet } = useIsMobile()
  const isCompact = isMobile || isTablet

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryToDelete, setCategoryToDelete] = useState<SongCategory | null>(null)

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
      width: isCompact ? '86px' : '110px',
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
            onClick={() => setCategoryToDelete(row)}
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
        open={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        title='Eliminar categoria'
        description={
          categoryToDelete
            ? `¿Estás seguro de eliminar la categoria "${categoryToDelete.name}"? Las canciones asociadas seran reasignadas automaticamente.`
            : '¿Estás seguro de eliminar esta categoria?'
        }
        actions={(
          <>
            <button
              className='rounded-[10px] border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100'
              onClick={() => setCategoryToDelete(null)}
              type='button'
            >
              Cancelar
            </button>
            <button
              className='rounded-[10px] bg-[#974F43] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#7E4137] disabled:cursor-not-allowed disabled:opacity-60'
              disabled={deleteSongCategoryMutation.isPending}
              onClick={async () => {
                if (!categoryToDelete) {
                  return
                }

                try {
                  await deleteSongCategoryMutation.mutateAsync(categoryToDelete.id)
                  toast.success('Categoria eliminada correctamente. Las canciones fueron reasignadas.')
                  setCategoryToDelete(null)
                } catch (error) {
                  const message =
                    error instanceof Error ? error.message : 'No se pudo eliminar la categoria.'
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
