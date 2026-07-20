import { useState } from "react";
import { Fab, Popover, Typography, Link } from "@mui/material";
import { QuestionMark } from "@mui/icons-material";

export default function HelpFab() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Fab
        aria-label="Ayuda"
        aria-describedby="help-popover"
        onClick={handleOpen}
        disableRipple
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: "primary.main",
          color: "white",
          width: 56,
          height: 56,
          "&:hover": {
            backgroundColor: "primary.dark",
          },
          "& .MuiFab-root": {
            backgroundColor: "transparent",
          },
        }}
      >
        <QuestionMark sx={{ color: "white", fontSize: 24 }} />
      </Fab>

      <Popover
        id="help-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              maxWidth: 320,
              borderRadius: 2,
              boxShadow: 3,
            },
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
          ¿Tienes dudas con el funcionamiento de la plataforma?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          El equipo de desarrollo dejó tutoriales para ti, encuéntralos aquí:{" "}
          <Link
            href="https://drive.google.com/drive/folders/14-3uRfu_kVxlyIe8KiwM5N80LRc4-G57?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            Ver tutoriales
          </Link>
        </Typography>
      </Popover>
    </>
  );
}
