import { Alert, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useUpdateMultimediaMutation from "@/hooks/useUpdateMultimediaMutation";
import useMultimediaItemQuery from "@/hooks/useMultimediaItemQuery";
import { usePageTitle } from "@/hooks/usePageTitle";
import MultimediaForm from "./components/MultimediaForm";

export default function MultimediaEditPage() {
  usePageTitle("Editar Multimedia");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const updateMultimediaMutation = useUpdateMultimediaMutation();

  const multimediaId = useMemo(() => {
    const rawId = searchParams.get("id");
    const parsed = rawId ? Number(rawId) : NaN;

    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const multimediaQuery = useMultimediaItemQuery(multimediaId);

  if (!multimediaId) {
    return (
      <main className="space-y-6">
        <Alert severity="error">ID de multimedia invalido.</Alert>
      </main>
    );
  }

  if (multimediaQuery.isLoading) {
    return (
      <main className="space-y-6">
        <Typography variant="body2">Cargando multimedia...</Typography>
      </main>
    );
  }

  if (multimediaQuery.isError || !multimediaQuery.data) {
    return (
      <main className="space-y-6">
        <Alert severity="error">No se pudo cargar la multimedia.</Alert>
      </main>
    );
  }

  const multimedia = multimediaQuery.data;

  return (
    <main className="space-y-6">
      <div>
        <Typography variant="h5">Editar Multimedia</Typography>
        <Typography color="text.secondary" variant="body2">
          Actualiza los datos de la imagen seleccionada.
        </Typography>
      </div>

      <MultimediaForm
        mode="edit"
        initialValues={{
          title: multimedia.title,
          section: multimedia.section,
          sortOrder: multimedia.sortOrder,
          isActive: multimedia.isActive,
          imageUrl: multimedia.imageUrl,
        }}
        isSubmitting={updateMultimediaMutation.isPending}
        onCancel={() => navigate("/multimedia")}
        onSubmit={async (values) => {
          try {
            await updateMultimediaMutation.mutateAsync({
              id: multimedia.id,
              payload: values,
            });
            toast.success("Multimedia actualizada correctamente.");
            navigate("/multimedia");
          } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo actualizar la multimedia.";
            const limitMatch = message.match(/Maximo permitido:\s*(\d+)/i);

            if (message.toLowerCase().includes("limite alcanzado") && limitMatch) {
              const limit = Number(limitMatch[1]);
              const label = limit === 1 ? "1 imagen" : `${limit} imagenes`;
              toast.error(
                `Esta seccion solo admite ${label}, si quieres poner una nueva, debes modificar una imagen ya existente.`,
              );
              return;
            }

            toast.error(message);
          }
        }}
      />
    </main>
  );
}
