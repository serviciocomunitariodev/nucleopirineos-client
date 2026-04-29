import MusicNoteIcon from '@mui/icons-material/MusicNote';

export function SongCard({ songName }: { songName: string }) {
    return (
        <div className="flex flex-col h-54 w-64 items-center justify-center rounded-[16px] text-xs font-bold shadow-[0_2px_2px_4px_rgba(0,0,0,0.25)] transition-all duration-300 active:duration-75 cursor-pointer hover:scale-105 active:scale-90 active:rotate-[3deg] hover:brightness-85">
            <MusicNoteIcon style={{ fontSize: '160px' }} />
            <div className="bg-primary w-full h-full rounded-b-[12px] p-2">
                <p className="text-sm font-bold text-white line-clamp-2 min-h-9">{songName}</p>
            </div>
        </div>
    )
}

