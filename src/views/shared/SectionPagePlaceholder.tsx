import { Paper, Typography } from "@mui/material";
import { usePageTitle } from "@/hooks/usePageTitle";

type SectionPagePlaceholderProps = {
  title: string;
  description: string;
};

export default function SectionPagePlaceholder({
  title,
  description,
}: SectionPagePlaceholderProps) {
  usePageTitle(title);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography>{description}</Typography>
    </Paper>
  );
}
