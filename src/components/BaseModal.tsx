import { useIsMobile } from '@/hooks/useIsMobile'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useId, type ReactNode } from 'react'

type BaseModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  actions?: ReactNode
  fullWidth?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function BaseModal({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  fullWidth = true,
  maxWidth = 'sm',
}: BaseModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const hasDescription = description !== undefined && description !== null && description !== ''
  const hasContent = hasDescription || children !== undefined && children !== null
  const { isMobile, isTablet } = useIsMobile()
  const isCompact = isMobile || isTablet

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
    >
      {title ? <DialogTitle id={titleId}>{title}</DialogTitle> : null}

      {hasContent ? (
        <DialogContent>
          {hasDescription ? (
            <DialogContentText id={descriptionId}>{description}</DialogContentText>
          ) : null}
          {children}
        </DialogContent>
      ) : null}
    
      {actions ? (
        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: isCompact ? 'column' : 'row',
            gap: 1.5,
            '& > *': {
              width: isCompact ? '100%' : 'auto',
            },
            px: 2,
            py: 1,
          }}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  )
}