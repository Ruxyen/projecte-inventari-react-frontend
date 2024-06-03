

import React, { useState, useEffect } from "react";



import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';


import NewEditDialog from "./NewEditDialog";

import AlertDialog from "../utils/AlertDialog";
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";

// import api from '../services/axiosClient'
import axios from 'axios';
//import useAxiosInterceptors from '../hooks/useAxiosInterceptors';

const List = () => {

     // Utilitza l'interceptor d'Axios
     // No necessari si està cridat a App.jsx
     // useAxiosInterceptors();

    const url = "/example/cfs"          
    const [data, setData] = useState();  
    const [page, setPage] = useState(1);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [openNewEditDialog, setOpenNewEditDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [currentItem,setCurrentItem] = useState({ _id: null, name: "", code: "", grade: "", hours: 1000, family: [] ,career_opportunities: ["cap"],  info_modules: [
      { number: 1, name:  "M1", hours: 200}]  })

    // Obté el rol de l'usuari des de localStorage
    const userRoles = JSON.parse(localStorage.getItem('user'))?.role;
  

    const getList = async () => {  
      try {                 
          const response = await axios.get(url+"/list?page="+ page);                   
          setData(response.data)
      }
      catch{
        setErrors([{msg:"Error recuperant la llista de cicles formatius..."}])
      }   
  };




    const [showIndex, setShowIndex] = useState(-1)

    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null); 
    
    const handleChangePage = (event, value) => {  setPage(value); };

    const handleConfirmDelete = (id, index) => {
     
      setSelectedItem(data.docs[index]);
      setOpenAlertDialog(true)
      
    }

    const handleDelete = async () => { 
        setOpenAlertDialog(false)
        try {                 
          const response = await axios.delete(url + "/"+ selectedItem._id );   
          getList()        
         
      }
      catch{
        setErrors([{msg:"Error esborrant el cicle formatiu..."}])  
      }   

     };
  
    
  
    useEffect(() => {                  
        getList()  
    }, [page]);
     

    const handleOpenNewEditDialog = () => {
        setCurrentItem({ _id: null, name: "", code: "", grade: "", hours: 1000, family: [] ,career_opportunities: ["cap"],  info_modules: [
          { number: 1, name:  "M1", hours: 200}]  })
        setOpenNewEditDialog(true);
    }
   
    const handleEdit = async (id) => { 
        try {                 
          const response = await axios.get(url+"/"+ id);   
          setCurrentItem(response.data)   
          setOpenNewEditDialog(true);   
          
      }
      catch{
        setErrors([{msg:"Error recuperant el cicle formatiu seleccionat..."}])
      }   
    }

    const activateButtons = async (index) => {
      setShowIndex(index)
     
    }


    if(!data) return <div> <ShowMessage message={"Carregant dades..."} setMessage={setMessage} ></ShowMessage></div>
    return (
      <>
        <AlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} handleDelete={handleDelete} message={"Segur que vols eliminar el cicle?"}></AlertDialog>
        <NewEditDialog open={openNewEditDialog} setOpen={setOpenNewEditDialog} 
                       currentItem={currentItem} setCurrentItem={setCurrentItem} 
                       getList={getList}
        />
          
        <ShowErrors errors={errors} setErrors={setErrors} ></ShowErrors>
        <ShowMessage message={message} setMessage={setMessage} ></ShowMessage>


        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Grau</TableCell> 
                <TableCell>Hores</TableCell> 
               
                <TableCell>
                      <IconButton aria-label="new" onClick={handleOpenNewEditDialog}>
                        <AddCircleIcon />
                      </IconButton>
                </TableCell>             
              </TableRow>
            </TableHead>
            <TableBody>
              { data.docs.map((row, index) => (
                <TableRow sx={{ minHeight: 700 }} key={row._id}             
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.grade}</TableCell>   
                  <TableCell>{row.hours}</TableCell>
                  <TableCell>
                   
                     <Stack spacing={1} direction="row">
                         {userRoles && userRoles.some(role => role.name === 'Teachera') && ( // Mostra el botó només si l'usuari té el rol "Teacher"      
          
                              <IconButton aria-label="delete"  size="small" onClick={() => handleConfirmDelete(row._id, index) }>
                                <DeleteIcon  fontSize="inherit" />
                              </IconButton>
                          )}
                          <IconButton aria-label="delete"  size="small"  onClick={() => handleEdit(row._id) }>
                            <EditIcon  fontSize="inherit" />
                          </IconButton>
                      </Stack>
                    
                  
                  </TableCell>               
                </TableRow>
              ))}
            </TableBody>
          </Table>     
        </TableContainer>

        <Paper variant="outlined"  sx={{ p: 1, mt:2, display: 'flex', flexDirection: 'column',  alignItems: "center"}}>
           <Pagination count={data.totalPages} page={data.page} onChange={handleChangePage} siblingCount={0}/>
        </Paper>
      </>
      
    );
  
   
                
  
  
  
  };
   
  export default List;