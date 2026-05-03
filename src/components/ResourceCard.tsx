import { FileArchive } from 'lucide-react'

type ResourceCardProps = {
  fileName: string
  sizeMb: string
  format: string
}

export function ResourceCard({ fileName, sizeMb, format }: ResourceCardProps) {
  return (
    <article className='flex h-[215px] w-64 overflow-hidden rounded-[28px] bg-white shadow-[0_2px_2px_4px_rgba(0,0,0,0.25)] transition-all duration-300 active:duration-75 cursor-pointer hover:scale-105 active:scale-90 active:rotate-[3deg] hover:brightness-95'>
      <div className='flex w-full flex-col'>
        <div className='flex flex-1 items-center justify-center bg-[#f0f0ea]'>
          <FileArchive size={100} strokeWidth={1.75} />
        </div>

        <div className='flex h-[90px] flex-col justify-between bg-primary px-5 py-4 text-white'>
          <p className='line-clamp-2 text-[20px] font-bold leading-tight'>{fileName}</p>
          <div className='flex items-center justify-between text-[18px] font-medium leading-none'>
            <span>{sizeMb}</span>
            <span>{format}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
