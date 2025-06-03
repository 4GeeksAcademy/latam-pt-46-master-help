import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Importaciones de tus layouts y páginas existentes
import { Layout } from "./pages/Layout";
import Home from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { LoginForm } from "./pages/Loginform";

// Importaciones de tus páginas de dashboard y procesos
import Dashboard from "../front/pages/Dashboard";
import ProcessDetail from "../front/pages/ProcessDetail";
import CreateProcess from "../front/pages/CreateProcess";
import EditarProceso from "../front/pages/EditarProceso";
import HomeDashbord from "./pages/HomeDashbord";

// ¡IMPORTA TU COMPONENTE ABOUTUSSECTION AQUÍ!
import AboutUsSection from "../front/pages/AboutUs"; // Ajusta esta ruta según donde hayas guardado el archivo

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Páginas base */}
      <Route index element={<Home />} /> {/* Usar 'index' para la ruta raíz si Layout también tiene path="/" */}
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signin" element={<LoginForm />} />

      {/* ¡NUEVA RUTA PARA NOSOTROS! */}
      <Route path="/about-us" element={<AboutUsSection />} />
      {/* O si tu Navbar usa /about-us: */}
      {/* <Route path="/about-us" element={<AboutUsSection />} /> */}

      {/* Funcionalidad de procesos */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<HomeDashbord />} /> {/* Si esta es la home del dashboard, podría ir anidada bajo /dashboard */}
      <Route path="/process/:id" element={<ProcessDetail />} />
      <Route path="/crear-proceso/:category_id" element={<CreateProcess />} />
      <Route path="/editar-proceso/:id" element={<EditarProceso />} />
    </Route>
  )
);