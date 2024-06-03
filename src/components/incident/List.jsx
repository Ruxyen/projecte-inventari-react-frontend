import React, { useState, useEffect } from "react";

import axios from 'axios';
import useAxiosInterceptors from '../hooks/useAxiosInterceptors';


import Table from '@mui/material/Table'; // Importa el componente Table de Material-UI
import TableBody from '@mui/material/TableBody'; // Importa el componente TableBody de Material-UI
import TableCell from '@mui/material/TableCell'; // Importa el componente TableCell de Material-UI
import TableContainer from '@mui/material/TableContainer'; // Importa el componente TableContainer de Material-UI
import TableHead from '@mui/material/TableHead'; // Importa el componente TableHead de Material-UI
import TableRow from '@mui/material/TableRow'; // Importa el componente TableRow de Material-UI
import Paper from '@mui/material/Paper'; // Importa el componente Paper de Material-UI
import Pagination from '@mui/material/Pagination'; // Importa el componente Pagination de Material-UI
import IconButton from '@mui/material/IconButton'; // Importa el componente IconButton de Material-UI
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Importa el componente AddCircleIcon de Material-UI
import DeleteIcon from '@mui/icons-material/Delete'; // Importa el componente DeleteIcon de Material-UI
import EditIcon from '@mui/icons-material/Edit'; // Importa el componente EditIcon de Material-UI
import PlumbingIcon from '@mui/icons-material/Plumbing'; // Importa el componente PlumbingIcon de Material-UI
import Stack from '@mui/material/Stack'; // Importa el componente Stack de Material-UI

import NewEditDialog from "./NewEditDialog"; // Importa el componente NewEditDialog
import NewEditDialogManteniment from "./NewEditDialogManteniment"; // Importa el componente NewEditDialogManteniment

import AlertDialog from "../utils/AlertDialog"; // Importa el componente AlertDialog de utilidades
import ShowErrors from "../utils/ShowErrors"; // Importa el componente ShowErrors de utilidades
import ShowMessage from "../utils/showMessage"; // Importa el componente ShowMessage de utilidades

import Form from './Form'; // Importa el componente Form

// Componente funcional List
const List = () => {
     // Obté el rol de l'usuari des de localStorage
     const userRoles = JSON.parse(localStorage.getItem('user'))?.role;

  const url = "/incidents"; // URL base para las solicitudes a la 

    // Estados locales
    const [data, setData] = useState();  
    const [page, setPage] = useState(1);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [openNewEditDialog, setOpenNewEditDialog] = useState(false);
    const [openNewEditDialogManteniment, setOpenNewEditDialogManteniment] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [currentItem,setCurrentItem] = useState({ _id: null, description: "", priority: "", creation_date: "", state: "", resolution: "" ,resolution_date: "",  type: "" });
    const [showIndex, setShowIndex] = useState(-1);
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);

    // Manejador para cambiar de página
    const handleChangePage = (event, value) => {  setPage(value); };

    // Confirmar la eliminación de un incidente
    const handleConfirmDelete = (id, index) => {
      setSelectedItem(data.docs[index]);
      setOpenAlertDialog(true);
    }

    // Eliminar un incidente
    const handleDelete = async () => { 
      setOpenAlertDialog(false)
      try {                 
        const response = await axios.delete(url + "/"+ selectedItem._id );   
        getList();       
    }
    catch{
            setErrors([{ msg: "Error eliminando el incidente." }]);
        }
    };

    // Abrir el diálogo para crear o editar un incidente
    const handleOpenNewEditDialog = () => {
      setCurrentItem({ _id: null, description: "", priority: "", creation_date: "" })
      setOpenNewEditDialog(true);
  }

  // Abrir el diálogo para crear o editar un mantenimiento
  const handleopenNewEditDialogManteniment = () => {
    setCurrentItem({ _id: null, description: "", priority: "", creation_date: "", state: "", resolution: "" ,resolution_date: "",  type: "" })
    setOpenNewEditDialogManteniment(true);
}

    // Editar un incidente
    const handleEdit = async (id) => { 
        try {                 
          const response = await axios.get(url+"/"+ id);   
          setCurrentItem(response.data);   
          setOpenNewEditDialog(true);   
      }
      catch{
        setErrors([{msg:"Error recuperando la incidencia seleccionada."}])
      }   
    }

    // Editar un mantenimiento
    const handleEditManteniment = async (id) => { 
      try {                 
        const response = await axios.get(url+"/"+ id);   
        setCurrentItem(response.data);   
        setOpenNewEditDialogManteniment(true);   
    }
    catch{
      setErrors([{msg:"Error recuperando la incidencia seleccionada."}])
    }   
  }

