import { Paper, Typography } from "@mui/material";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function DashboardPage() {
  usePageTitle("Dashboard");

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel academico y logistico
      </Typography>
      <Typography>
        Estructura base inicializada. A partir de aqui puedes integrar modulos de estudiantes,
        profesores, materiales y eventos.
      </Typography>
    </Paper>
  );
}
