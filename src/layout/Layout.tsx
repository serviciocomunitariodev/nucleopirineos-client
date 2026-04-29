import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import {
  CalendarMonth,
  ExpandLess,
  ExpandMore,
  LibraryBooks,
  Menu,
  MusicNote,
  People,
  School,
  Settings,
  Logout,
} from "@mui/icons-material";
import { getUserAvatarStyleFromName } from "@/utils/avatar";
import { useAppStore } from "@/store/useAppStore";
import { UserRole } from "@/types/user";
import { useIsMobile } from "@/hooks/useIsMobile";

type NavItem = {
  key: string;
  label: string;
  icon: SvgIconComponent;
  path?: string;
  children?: Array<{ key: string; label: string; path: string }>;
};

// Colors moved to Tailwind config: use classes `bg-primary`, `bg-primaryHover`, `bg-primaryActive`, `bg-background`.

const adminNavigation: NavItem[] = [

  { key: "resources", label: "Recursos", icon: LibraryBooks, path: "/educational-materials" },
  { key: "songs", label: "Canciones", icon: MusicNote, path: "/songs" },
  { key: "calendar", label: "Calendario", icon: CalendarMonth, path: "/platform/events" },
  {
    key: "users",
    label: "Usuarios",
    icon: People,
    children: [
      { key: "professors", label: "Profesores", path: "/users/professors" },
      { key: "students", label: "Estudiantes", path: "/users/students" },
    ],
  },
  {
    key: "administration",
    label: "Administracion",
    icon: Settings,
    children: [
      { key: "categories", label: "Categorias", path: "/song-categories" },
      { key: "subjects", label: "Catedras", path: "/subjects" },
      { key: "levels", label: "Nivel", path: "/academic-levels" },
    ],
  },
];

const studentNavigation: NavItem[] = [
  { key: "resources", label: "Recursos", icon: LibraryBooks, path: "/educational-materials" },
  { key: "songs", label: "Canciones", icon: MusicNote, path: "/songs" },
  { key: "calendar", label: "Calendario", icon: CalendarMonth, path: "/platform/events" },
];

function getInitialExpanded(pathname: string) {
  if (pathname.startsWith("/users")) {
    return "users";
  }
  if (
    pathname.startsWith("/song-categories") ||
    pathname.startsWith("/subjects") ||
    pathname.startsWith("/academic-levels")
  ) {
    return "administration";
  }
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(getInitialExpanded(pathname));
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const navigation = useMemo(() => {
    return user.role === UserRole.PROFESSOR || user.role === UserRole.ADMIN
      ? adminNavigation
      : studentNavigation;
  }, [user.role]);

  const userFullName = `${user.firstName} ${user.lastName}`.trim();
  const { initial, backgroundColor } = getUserAvatarStyleFromName(userFullName);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate("/");
  };

  useEffect(() => {
    setExpandedGroup(getInitialExpanded(pathname));
  }, [pathname]);

  const renderNavigation = () => (
    <nav aria-label="Main navigation" className="mt-6">
      <ul className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isExpandable = Boolean(item.children?.length);
          const isExpanded = expandedGroup === item.key;

          if (isExpandable) {
            return (
              <li key={item.key}>
                <button
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${isExpanded ? "bg-primaryHover text-white" : "text-white"
                    }`}
                  onClick={() => setExpandedGroup(isExpanded ? null : item.key)}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <Icon fontSize="small" />
                    <span>{item.label}</span>
                  </span>
                  {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </button>

                {isExpanded && (
                  <ul className="mt-1 space-y-1 pl-4">
                    {item.children?.map((child) => (
                      <li key={child.key}>
                        <NavLink
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primaryHover ${isActive ? "bg-primaryActive text-black" : "text-white"
                            }`
                          }
                          onClick={() => isMobile && setIsSidebarOpen(false)}
                          to={child.path}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          return (
            <li key={item.key}>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-primaryHover ${isActive ? "bg-primaryActive text-black" : "text-white"
                  }`
                }
                onClick={() => isMobile && setIsSidebarOpen(false)}
                to={item.path || "/"}
              >
                <Icon fontSize="small" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const sidebar = (
    <aside
      className="flex h-full flex-col px-4 py-4 text-white bg-primary"
    >
      <div className="mb-6 flex justify-center">
        <div className="flex h-16.5 w-16.5 items-center justify-center rounded-[12px] bg-white text-xs font-bold text-[#556B2F]">
          LOGO
        </div>
      </div>

      {renderNavigation()}

      <div className="mt-auto flex flex-col items-center pt-8">
        <div
          aria-label={`Avatar of ${userFullName}`}
          className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-semibold text-white"
          role="img"
          style={{ backgroundColor }}
        >
          {initial}
        </div>
        <p className="mt-2 text-sm text-slate-200">{userFullName}</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-dvh bg-background">
      {!isMobile && (
        <div className="fixed inset-y-0 left-0 z-30 w-60 border-r border-black/10">{sidebar}</div>
      )}

      <div className="w-full" style={{ paddingLeft: isMobile ? 0 : 240 }}>
        <header
          className="sticky top-0 z-20 flex h-14 items-center justify-between px-4 text-white bg-primary"
        >
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                aria-label="Open main menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10"
                onClick={() => setIsSidebarOpen(true)}
                type="button"
              >
                <Menu />
              </button>
            )}
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <School fontSize="small" /> Nucleo Pirineos
            </span>
          </div>

          <button
            aria-label="Logout"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold transition-colors hover:bg-red-600"
            onClick={() => setIsLogoutModalOpen(true)}
            type="button"
          >
            <span>Cerrar sesion</span>
            <Logout fontSize="small" />
          </button>
        </header>

        <main className="w-full min-h-[calc(100vh-56px)] bg-background p-3 md:p-4">
          <div className="w-full rounded-2xl border border-black/5 bg-background p-3 md:p-4">
            <Outlet />
          </div>
        </main>
      </div>

      {isMobile && (
        <div
          className={[
            "fixed inset-0 z-40 transition-opacity duration-200",
            isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/35"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          />

          <div
            className={[
              "relative z-10 h-dvh w-[72%] max-w-70 transform transition-transform duration-200 ease-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            {sidebar}
          </div>
        </div>
      )}

      <Dialog
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          ¿Cerrar sesión?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            ¿Estás seguro de que deseas salir de tu cuenta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLogoutModalOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained" autoFocus sx={{ backgroundColor: '#dc2626', '&:hover': { backgroundColor: '#b91c1c' } }}>
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
