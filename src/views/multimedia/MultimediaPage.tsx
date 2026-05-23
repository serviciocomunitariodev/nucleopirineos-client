import { useMemo, useState, useEffect } from "react";
import { Alert, IconButton, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { BaseTable, type BaseTableColumn } from "@/components/BaseTable";
import BaseModal from "@/components/BaseModal";
import { BaseButton } from "@/components/BaseButton";
import { UtilityBar } from "@/components/UtilityBar";
import useDeleteMultimediaMutation from "@/hooks/useDeleteMultimediaMutation";
import useMultimediaQuery from "@/hooks/useMultimediaQuery";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAppStore } from "@/store/useAppStore";
import type { MultimediaItem } from "@/types/multimedia";
import { UserRole } from "@/types/user";
import { useIsMobile } from "@/hooks/useIsMobile";

const PAGE_SIZE = 6;

const sectionLabels: Record<MultimediaItem["section"], string> = {
    HERO: "Principal",
    MISSION_VISION: "Mision y Vision",
    GALLERY: "Galeria",
};

export default function MultimediaPage() {
    usePageTitle("Multimedia");

    const userRole = useAppStore((state) => state.user.role);
    const multimediaQuery = useMultimediaQuery({ onlyActive: false });
    const deleteMultimediaMutation = useDeleteMultimediaMutation();
    const navigate = useNavigate();
    const { isMobile, isTablet } = useIsMobile();
    const isCompact = isMobile || isTablet;
    const isUnauthorized = userRole === UserRole.STUDENT;

    const [currentPage, setCurrentPage] = useState(1);
    const [itemToDelete, setItemToDelete] = useState<MultimediaItem | null>(null);
    const [searchValue, setSearchValue] = useState("");

    const rows = multimediaQuery.data ?? [];
    const filteredRows = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        if (!normalizedSearch) {
            return rows;
        }

        return rows.filter((row) => row.title.toLowerCase().includes(normalizedSearch));
    }, [rows, searchValue]);

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue]);

    const pagedRows = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredRows.slice(start, start + PAGE_SIZE);
    }, [currentPage, filteredRows]);

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
            {
                key: "actions",
                header: "Acciones",
                align: "center",
                width: isCompact ? "86px" : "110px",
                render: (row) => (
                    <div className="flex justify-center gap-1">
                        <IconButton
                            aria-label="Editar multimedia"
                            onClick={() => navigate(`/multimedia/edit?id=${row.id}`)}
                            size="small"
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                            aria-label="Eliminar multimedia"
                            disabled={deleteMultimediaMutation.isPending}
                            onClick={() => setItemToDelete(row)}
                            size="small"
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </div>
                ),
            },
        ],
        [deleteMultimediaMutation.isPending, isCompact],
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

            <div className="flex flex-col gap-6">
                <UtilityBar
                    createLabel={isCompact ? "Nueva" : "Nueva Multimedia"}
                    onCreateClick={() => navigate("/multimedia/new")}
                    onSearchChange={setSearchValue}
                    searchPlaceholder="Buscar por nombre"
                    searchValue={searchValue}
                    showFilter={false}
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

            <BaseModal
                open={itemToDelete !== null}
                onClose={() => setItemToDelete(null)}
                title="Eliminar multimedia"
                description={
                    itemToDelete
                        ? `¿Estás seguro de eliminar "${itemToDelete.title}"?`
                        : "¿Estás seguro de eliminar este registro?"
                }
                actions={(
                    <>
                        <BaseButton
                            fullWidth={false}
                            onClick={() => setItemToDelete(null)}
                            text="Cancelar"
                            tone="secondary"
                        />
                        <BaseButton
                            fullWidth={false}
                            loading={deleteMultimediaMutation.isPending}
                            onClick={async () => {
                                if (!itemToDelete) return;
                                try {
                                    await deleteMultimediaMutation.mutateAsync(itemToDelete.id);
                                    toast.success("Multimedia eliminada correctamente.");
                                    setItemToDelete(null);
                                } catch (error) {
                                    const message = error instanceof Error ? error.message : "No se pudo eliminar la multimedia.";
                                    toast.error(message);
                                }
                            }}
                            text="Eliminar"
                        />
                    </>
                )}
            />
        </main>
    );
}
