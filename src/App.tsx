import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { BooksPage } from "./pages/BooksPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/new" element={lazyElement(() => import("./pages/BookFormPage").then(m => ({ default: m.BookFormPage })))} />
        <Route path="/books/:id/edit" element={lazyElement(() => import("./pages/BookFormPage").then(m => ({ default: m.BookFormPage })))} />
        <Route path="/books/:id" element={lazyElement(() => import("./pages/BookDetailsPage").then(m => ({ default: m.BookDetailsPage })))} />
      </Route>
      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  );
}

// Small helper to lazy load pages without Suspense boilerplate in every route
function lazyElement(factory: () => Promise<{ default: React.ComponentType<any> }>) {
  const Cmp = React.lazy(factory);
  return (
    <React.Suspense fallback={null}>
      <Cmp />
    </React.Suspense>
  );
}
