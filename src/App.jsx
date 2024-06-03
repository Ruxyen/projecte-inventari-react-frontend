
import { Routes, Route } from "react-router-dom";
import Dashboard from './components/templates/Dashboard';
import {CfsPage} from './components/pages/CfsPage'
import {MainPage} from './components/pages/MainPage'
import {TreePage} from './components/pages/TreePage';

import {UsersPage} from './components/pages/UsersPage';
import {RolesPage} from './components/pages/RolesPage';
import {ActionsPage} from './components/pages/ActionsPage';

import {BuildingsPage} from './components/pages/BuildingsPage';
import {ZonesPage} from './components/pages/ZonesPage';
import {LocationsPage} from './components/pages/LocationsPage';

import {CategoriesPage} from './components/pages/CategoriesPage';
import {MaterialsPage} from './components/pages/MaterialsPage';
import {StocksPage} from './components/pages/StocksPage';

import {IncidentsPage} from './components/pages/IncidentsPage';
import { LoginPage } from "./components/pages/LoginPage";

import useAxiosInterceptors from './components/hooks/useAxiosInterceptors';

export default function App() {

   // Configura els interceptors d'Axios
   useAxiosInterceptors();

   return (
     <Routes>      
         <Route path="/login" element={<LoginPage />} />   
         <Route path="/" element={<Dashboard />} >
          
             <Route index element={<MainPage/>} /> 

             <Route path="cfs" element={<CfsPage/>} />   
             <Route path="tree" element={<TreePage/>} />  

             <Route path="actions" element={<ActionsPage/>} />   
             <Route path="roles" element={<RolesPage/>} />
             <Route path="users" element={<UsersPage/>} />

             <Route path="buildings" element={<BuildingsPage/>} />
             <Route path="zones" element={<ZonesPage/>} />
             <Route path="locations" element={<LocationsPage/>} />

             <Route path="categories" element={<CategoriesPage/>} />
             <Route path="materials" element={<MaterialsPage/>} />
             <Route path="stocks/:id" element={<StocksPage/>} />

             <Route path="incidents" element={<IncidentsPage/>} />                     
         </Route>     
     </Routes>
   );
 }


