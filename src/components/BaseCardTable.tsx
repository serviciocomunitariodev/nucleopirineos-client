import { ReactNode } from 'react'
import { Alert, Typography } from '@mui/material'
import { useIsMobile } from '@/hooks/useIsMobile'

interface BaseCardTableProps<T> {
  rows: T[]
  renderCard: (row: T) => ReactNode
  onCardClick?: (row: T) => void
  isLoading?: boolean
  isError?: boolean
  emptyMessage?: string
  errorMessage?: string
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export function BaseCardTable<T>({
  rows,
  renderCard,
  onCardClick,
  isLoading = false,
  isError = false,
  emptyMessage = 'No hay datos para mostrar.',
  errorMessage = 'No se pudieron cargar los datos.',
  pagination,
}: BaseCardTableProps<T>) {
  const { isMobile, isTablet } = useIsMobile()
  const isCompact = isMobile || isTablet

  const paginationTextClass = isCompact ? 'text-[10px]' : 'text-base'
  const paginationButtonPaddingClass = isCompact ? 'px-2 py-1.5' : 'px-4 py-2'
  const pageButtonPaddingClass = isCompact ? 'px-2 py-1.5' : 'px-3 py-2'

  if (isError) {
    return <Alert severity='error'>{errorMessage}</Alert>
  }

  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <Typography color='text.secondary'>Cargando...</Typography>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className='flex justify-center py-10'>
        <Typography color='text.secondary'>{emptyMessage}</Typography>
      </div>
    )
  }

  const handlePageChange = (page: number) => {
    if (!pagination) return
    if (page < 1 || page > pagination.totalPages) return
    pagination.onPageChange(page)
  }

  const pageNumbers = pagination
    ? Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
    : []

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 grid-cols-4 max-[860px]:grid-cols-1 max-[1120px]:grid-cols-2 max-[1360px]:grid-cols-3 '>
        {rows.map((row, index) => (
          <div
            key={index}
            className={onCardClick ? 'cursor-pointer' : ''}
            onClick={() => onCardClick?.(row)}
          >
            {renderCard(row)}
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <nav
          aria-label='Paginacion'
          className='flex items-center justify-center gap-1 pt-4'
        >
          <button
            className={[
              'border border-slate-300 bg-slate-100 text-ownText transition-colors hover:bg-slate-200 disabled:opacity-50',
              paginationTextClass,
              paginationButtonPaddingClass,
            ].join(' ')}
            disabled={pagination.currentPage <= 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            type='button'
          >
            Anterior
          </button>

          {pageNumbers.map((page) => {
            const isCurrent = page === pagination.currentPage

            return (
              <button
                key={page}
                aria-current={isCurrent ? 'page' : undefined}
                className={[
                  'min-w-8 border transition-colors',
                  paginationTextClass,
                  pageButtonPaddingClass,
                  isCurrent
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-300 bg-slate-100 text-ownText hover:bg-slate-200',
                ].join(' ')}
                onClick={() => handlePageChange(page)}
                type='button'
              >
                {page}
              </button>
            )
          })}

          <button
            className={[
              'border border-slate-300 bg-slate-100 text-ownText transition-colors hover:bg-slate-200 disabled:opacity-50',
              paginationTextClass,
              paginationButtonPaddingClass,
            ].join(' ')}
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            type='button'
          >
            Siguiente
          </button>
        </nav>
      )}
    </div>
  )
}
