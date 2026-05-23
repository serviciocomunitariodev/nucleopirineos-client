import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usePageTitle } from "@/hooks/usePageTitle";
import useCreateMultimediaMutation from "@/hooks/useCreateMultimediaMutation";
import MultimediaForm from "./components/MultimediaForm";

export default function MultimediaNewPage() {
  usePageTitle("Nueva Multimedia");

  const navigate = useNavigate();
  const createMultimediaMutation = useCreateMultimediaMutation();

  return (
    <main className="space-y-6">
      <div>
        <Typography variant="h5">Nueva Multimedia</Typography>
        <Typography color="text.secondary" variant="body2">
          Agrega una nueva imagen para la landing.
        </Typography>
      </div>

      <MultimediaForm
        mode="create"
        isSubmitting={createMultimediaMutation.isPending}
        onCancel={() => navigate("/multimedia")}
        onSubmit={async (values) => {
          try {
            await createMultimediaMutation.mutateAsync(values);
            toast.success("Imagen guardada correctamente.");
            navigate("/multimedia");
          } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo guardar la imagen.";
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
