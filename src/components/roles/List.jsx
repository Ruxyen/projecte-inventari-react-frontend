import React, { useEffect, useState } from 'react';
import '../../App.css';
import ShowMessage from '../utils/showMessage';
import ShowErrors from '../utils/ShowErrors';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AlertDialog from '../utils/AlertDialog';
import AddIcon from '@mui/icons-material/Add';
import Form from './Form';

import axios from 'axios';

function List() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [loadingActions, setLoadingActions] = useState(false);
  const [actionMap, setActionMap] = useState({});

  const userRoles = JSON.parse(localStorage.getItem('user'))?.role;

  const handleCloseForm = () => {
    setOpenForm(false);
    setRoleToEdit(null);
  };

  const handleShowForm = () => {
    setOpenForm(true);
    setRoleToEdit(null);
  };

  const handleDelete = async () => {
    setOpen(false);
    try {
      await axios.delete(`/roles/${selectedId}`);
      getList();
    } catch (error) {
      console.error('Error en suprimir la funció:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`/roles/${id}`);
      const roleData = response.data;
      setRoleToEdit(roleData);
      setOpenForm(true);
    } catch (error) {
      console.error("S'ha produït un error en obtenir les dades de la funció per editar-les:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleConfirmDelete = (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const getList = async () => {
    try {
      const response = await axios.get(`/roles/list?page=${page}`);
      console.log('Roles data:', response.data);  // Log para verificar datos
      setData(response.data);
    } catch (error) {
      console.error('Error en obtener la lista de funciones:', error);
    }
  };

  const getActions = async () => {
    setLoadingActions(true);
    try {
      const response = await axios.get('/actions');
      console.log('Actions data:', response.data);  // Log para verificar datos
      const actionData = response.data;
      const actionObject = actionData.reduce((acc, action) => {
        acc[action._id] = action;
        return acc;
      }, {});
      setActionMap(actionObject);
      setLoadingActions(false);
    } catch (error) {
      console.error('Error en recuperar las acciones:', error);
      setLoadingActions(false);
    }
  };

  useEffect(() => {
    getList();
    getActions();
  }, [page]);

  if (!data) {
    return <div>S'estan carregant dades...</div>;
  }

  return (
    <Stack spacing={2}>
      <Form
        open={openForm}
        handleClose={handleCloseForm}
        roleToEdit={roleToEdit}
        actionMap={actionMap} // Pasa el actionMap al Form para que pueda mostrar los nombres de las acciones
      />
      <AlertDialog
        open={open}
        handleClose={handleClose}
        message="Esteu segur que voleu suprimir la funció?"
        handleDelete={handleDelete}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">Nom del rol</TableCell>
              <TableCell align="center">Accions</TableCell>
              <TableCell align="center">
                {userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Personal_Maintenance')) && (

                  <IconButton onClick={handleShowForm} aria-label="Add">
                    <AddIcon />
                  </IconButton>

                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.docs.map((row, index) => (
              <TableRow key={row._id || index}>
                <TableCell align="center"></TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">
                  {loadingActions ? (
                    <span>Loading actions...</span>
                  ) : (
                    row.actions && row.actions.length > 0 ? (
                      <Stack direction="column" spacing={1}>
                        {row.actions.map((actionId, index) => {
                          const action = actionMap[actionId];
                          return action ? (
                            <span key={index}>{action.name}</span>
                          ) : (
                            <span key={index}>Acció no trobada</span>
                          );
                        })}
                      </Stack>
                    ) : (
                      <span>No hi ha accions disponibles</span>
                    )
                  )}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    {userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Personal_Maintenance')) && (

                      <IconButton onClick={() => handleConfirmDelete(row._id)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    )}

                    {userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Personal_Maintenance')) && (

                      <IconButton onClick={() => handleEdit(row._id)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                    )}

                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination onChange={handleChangePage} count={data.totalPages} page={page} />
    </Stack>
  );
}

export default List;
