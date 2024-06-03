import * as React from 'react';
import { Link } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
//import MaterialIcon from '@mui/icons-material/EventSeat';
import MaterialIcon from '@mui/icons-material/HdrStrong';
import ExemplarIcon from '@mui/icons-material/Workspaces';

import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';

import ApartmentIcon from '@mui/icons-material/Apartment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Groups3Icon from '@mui/icons-material/Groups3';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import Divider from '@mui/material/Divider';

const MainListItems = () => {

   // Obté el rol de l'usuari des de localStorage
   const userRoles = JSON.parse(localStorage.getItem('user'))?.role;
   return (
      <React.Fragment>
        
        
        <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>

       

        {userRoles && userRoles.some(role => role.name === 'Example') && ( // Mostra el botó només si l'usuari té el rol "Teacher"    
          <>          
               <Divider />
              <ListSubheader component="div" inset>
                Exemple
              </ListSubheader>
              <ListItemButton component={Link} to="/cfs">
                <ListItemIcon>
                  <SchoolIcon/>
                </ListItemIcon>
                <ListItemText primary="Cicles formatius" />
              </ListItemButton>
              <ListItemButton component={Link} to="/tree">
                <ListItemIcon>
                  <AccountTreeIcon/>
                </ListItemIcon>
                <ListItemText primary="Arbre" />
              </ListItemButton>
          </>
        )}

        <Divider />
        <ListSubheader component="div" inset>
          Elements inventari
        </ListSubheader>

        <ListItemButton component={Link} to="/categories">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItemButton>

        <ListItemButton component={Link} to="/materials">
          <ListItemIcon>
            <MaterialIcon />
          </ListItemIcon>
          <ListItemText primary="Materials" />
        </ListItemButton>
        
        <Divider />    

        <ListSubheader component="div" inset>
          Espais
        </ListSubheader>

        <ListItemButton component={Link} to="/buildings">
          <ListItemIcon>
            <ApartmentIcon />
          </ListItemIcon>
          <ListItemText primary="Edificis" />
        </ListItemButton>

        <ListItemButton component={Link} to="/zones">
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Zones o plantes" />
        </ListItemButton>

        <ListItemButton component={Link} to="/locations">
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary="Localitzacions" />
        </ListItemButton>

        <Divider /> 
        <ListSubheader component="div" inset>
          Permisos
        </ListSubheader>

        <ListItemButton  component={Link} to="/actions">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Accions" />
        </ListItemButton>

        <ListItemButton component={Link} to="/roles">
          <ListItemIcon>
            <Groups3Icon />
          </ListItemIcon>
          <ListItemText primary="Rols" />
        </ListItemButton>

        <ListItemButton component={Link} to="/users">
          <ListItemIcon>
            <AccountCircleIcon
            />
          </ListItemIcon>
          <ListItemText primary="Usuaris" />
        </ListItemButton>
        {userRoles && userRoles.some(role => role.name === 'Teacher' || role.name === 'Admin' || role.name === 'Janitor' || role.name === 'Personal_maintenance') && (
  <>
    <Divider /> 
    <ListSubheader component="div" inset>
      Notificacions
    </ListSubheader>
    <ListItemButton  component={Link} to="/incidents">
      <ListItemIcon>
        <PlumbingIcon />
      </ListItemIcon>
      <ListItemText primary="Incidències" />
    </ListItemButton>
  </>
)}

      </React.Fragment>
);

}

export default MainListItems;