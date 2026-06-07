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
  mode?: "create" | "edit";
  initialValues?: Partial<{
    title: string;
    section: MultimediaSection;
    sortOrder: number;
    isActive: boolean;
    imageUrl: string;
  }>;
  onCancel?: () => void;
};

const multimediaSchema = z.object({
  title: z.string().min(2, "Titulo requerido."),
  section: z.enum(["HERO", "MISSION_VISION", "GALLERY", "LOGO"]),
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
  { label: "Logo", value: "LOGO" },
];

const sectionLimits: Record<MultimediaSection, number> = {
  HERO: 1,
  MISSION_VISION: 2,
  GALLERY: 6,
  LOGO: 2,
};

export default function MultimediaForm({
  mode = "create",
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: MultimediaFormProps) {
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
        title: initialValues?.title ?? "",
        section: initialValues?.section ?? "",
        sortOrder: initialValues?.sortOrder !== undefined ? String(initialValues.sortOrder) : "",
        isActive: initialValues?.isActive === false ? "false" : "true",
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

        const limit = sectionLimits[parsed.data.section];

        if (parsed.data.sortOrder !== undefined && parsed.data.sortOrder > limit) {
          const errorMessage = `El orden maximo para esta seccion es ${limit}.`;
          methods.setError("sortOrder", {
            message: errorMessage,
          });
          toast.error(errorMessage);
          return;
        }

        if (mode === "create" && !file) {
          toast.error("Debes adjuntar una imagen.");
          return;
        }

        await onSubmit({
          title: parsed.data.title,
          section: parsed.data.section,
          sortOrder: parsed.data.sortOrder,
          isActive: parsed.data.isActive ? parsed.data.isActive === "true" : undefined,
          file: file || undefined,
        });
      }}
      width={isMobile ? "100%" : 680}
    >
      {({ methods }) => (
        <div className="space-y-3 pt-2">
          <section className="rounded-[10px] border border-slate-400 p-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[10px] bg-white">
                <Image size={72} strokeWidth={1.6} />
              </div>

              <Typography className="text-ownText text-center text-base">
                {file
                  ? file.name
                  : (mode === "edit" && initialValues?.imageUrl ? "Imagen actual" : "Selecciona una imagen")}
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
                  className="h-11 w-full rounded-[10px] bg-secondary text-base font-semibold text-black shadow-[0px_2px_4px_rgba(0,0,0,0.25)] transition-colors hover:brightness-90 cursor-pointer hover:drop-shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  {file || (mode === "edit" && initialValues?.imageUrl)
                    ? "Reemplazar imagen"
                    : "Subir imagen"}
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
                {mode === "edit" && !file && initialValues?.imageUrl ? (
                  <a
                    className="flex h-11 w-full items-center justify-center rounded-[10px] border border-secondary text-secondary text-base font-semibold shadow-[0px_2px_4px_rgba(0,0,0,0.05)] transition-colors hover:bg-secondary hover:text-black"
                    href={initialValues.imageUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Ver imagen actual
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          {(() => {
            const section = methods.watch("section") as MultimediaSection | "";
            const sectionInfo: Record<MultimediaSection, { desc: string; orderNote?: string[]; sizeNote: string }> = {
              HERO: { desc: "Fondo del banner principal en la pagina de inicio.", sizeNote: "Tamaño recomendado: 1920x1080px (horizontal, 16:9)." },
              MISSION_VISION: { desc: "Seccion Mision y Vision.", orderNote: ["Orden 1 = Mision", "Orden 2 = Vision."], sizeNote: "Tamaño recomendado: 800x450px (horizontal, 16:9)." },
              GALLERY: { desc: "Galeria de la pagina de inicio. Se permiten hasta 6 imagenes.", sizeNote: "Tamaño recomendado: 1280x720px (horizontal, 16:9)." },
              LOGO: { desc: "Logo del sitio.", orderNote: ["Orden 1 = logo completo (con letras, se muestra en login y barra lateral).", "Orden 2 = icono del logo (sin letras, se muestra en los encabezados del sitio)."], sizeNote: "Tamaño recomendado: 300x300px minimo (cuadrado)." },
            };

            if (!section) return null;

            const info = sectionInfo[section];
            const sectionLabel = sectionOptions.find((o) => o.value === section)?.label ?? section;

            return (
              <section className="rounded-[10px] border border-sky-300 bg-sky-50 p-3 text-sm text-sky-800">
                <p className="mb-1 font-semibold">Has seleccionado: {sectionLabel}</p>
                <p>{info.desc}</p>
                {info.orderNote ? (
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {info.orderNote.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-1">{info.sizeNote}</p>
              </section>
            );
          })()}

          {typeof methods.formState.errors.sortOrder?.message === "string" ? (
            <Typography className="text-base font-semibold text-red-600">
              {methods.formState.errors.sortOrder?.message}
            </Typography>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            {onCancel ? (
              <div className="w-full sm:w-[180px]">
                <BaseButton
                  fullWidth
                  onClick={onCancel}
                  text="Cancelar"
                  tone="secondary"
                  type="button"
                />
              </div>
            ) : null}
            <div className="w-full sm:w-[220px]">
              <BaseButton
                fullWidth
                loading={isSubmitting}
                text={mode === "edit" ? "Guardar cambios" : "Guardar"}
                type="submit"
              />
            </div>
          </div>
        </div>
      )}
    </BaseForm>
  );
}
