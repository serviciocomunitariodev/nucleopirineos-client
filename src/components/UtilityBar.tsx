import { ChevronDown } from 'lucide-react'
import {
  FilterDropdown,
  type ActiveFilters,
  type FilterGroup,
} from '@/components/FilterDropdown'

import { useIsMobile } from '@/hooks/useIsMobile'

type UtilityBarProps = {
  showCreate?: boolean
  showFilter?: boolean
  filterLabel?: string
  filterCount?: number
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onFilterClick?: () => void
  onCreateClick?: () => void
  createLabel?: string
  className?: string
  filterDropdown?: {
    activeFilters: ActiveFilters
    filterGroups: FilterGroup[]
    onApplyFilters: (filters: ActiveFilters) => void
    onClearFilters: () => void
  }
}

export function UtilityBar({
  showCreate = true,
  showFilter = true,
  filterLabel = 'Filtro',
  filterCount = 0,
  searchPlaceholder = '',
  searchValue = '',
  onSearchChange,
  onFilterClick,
  onCreateClick,
  createLabel = 'Nuevo',
  className,
  filterDropdown,
}: UtilityBarProps) {
  const { isDesktop } = useIsMobile()
  const isResponsiveLayout = !isDesktop
  const Shadow = isResponsiveLayout
    ? '0px 4px 6px 0px rgba(0,0,0,0.16)'
    : '0px 4px 6px 4px rgba(0,0,0,0.16)'

  const activeFilterEntries = filterDropdown
    ? Object.entries(filterDropdown.activeFilters).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== '',
    )
    : []

  const activeFiltersCount = activeFilterEntries.reduce((accumulator, [, value]) => {
    if (Array.isArray(value)) {
      return accumulator + value.length
    }

    return accumulator + 1
  }, 0)

  const filterControl = showFilter
    ? filterDropdown
      ? (
        <FilterDropdown
          activeFilters={filterDropdown.activeFilters}
          fullWidthTrigger={isResponsiveLayout}
          filterGroups={filterDropdown.filterGroups}
          onApplyFilters={filterDropdown.onApplyFilters}
          onClearFilters={filterDropdown.onClearFilters}
        />
      )
      : (
        <button
          aria-label='Abrir filtros'
          className='inline-flex h-10 min-w-[100px] items-center justify-center gap-2 rounded-[4px] border border-slate-500 px-4 text-sm font-semibold text-ink transition-colors hover:bg-slate-100'
          onClick={onFilterClick}
          type='button'
        >
          <span>{filterLabel}</span>
          {filterCount > 0 && (
            <span className='bg-primary text-white rounded-full px-2 py-0.5 text-xs'>
              {filterCount}
            </span>
          )}
          <ChevronDown size={16} />
        </button>
      )
    : null

  return (
    <section
      aria-label='Barra de utilidades'
      className={[
        'w-full rounded-[12px] bg-white p-3',
        className ?? '',
      ].join(' ')}
      style={{ boxShadow: Shadow }}
    >
      {isResponsiveLayout ? (
        <div className='flex flex-col gap-3'>
          <input
            aria-label='Busqueda'
            className='h-10 w-full rounded-[4px] border border-slate-500 px-3 text-sm text-ownText outline-none transition-colors focus:border-primary'
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            type='text'
            value={searchValue}
          />

          <div className='grid w-full grid-cols-2 gap-3'>
            {filterControl ? <div className='w-full'>{filterControl}</div> : <span aria-hidden='true' />}

            {showCreate ? (
              <button
                aria-label='Crear nuevo registro'
                className={[
                  'h-10 w-full rounded-[10px] bg-primary px-4 text-lg font-semibold text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-primaryHover',
                  showFilter ? 'min-w-0' : 'col-span-2',
                ].join(' ')}
                onClick={onCreateClick}
                type='button'
              >
                {createLabel}
              </button>
            ) : (
              <span aria-hidden='true' />
            )}
          </div>

          {filterDropdown && activeFilterEntries.length > 0 ? (
            <div className='flex flex-wrap items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-2 py-2'>
              <span className='text-xs font-semibold text-slate-600'>Filtros activos:</span>
              {activeFilterEntries.map(([groupId, value]) => {
                const groupLabel =
                  filterDropdown.filterGroups.find((group) => group.id === groupId)?.title ?? groupId
                const total = Array.isArray(value) ? value.length : 1

                return (
                  <span
                    key={groupId}
                    className='rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary'
                  >
                    {groupLabel}: {total}
                  </span>
                )
              })}

              <button
                className='ml-auto rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10'
                onClick={filterDropdown.onClearFilters}
                type='button'
              >
                Limpiar ({activeFiltersCount})
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className='flex w-full items-center gap-3'>
          {filterControl ? <div className='shrink-0'>{filterControl}</div> : <span aria-hidden='true' className='hidden sm:block' />}

          <input
            aria-label='Busqueda'
            className='h-10 min-w-0 flex-1 rounded-[4px] border border-slate-500 px-3 text-sm text-ownText outline-none transition-colors focus:border-primary'
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            type='text'
            value={searchValue}
          />

          {showCreate ? (
            <button
              aria-label='Crear nuevo registro'
              className='h-10 min-w-[110px] shrink-0 rounded-[10px] bg-primary px-5 text-lg font-semibold text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-primaryHover'
              onClick={onCreateClick}
              type='button'
            >
              {createLabel}
            </button>
          ) : null}
        </div>
      )}
    </section>
  )
}