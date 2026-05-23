import { useMemo, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { Image } from "lucide-react";
import { toast } from "react-toastify";
import { z } from "zod";
import { BaseButton } from "@/components/BaseButton";
import { BaseForm, type BaseFormField } from "@/components/BaseForm";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { MultimediaPayload, MultimediaSection } from "@/types/multimedia";
import { validateFileSize } from "@/utils/sizeLimitUtil";

type MultimediaFormValues = {
  title: string;
  section: MultimediaSection | "";
  sortOrder: string;
  isActive: "true" | "false" | "";
};

type MultimediaFormProps = {
  isSubmitting?: boolean;
  onSubmit: (values: MultimediaPayload) => void | Promise<void>;
};

const multimediaSchema = z.object({
  title: z.string().min(2, "Titulo requerido."),
  section: z.enum(["HERO", "MISSION_VISION", "GALLERY"]),
  sortOrder: z
    .preprocess(
      (value) => (value === "" || value === undefined ? undefined : value),
      z.coerce.number().int().min(0, "Orden invalido.").optional(),
    )
    .optional(),
  isActive: z.enum(["true", "false"]).optional(),
});

const sectionOptions: Array<{ label: string; value: MultimediaSection }> = [
  { label: "Principal", value: "HERO" },
  { label: "Mision y Vision", value: "MISSION_VISION" },
  { label: "Galeria", value: "GALLERY" },
];

export default function MultimediaForm({ isSubmitting = false, onSubmit }: MultimediaFormProps) {
  const { isMobile } = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fields = useMemo<BaseFormField<MultimediaFormValues>[]>(
    () => [
      {
        name: "title",
        label: "Nombre",
        placeholder: "Nombre",
        rules: { required: "Nombre requerido." },
      },
      {
        name: "section",
        label: "Seccion",
        placeholder: "Seleccionar seccion",
        select: true,
        options: sectionOptions,
        rules: { required: "Seccion requerida." },
      },
      {
        name: "sortOrder",
        label: "Orden",
        placeholder: "0",
        type: "number",
      },
      {
        name: "isActive",
        label: "Estado",
        placeholder: "Seleccionar estado",
        select: true,
        options: [
          { label: "Activa", value: "true" },
          { label: "Inactiva", value: "false" },
        ],
      },
    ],
    [],
  );

  const clearSelectedFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <BaseForm<MultimediaFormValues>
      className="space-y-3"
      defaultValues={{
        title: "",
        section: "",
        sortOrder: "",
        isActive: "true",
      }}
      fields={fields}
      onSubmit={async (values, methods) => {
        const parsed = multimediaSchema.safeParse(values);

        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0];

          if (firstIssue?.path?.[0]) {
            methods.setError(firstIssue.path[0] as keyof MultimediaFormValues, {
              message: firstIssue.message,
            });
          }

          toast.error(firstIssue?.message ?? "Datos invalidos.");
          return;
        }

        if (!file) {
          toast.error("Debes adjuntar una imagen.");
          return;
        }

        await onSubmit({
          title: parsed.data.title,
          section: parsed.data.section,
          sortOrder: parsed.data.sortOrder,
          isActive: parsed.data.isActive ? parsed.data.isActive === "true" : undefined,
          file,
        });
      }}
      width={isMobile ? "100%" : 680}
    >
      {() => (
        <div className="space-y-3 pt-2">
          <section className="rounded-[10px] border border-slate-400 p-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[10px] bg-white">
                <Image size={72} strokeWidth={1.6} />
              </div>

              <Typography className="text-ownText text-center text-base">
                {file ? file.name : "Selecciona una imagen"}
              </Typography>
              <Typography className="text-gray-500 text-center text-sm mt-[-4px] mb-2">
                (Max. 5MB)
              </Typography>

              <input
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];

                  if (!selectedFile) {
                    return;
                  }

                  if (!validateFileSize(selectedFile, 5, fileInputRef)) {
                    return;
                  }

                  setFile(selectedFile);
                }}
                ref={fileInputRef}
                type="file"
              />

              <div className="flex flex-col gap-2 w-full max-w-[260px]">
                <button
                  className="h-11 w-full rounded-[10px] bg-secondary text-base font-semibold text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#994339] cursor-pointer hover:drop-shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  {file ? "Reemplazar imagen" : "Subir imagen"}
                </button>

                {file ? (
                  <button
                    className="h-11 w-full rounded-[10px] border border-slate-300 bg-white text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    onClick={clearSelectedFile}
                    type="button"
                  >
                    Quitar seleccion
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <div className="w-full sm:w-[220px]">
              <BaseButton
                fullWidth
                loading={isSubmitting}
                text="Guardar"
                type="submit"
              />
            </div>
          </div>
        </div>
      )}
    </BaseForm>
  );
}
