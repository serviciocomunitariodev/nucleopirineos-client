import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#022169",
      dark: "#011749",
    },
    secondary: {
      main: "#00c4b3",
      dark: "#009e90",
    },
    background: {
      default: "#FDFDF9",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(',')
  }
});
