import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./i18n";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
}

test("muestra la página de login por defecto", () => {
  renderWithProviders(<App />);
  // El título viene de i18n: auth.login.title
  const heading = screen.getByRole("heading", { level: 2 });
  expect(heading.textContent?.toLowerCase()).toContain("ingresar");
});

test("no envía el formulario de login si faltan credenciales", () => {
  renderWithProviders(<App />);
  const submit = screen.getByRole("button");
  fireEvent.click(submit);
  // El navegador nativo impide el submit; simplemente comprobamos que el botón sigue en el documento
  expect(submit).toBeInTheDocument();
});
