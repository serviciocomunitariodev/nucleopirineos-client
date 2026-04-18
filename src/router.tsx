import { Suspense, lazy } from "react";
import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Layout from "@/layout/Layout";

const DashboardPage = lazy(() => import("@/views/dashboard/DashboardPage"));
const EventsPage = lazy(() => import("@/views/events/EventsPage"));
const ResourcesPage = lazy(() => import("@/views/resources/ResourcesPage"));
const SongsPage = lazy(() => import("@/views/songs/SongsPage"));
const ProfessorsPage = lazy(() => import("@/views/users/professors/ProfessorsPage"));
const StudentsPage = lazy(() => import("@/views/users/students/StudentsPage"));
const CategoriesPage = lazy(() => import("@/views/administration/categories/CategoriesPage"));
const SubjectsPage = lazy(() => import("@/views/administration/subjects/SubjectsPage"));
const AcademicLevelsPage = lazy(
  () => import("@/views/administration/academicLevels/AcademicLevelsPage")
);

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
        <Route element={<Layout />}>
          <Route path="/" element={withSuspense(<DashboardPage />)} />
          <Route path="/educational-materials" element={withSuspense(<ResourcesPage />)} />
          <Route path="/songs" element={withSuspense(<SongsPage />)} />
          <Route path="/events" element={withSuspense(<EventsPage />)} />
          <Route path="/users/professors" element={withSuspense(<ProfessorsPage />)} />
          <Route path="/users/students" element={withSuspense(<StudentsPage />)} />
          <Route path="/song-categories" element={withSuspense(<CategoriesPage />)} />
          <Route path="/subjects" element={withSuspense(<SubjectsPage />)} />
          <Route path="/academic-levels" element={withSuspense(<AcademicLevelsPage />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
