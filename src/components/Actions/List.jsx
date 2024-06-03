import { useEffect, useState } from 'react';
import '../../App.css';
import ShowMessage from "../utils/showMessage";
import ShowErrors from '../utils/ShowErrors';
import axios from 'axios';
import useAxiosInterceptors from '../hooks/useAxiosInterceptors';
//import axiosClient from '../services/axiosClient';
import * as React from 'react';
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
import AlertDialog from '../utils/AlertDialog';
import AddIcon from '@mui/icons-material/Add';
import Form from './form';
import EditIcon from '@mui/icons-material/Edit';

function List() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = React.useState(false);
  const [actionToEdit, setActionToEdit] = useState(null); // Estado para almacenar los detalles de la acción a editar
  const userRoles = JSON.parse(localStorage.getItem('user'))?.role;
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleShowForm = () => {
    setOpenForm(true);
  };

  const handleDelete = async () => {
    setOpen(false);

    try {
      await axios.delete('/actions/' + selectedId);
      getList();
    } catch (error) {
      console.log(error);
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

  const handleEdit = async (id) => {
    try {
      const response = await axios.get('/actions/' + id);
      const actionToEdit = response.data;
      setOpenForm(true);
      setActionToEdit(actionToEdit); // Actualiza los detalles de la acción a editar
    } catch (error) {
      console.error(error);
    }
  };

  const getList = async () => {
    try {
      const response = await axios.get('/actions/list?page=' + page);
      setData(response.data);
    } catch (error) {
      console.error('error');
    }
  };

  useEffect(() => {
    getList();
  }, [page]);

  if (!data) return <>Loading data...</>;

  return (
    <Stack spacing={2}>
      <Form open={openForm} handleClose={handleCloseForm} actionToEdit={actionToEdit} getList={getList} /> {/* Pasar actionToEdit al componente Form */}

      <AlertDialog open={open} setOpen={setOpen} message={"Segur que vols esborrar l'usuari?"} handleDelete={handleDelete} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nom de l'acció</TableCell>
              <TableCell align="center">Funcionalitat</TableCell>
              <TableCell align="center">{userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Personal_Maintenance')) && (
                  <IconButton onClick={handleShowForm} aria-label="alta">
                  <AddIcon />
                </IconButton>

                  )}
                
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.docs.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.functionality}</TableCell>
                <TableCell align="center">
                  {userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Personal_Maintenance')) && (
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => handleConfirmDelete(row._id)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(row._id)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper variant="outlined" sx={{ p: 1, mt:2, display: 'flex', flexDirection: 'column',  alignItems: "center"}}>
          <Pagination onChange={handleChangePage} count={data.totalPages} page={page} />
      </Paper>
    </Stack>
  );
}

export default List;
