import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import es from "./framework/lang/es.json";
import en from "./framework/lang/en.json";
import "./App.css";
import AuthGuard from "./routes/AuthGuard";
import Login from "./features/Login";
import ResetPassword from "./features/ResetPassword";
import { ThemeProvider } from "@mui/material/styles";
import appTheme from "./framework/theme/app-theme";
import Home from "./features/Home/Home";
import Search from "./features/Search/Search";
import Clients from "./features/Clients/Clients";
import ClientForm from "./features/Clients/ClientForm";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "clients/new",
        element: <ClientForm />,
      },
      {
        path: "clients/edit/:id",
        element: <ClientForm />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
