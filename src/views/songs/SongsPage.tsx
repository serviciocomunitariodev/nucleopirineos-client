import { useEffect, useMemo, useState } from 'react'
// import Delete from '@mui/icons-material/Delete'
// import Edit from '@mui/icons-material/Edit'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
import { BaseCardTable } from '@/components/BaseCardTable'
import type { ActiveFilters, FilterGroup } from '@/components/FilterDropdown'
import { UtilityBar } from '@/components/UtilityBar'
import { SongCard } from '@/components/SongCard'
// import useDeleteSongMutation from '@/hooks/useDeleteSongMutation'
import useSongCategoriesQuery from '@/hooks/useSongCategoriesQuery'
import useSongsQuery from '@/hooks/useSongsQuery'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { Song } from '@/types/song'

const PAGE_SIZE = 8

export default function SongsPage() {
  usePageTitle('Canciones')

  const navigate = useNavigate()
  const songsQuery = useSongsQuery()
  const songCategoriesQuery = useSongCategoriesQuery()
  // const deleteSongMutation = useDeleteSongMutation()

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})

  const filterGroups = useMemo<FilterGroup[]>(
    () => [
      {
        id: 'categoryId',
        title: 'Categoría',
        type: 'single',
        options: (songCategoriesQuery.data ?? []).map((cat) => ({
          id: String(cat.id),
          label: cat.name,
        })),
      },
    ],
    [songCategoriesQuery.data],
  )

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const selectedCategory = typeof activeFilters.categoryId === 'string' ? activeFilters.categoryId : ''

    return (songsQuery.data ?? []).filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.title.toLowerCase().includes(normalizedSearch) ||
        row.category?.name.toLowerCase().includes(normalizedSearch)
      
      const matchesCategory = selectedCategory.length === 0 || String(row.categoryId) === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [activeFilters.categoryId, searchValue, songsQuery.data])

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

  // const handleDelete = async (song: Song) => {
  //   const shouldDelete = window.confirm(`¿Está seguro de eliminar la canción "${song.title}"?`)

  //   if (!shouldDelete) {
  //     return
  //   }

  //   try {
  //     await deleteSongMutation.mutateAsync(song.id)
  //     toast.success('Canción eliminada correctamente.')
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : 'No se pudo eliminar la canción.'
  //     toast.error(message)
  //   }
  // }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Canciones</Typography>
        <Typography color='text.secondary' variant='body2'>
          Gestiona el repertorio de canciones.
        </Typography>
      </div>

      <UtilityBar
        createLabel='Nueva Canción'
        filterDropdown={{
          activeFilters,
          filterGroups,
          onApplyFilters: setActiveFilters,
          onClearFilters: () => setActiveFilters({}),
        }}
        onCreateClick={() => navigate('/songs/new')}
        onSearchChange={setSearchValue}
        searchPlaceholder='Buscar por título o categoría'
        searchValue={searchValue}
      />

      <BaseCardTable<Song>
        emptyMessage='No hay canciones para mostrar.'
        errorMessage='No se pudo cargar el listado de canciones.'
        isError={songsQuery.isError}
        isLoading={songsQuery.isLoading}
        onCardClick={(song) => navigate(`/songs/${song.id}`)}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        renderCard={(song) => (
          <div key={song.id} className='relative group flex flex-col items-center'>
            <SongCard songName={song.title} />
          </div>
        )}
        rows={pagedRows}
      />
    </main>
  )
}
