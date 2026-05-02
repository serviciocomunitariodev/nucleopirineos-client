import { toast } from 'react-toastify'
import type { RefObject } from 'react'

export function validateFileSize(
    file: File,
    maxSizeMb: number,
    fileInputRef?: RefObject<HTMLInputElement | null>
): boolean {
    const maxSizeBytes = maxSizeMb * 1024 * 1024

    if (file.size > maxSizeBytes) {
        toast.error(`El archivo excede el tamaño máximo de ${maxSizeMb}MB.`)
        if (fileInputRef?.current) {
            fileInputRef.current.value = ''
        }
        return false
    }

    return true
}
