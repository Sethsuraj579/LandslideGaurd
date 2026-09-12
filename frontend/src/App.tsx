import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./styles/globals.css";
import { LanguageProvider } from "./lib/language";

export default function App() {
  return <LanguageProvider><RouterProvider router={router} /></LanguageProvider>;
}
