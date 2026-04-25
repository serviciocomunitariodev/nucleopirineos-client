import { Suspense, lazy } from "react";
import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Layout from "@/layout/Layout";
import AuthLayout from "./views/auth/AuthLayout";
import ProtectedRoute from "./views/auth/ProtectedRoute";

const DashboardPage = lazy(() => import("@/views/dashboard/DashboardPage"));
const PublicEventsPage = lazy(() => import("@/views/events/PublicEventsPage"));
const PlatformEventsPage = lazy(() => import("@/views/events/PlatformEventsPage"));
const ResourcesPage = lazy(() => import("@/views/resources/ResourcesPage"));
const NewResource = lazy(() => import("./views/resources/NewResource"));
const EditResource = lazy(() => import("./views/resources/EditResource"));
const SongsPage = lazy(() => import("@/views/songs/SongsPage"));
const NewSong = lazy(() => import("@/views/songs/NewSong"));
const EditSong = lazy(() => import("@/views/songs/EditSong"));
const SongDetails = lazy(() => import("@/views/songs/SongDetails"));
const LoginPage = lazy(() => import("@/views/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/views/auth/RegisterPage"));
const ProfessorsPage = lazy(() => import("@/views/users/professors/ProfessorsPage"));
const StudentsPage = lazy(() => import("@/views/users/students/StudentsPage"));
const NewProfessor = lazy(() => import("@/views/users/professors/NewProfessor"));
const EditProfessor = lazy(() => import("@/views/users/professors/EditProfessor"));
const NewStudent = lazy(() => import("@/views/users/students/NewStudent"));
const EditStudent = lazy(() => import("@/views/users/students/EditStudent"));
const SongCategoryPage = lazy(
  () => import("@/views/administration/categories/SongCategoryPage")
);
const NewSongCategory = lazy(
  () => import("@/views/administration/categories/NewSongCategory")
);
const EditSongCategory = lazy(
  () => import("@/views/administration/categories/EditSongCategory")
);
const SubjectsPage = lazy(() => import("@/views/administration/subjects/SubjectsPage"));
const NewSubject = lazy(() => import("@/views/administration/subjects/NewSubject"));
const EditSubject = lazy(() => import("@/views/administration/subjects/EditSubject"));
const AcademicLevelsPage = lazy(
  () => import("@/views/administration/academicLevels/AcademicLevelsPage")
);
const NewAcademicLevel = lazy(
  () => import("@/views/administration/academicLevels/NewAcademicLevel")
);
const EditAcademicLevel = lazy(
  () => import("@/views/administration/academicLevels/EditAcademicLevel")
);
const LandingPage = lazy(() => import("@/views/landing/LandingPage"));

const routeFallback = (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
    <CircularProgress />
  </Box>
);

function withSuspense(element: ReactElement) {
  return <Suspense fallback={routeFallback}>{element}</Suspense>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={withSuspense(<LandingPage />)} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/calendario" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={withSuspense(<PublicEventsPage />)} />

        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={withSuspense(<LoginPage />)} />
          <Route path="/auth/register" element={withSuspense(<RegisterPage />)} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={withSuspense(<DashboardPage />)} />
            <Route path="/educational-materials" element={withSuspense(<ResourcesPage />)} />
            <Route path="/educational-materials/new" element={withSuspense(<NewResource />)} />
            <Route
              path="/educational-materials/:id/edit"
              element={withSuspense(<EditResource />)}
            />
            <Route path="/songs" element={withSuspense(<SongsPage />)} />
            <Route path="/songs/new" element={withSuspense(<NewSong />)} />
            <Route path="/songs/:id" element={withSuspense(<SongDetails />)} />
            <Route path="/songs/:id/edit" element={withSuspense(<EditSong />)} />
            <Route path="/platform/events" element={withSuspense(<PlatformEventsPage />)} />
            <Route path="/users/professors" element={withSuspense(<ProfessorsPage />)} />
            <Route path="/users/professors/new" element={withSuspense(<NewProfessor />)} />
            <Route path="/users/professors/:id/edit" element={withSuspense(<EditProfessor />)} />
            <Route path="/users/students" element={withSuspense(<StudentsPage />)} />
            <Route path="/users/students/new" element={withSuspense(<NewStudent />)} />
            <Route path="/users/students/:id/edit" element={withSuspense(<EditStudent />)} />
            <Route path="/song-categories" element={withSuspense(<SongCategoryPage />)} />
            <Route path="/song-categories/new" element={withSuspense(<NewSongCategory />)} />
            <Route
              path="/song-categories/:id/edit"
              element={withSuspense(<EditSongCategory />)}
            />
            <Route path="/subjects" element={withSuspense(<SubjectsPage />)} />
            <Route path="/subjects/new" element={withSuspense(<NewSubject />)} />
            <Route path="/subjects/:id/edit" element={withSuspense(<EditSubject />)} />
            <Route path="/academic-levels" element={withSuspense(<AcademicLevelsPage />)} />
            <Route path="/academic-levels/new" element={withSuspense(<NewAcademicLevel />)} />
            <Route
              path="/academic-levels/:id/edit"
              element={withSuspense(<EditAcademicLevel />)}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
