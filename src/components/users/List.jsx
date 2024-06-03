import React, { useEffect, useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import AlertDialog from '../utils/AlertDialog';
import UserForm from './UserForm';
import EditUserForm from './EditUserForm';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

//import api from '../services/axiosClient';
import axios from 'axios';
import useAxiosInterceptors from '../hooks/useAxiosInterceptors';



function List() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

  // Obté el rol de l'usuari des de localStorage
  const userRol = JSON.parse(localStorage.getItem('user'))?.role;

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleShowForm = () => {
    setOpenForm(true);
  };

  const handleDelete = async () => {
    setOpen(false);

    try {
      await axios.delete('/users/' + selectedId);
      getList();
    } catch (error) {
      console.error('Error deleting user:', error);
      // Display error to user
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

  const handleEdit = (id) => {
    setOpenEditForm(true);
    setSelectedId(id);
  };

  const getList = async () => {
    try {
      const response = await axios.get('/users/list?page=' + page);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching user list:', error);
      // Display error to user
    }
  };

  const getUserRoles = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      setUserRoles(response.data.roles || []);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      // Display error to user
    }
  };

  useEffect(() => {
    getList();
  }, [page]);

  useEffect(() => {
    if (selectedId) {
      getUserRoles(selectedId);
    }
  }, [selectedId]);

  if (!data) return <>Carregant dades...</>;

  return (
    <Stack spacing={2}>
      {/* Diálogo para confirmar eliminación */}
      <AlertDialog
        open={open}
        setOpen={setOpen}
        message={"Segur que vols eliminar l'usuari?"}
        handleDelete={handleDelete}
      />
      {/* Diálogo para crear nuevo usuario */}

      <UserForm open={openForm} handleClose={handleCloseForm} />

      {/* Diálogo para editar usuario */}
      <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
        <DialogTitle>Editar Usuari</DialogTitle>
        <DialogContent>
          <EditUserForm handleClose={() => setOpenEditForm(false)} userId={selectedId} userRoles={userRoles} />
        </DialogContent>
      </Dialog>

      {/* Resto del código para la tabla y paginación */}
      <TableContainer component={Paper} sx={{ width: '110%', overflowX: 'auto', marginLeft: 2 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nom d'usuari</TableCell>
              <TableCell align="center">Correu electrònic</TableCell>
              <TableCell align="center">Contrasenya</TableCell>
              <TableCell align="center">Rol/s</TableCell>

              <TableCell align="center">

                {userRol && (userRol.some(role => role.name === 'Admin') || userRol.some(role => role.name === 'Personal_Maintenance')) && (
                  <IconButton onClick={handleShowForm} aria-label="add-user">
                    <AddIcon />
                  </IconButton>
                )}

              </TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {data.docs.map((row) => (
              <TableRow key={row._id}>
                <TableCell align="center">{row.username}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.password}</TableCell>
                <TableCell align="center">
                  {row.role.map((rol, index) => (
                    <div key={index}> {rol.name}</div>
                  ))}
                </TableCell>

                <TableCell align="center">

                  {userRol && (userRol.some(role => role.name === 'Admin') || userRol.some(role => role.name === 'Personal_Maintenance')) && (
                    <IconButton onClick={() => handleEdit(row._id)} aria-label="edit">
                      <EditIcon />
                    </IconButton>

                  )}

                  {userRol && (userRol.some(role => role.name === 'Admin') || userRol.some(role => role.name === 'Personal_Maintenance')) && (
                    <IconButton onClick={() => handleConfirmDelete(row._id)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  )}

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

