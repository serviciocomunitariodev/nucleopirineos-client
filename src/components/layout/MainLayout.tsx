import { PropsWithChildren } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Nucleo Pirineos
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/calendar">
            Calendario
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main">{children}</Box>
    </>
  );
}