// Activar los botones de acciones para un incidente
const activateButtons = async (index) => {
  setShowIndex(index);
}

// FORM

const [openForm, setOpenForm] = useState(false);

// Cerrar el formulario
const handleCloseFrom = () => {
  setOpenForm(false);
};

// Mostrar el formulario
const handleShowForm = () => {
  setOpenForm(true);
}

    // Obtener la lista de incidentes
    const getList = async () => {  
      try {                 
          const response = await axios.get(url+"/list?page="+ page);                   
          setData(response.data);
      }
      catch{
            setErrors([{ msg: "Error recuperando la lista de incidentes." }]);
        }
    };

    // Cargar la lista de incidentes al cargar la página o cambiar de página
    useEffect(() => {
        getList();
    }, [page]); // Se vuelve a cargar la lista cuando cambia la página

// Mensaje de carga si no hay datos
if(!data) return <div> <ShowMessage message={"Carregant dades..."} setMessage={setMessage} ></ShowMessage></div>

    // Renderizado del componente
    return (
      <Stack spacing={2}>
        {/* Formulario para agregar un nuevo incidente */}
        <Form open={openForm} handleClose={handleCloseFrom}  getList={getList}></Form>
            {/* Diálogo de confirmación para eliminar un incidente */}
            <AlertDialog
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                handleDelete={handleDelete}
                message={"¿Seguro que deseas eliminar este incidente?"}
            />
            {/* Diálogo para crear o editar un incidente */}
            <NewEditDialog open={openNewEditDialog} setOpen={setOpenNewEditDialog}     
                       currentItem={currentItem} setCurrentItem={setCurrentItem} 
                       getList={getList}
        />
          {/* Diálogo para crear o editar un mantenimiento */}
          <NewEditDialogManteniment open={openNewEditDialogManteniment} setOpen={setOpenNewEditDialogManteniment}       
                                currentItem={currentItem} setCurrentItem={setCurrentItem} 
                                getList={getList}
                  />
            {/* Componente para mostrar errores */}
            <ShowErrors errors={errors} setErrors={setErrors} />
            {/* Componente para mostrar mensajes */}
            <ShowMessage message={message} setMessage={setMessage} />

            {/* Tabla para mostrar la lista de incidentes */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Prioridad</TableCell>
                            <TableCell>Tipo</TableCell>  
                            <TableCell>Fecha creación</TableCell>                        
                            <TableCell>
                            {userRoles && userRoles.some(role => role.name === 'Teacher' || role.name === 'Admin' || role.name === 'Janitor' || role.name === 'Personal_maintenance') && (
                          <IconButton onClick={handleShowForm} aria-label="submit"> 
                                <AddCircleIcon />
                              </IconButton>
                            )}
                          </TableCell>  
                        </TableRow>
                    </TableHead>
                    <TableBody>
                          { data.docs.map((row, index) => (
                            <TableRow sx={{ minHeight: 650 }} key={row._id}>                                
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.state}</TableCell>
                                <TableCell>{row.priority}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.creation_date}</TableCell>
                                <TableCell>
                                          <Stack spacing={1} direction="row">
                                          {userRoles && userRoles.some(role => role.name === 'Teacher' || role.name === 'Admin' || role.name === 'Janitor' || role.name === 'Personal_maintenance') && (
                                    <IconButton aria-label="delete"  size="small" onClick={() => handleConfirmDelete(row._id, index) }>
                                      <DeleteIcon  fontSize="inherit" />
                                    </IconButton>
                                )}
                                 {userRoles && userRoles.some(role => role.name === 'Teacher' || role.name === 'Admin' || role.name === 'Janitor' || role.name === 'Personal_maintenance') && (
                                    <IconButton aria-label="edit"  size="small"  onClick={() => handleEdit(row._id) }>
                                      <EditIcon  fontSize="inherit" />
                                    </IconButton>
                                )}
                                 {userRoles && userRoles.some(role =>  role.name === 'Admin' || role.name === 'Personal_maintenance') && (
                                    <IconButton aria-label="editManteniment"  size="small"  onClick={() => handleEditManteniment(row._id) }>
                                      <PlumbingIcon  fontSize="inherit" />
                                    </IconButton>
                                )}   
                                </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginación */}
            <Paper variant="outlined"  sx={{ p: 1, mt:2, display: 'flex', flexDirection: 'column',  alignItems: "center"}}>
           <Pagination count={data.totalPages} page={data.page} onChange={handleChangePage} siblingCount={0}/>
        </Paper>
        </Stack>
    );
};

export default List;
