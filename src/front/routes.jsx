import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import Home from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { LoginForm } from "./pages/Loginform";

import Dashboard from "../front/pages/Dashboard";
import ProcessDetail from "../front/pages/ProcessDetail";
import CreateProcess from "../front/pages/CreateProcess";
import EditarProceso from "../front/pages/EditarProceso";
import HomeDashbord from "./pages/HomeDashbord";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Páginas base */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signin" element={<LoginForm />} />
      <Route path="/home" element={<HomeDashbord />} />


      {/* Funcionalidad de procesos */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/process/:id" element={<ProcessDetail />} />
      <Route path="/crear-proceso/:category_id" element={<CreateProcess />} />
      <Route path="/editar-proceso/:id" element={<EditarProceso />} />
    </Route>
  )
);
