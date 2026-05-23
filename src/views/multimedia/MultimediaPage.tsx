import { useMemo, useState, useEffect } from "react";
import { Alert, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BaseTable, type BaseTableColumn } from "@/components/BaseTable";
import useCreateMultimediaMutation from "@/hooks/useCreateMultimediaMutation";
import useMultimediaQuery from "@/hooks/useMultimediaQuery";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAppStore } from "@/store/useAppStore";
import type { MultimediaItem } from "@/types/multimedia";
import { UserRole } from "@/types/user";
import { useIsMobile } from "@/hooks/useIsMobile";
import MultimediaForm from "./components/MultimediaForm";

const PAGE_SIZE = 6;

const sectionLabels: Record<MultimediaItem["section"], string> = {
    HERO: "Hero",
    MISSION_VISION: "Mision y Vision",
    GALLERY: "Galeria",
};

export default function MultimediaPage() {
    usePageTitle("Multimedia");

    const userRole = useAppStore((state) => state.user.role);
    const multimediaQuery = useMultimediaQuery({ onlyActive: false });
    const createMultimediaMutation = useCreateMultimediaMutation();
    const { isMobile, isTablet } = useIsMobile();
    const isCompact = isMobile || isTablet;
    const isUnauthorized = userRole === UserRole.STUDENT;

    const [currentPage, setCurrentPage] = useState(1);

    const rows = multimediaQuery.data ?? [];
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const pagedRows = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return rows.slice(start, start + PAGE_SIZE);
    }, [currentPage, rows]);

    const columns = useMemo<BaseTableColumn<MultimediaItem>[]>(
        () => [
            {
                key: "title",
                header: "Nombre",
                render: (row) => row.title,
            },
            {
                key: "section",
                header: "Seccion",
                render: (row) => sectionLabels[row.section] ?? row.section,
            },
            {
                key: "sortOrder",
                header: "Orden",
                align: "center",
                width: isCompact ? "80px" : "110px",
                render: (row) => row.sortOrder,
            },
            {
                key: "isActive",
                header: "Estado",
                align: "center",
                width: isCompact ? "96px" : "120px",
                render: (row) => (row.isActive ? "Activa" : "Inactiva"),
            },
            {
                key: "preview",
                header: "Vista",
                align: "center",
                width: isCompact ? "92px" : "140px",
                render: (row) => (
                    <div className="flex justify-center">
                        <img
                            alt={row.title}
                            className="h-12 w-16 rounded-md object-cover shadow"
                            src={row.imageUrl}
                        />
                    </div>
                ),
            },
        ],
        [isCompact],
    );

    if (isUnauthorized) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <main className="space-y-6">
            <div>
                <Typography variant="h5">Multimedia</Typography>
                <Typography color="text.secondary" variant="body2">
                    Gestiona las imagenes de la pagina principal, seccion de mision y vision y galeria.
                </Typography>
            </div>

            <div className="flex flex-col gap-12">
                <MultimediaForm
                    isSubmitting={createMultimediaMutation.isPending}
                    onSubmit={async (values) => {
                        try {
                            await createMultimediaMutation.mutateAsync(values);
                            toast.success("Imagen guardada correctamente.");
                        } catch (error) {
                            const message = error instanceof Error ? error.message : "No se pudo guardar la imagen.";
                            toast.error(message);
                        }
                    }}
                />

                {multimediaQuery.isError && rows.length > 0 ? (
                    <Alert severity="error">No se pudo cargar el listado de multimedia.</Alert>
                ) : null}

                <BaseTable
                    columns={columns}
                    emptyMessage={
                        multimediaQuery.isLoading ? "Cargando multimedia..." : "No hay imagenes por el momento"
                    }
                    marqueeCols={["title"]}
                    marqueeDirection="rtl"
                    marqueeEffect={isCompact}
                    marqueeSpeed={8}
                    pagination={{
                        enabled: true,
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    rowKey={(row) => String(row.id)}
                    rows={pagedRows}
                />
            </div>
        </main>
    );
}
