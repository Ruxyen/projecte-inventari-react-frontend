import React, { useEffect, useState } from 'react';
import '../../App.css';
//import axiosClient from '../services/axiosClient';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from '../utils/AlertDialog';
import AddIcon from '@mui/icons-material/Add';
import Form from './Form';
import EditIcon from '@mui/icons-material/Edit';
import ShowErrors from "../utils/ShowErrors";

//CONST
function List() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [errors, setErrors] = useState(null);
  const [currentItem, setCurrentItem] = useState({ _id: null, name: "", blueprint: "", building: null});

  const userRoles = JSON.parse(localStorage.getItem('user'))?.role;

  const handleShowForm = () => {
    setOpenForm(true);
  };

  const handleDelete = async () => {
    setOpen(false);
    console.log(selectedId);
    try {
      await axios.delete("/zones/" + selectedId);
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
    console.log(id);
  };

  const handleEdit = async (id) => {
  try {                
    const response = await axios.get("/zones/"+ id);  
    setCurrentItem(response.data);
    setOpenForm(true);  
  } catch(error) {
    console.log(error);
    setErrors([{msg:"Error recuperant la zona seleccionada..."}]);
  }  
}

  const getList = async () => {
  try {
    const response = await axios.get("/zones/list?page=" + page);
    setData(response.data);
    console.log(response.data);
  } catch {
    console.log("error");
  }
};

const handleCloseForm = () => {
  setOpenForm(false);
};

//USE EFFECT

useEffect(() => {
  getList();
}, [page]);

if (!data) return <>Carregant dades...</>;

return (
  <div>
    <Stack spacing={2}>
      <Form open={openForm} setOpen={setOpenForm}
                     currentItem={currentItem} setCurrentItem={setCurrentItem}
                     getList={getList}></Form>

      <AlertDialog
        open={open}
        setOpen={setOpen}
        message={"Segur que vols esborrar zones?"}
        handleDelete={handleDelete}
      ></AlertDialog>
      <ShowErrors errors={errors} setErrors={setErrors} ></ShowErrors>


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="center">Blueprint</TableCell>
              <TableCell align="center">Building</TableCell>
              <TableCell align="left">
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.docs.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell align="center">{row.blueprint}</TableCell>
                  <TableCell align="center">{row.building.name}</TableCell>
                  <TableCell align="right">

                  <Stack spacing={1} direction="row">
                         {userRoles && userRoles.some(role => role.name === 'Admin') && ( // Mostra el botó només si l'usuari té el rol "Admin"      
          
                              <IconButton aria-label="delete"  size="small" onClick={() => handleConfirmDelete(row._id, index) }>
                                <DeleteIcon  fontSize="inherit" />
                              </IconButton>
                          )}

                        {userRoles && userRoles.some(role => role.name === 'Admin') && ( // Mostra el botó només si l'usuari té el rol "Admin"      
          
                       <IconButton aria-label="delete"  size="small"  onClick={() => handleEdit(row._id) }>
                        <EditIcon  fontSize="inherit" />
                        </IconButton>
                          )}

                        {userRoles && userRoles.some(role => role.name === 'Admin') && ( // Mostra el botó només si l'usuari té el rol "Admin"      
          
                        <IconButton onClick={handleShowForm} aria-label="alta">
                        <AddIcon />
                       </IconButton>
                        )}
                 
                      </Stack>
                  </TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          onChange={handleChangePage}
          count={data.totalPages}
          page={data.page}
        />
      </Stack>
      </div>
  );
}
export default List;

