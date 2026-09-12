import { createBrowserRouter } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { About } from "./pages/About";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/about", element: <About /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/:section", element: <Dashboard /> },
  { path: "*", element: <NotFound /> },
]);

