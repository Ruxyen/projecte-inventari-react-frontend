import React, { useState, useEffect } from "react";

import api from '../services/axiosClient'

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
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import InventoryIcon from '@mui/icons-material/Inventory';

import Tree from "./Tree";

import NewEditDialog from "./NewEditDialog";

import AlertDialog from "../utils/AlertDialog";
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";

import { Link } from 'react-router-dom';


//fer que al tancar se reinici el tree, que surtin tots desde 0
const List = () => {

    const url = "/materials"          
    const [data, setData] = useState();  
    const [page, setPage] = useState(1);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [openNewEditDialog, setOpenNewEditDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [currentItem,setCurrentItem] = useState({ _id: null, name: "", image: "", description: "", category: null });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // determinar si s'esta editant o creant material
    
    const [showIndex, setShowIndex] = useState(-1)

    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null); 

        // Obté el rol de l'usuari des de localStorage
        const userRoles = JSON.parse(localStorage.getItem('user'))?.role;
    
    //canviar pàgina en la oaginació
    const handleChangePage = (event, value) => {
      //console.log('Pagina actual:', value);
      setPage(value); 
    
    };

    //confirmar delete
    const handleConfirmDelete = (id, index) => {
     
      setSelectedItem(data.docs[index]);
      setOpenAlertDialog(true)
      
    }

    //obrir dialog delete
    const handleDelete = async () => { 
        setOpenAlertDialog(false)
        try {                 
          const response = await api.delete(url + "/"+ selectedItem._id );   
          getList()        
         
      }
      catch{
        setErrors([{msg:"Error esborrant el material..."}])  
      }   

     };

     
     //obtenir llista inicial de materials (o amb category)
     const getList = async () => {  
      try {              
        let apiUrl = url + "/list?page=" + page;
        if (selectedCategory) {
          apiUrl += "&category=" + selectedCategory;
        }
        const response = await api.get(apiUrl);
        setData(response.data);
      } catch {
        setErrors([{ msg: "Error recuperant la llista de material..." }]);
      }   
    };

         //obtenir llista inicial de materials (quan es clica General)
         const getListReset = async () => {  
          try {           
            let apiUrl = url + "/list?page=" + page;

            if (selectedCategory) {
              setSelectedCategory(null);
            }
            const response = await api.get(apiUrl);
            setData(response.data);
          } catch {
            setErrors([{ msg: "Error recuperant la llista de material..." }]);
          }   
        };
        
    
  
    useEffect(() => {        
                
        getList()  
    }, [page]);
     

    //obrir formulari per crear nou material
    const handleOpenNewEditDialog = () => {
      setCurrentItem({ _id: null, name: "", image: "", description: "", category: selectedCategory });
      //console.log(selectedCategory,"category seleccionada")
      setIsEditing(false);
      setOpenNewEditDialog(true);
    };
   
    //obrir formulari per editar material
    const handleEdit = async (id) => { 
        try {                 
          const response = await api.get(url+"/"+ id);   
          setCurrentItem(response.data)   
          setIsEditing(true);
          setOpenNewEditDialog(true); 
 
          
      }
      catch{
        setErrors([{msg:"Error recuperant el material seleccionat..."}])
      }   
    }

    const activateButtons = async (index) => {
      setShowIndex(index)
     
    }


    //obtenir materials relacionats amb la categoria seleccionada
    const handleSelectCategory = async (categoryId) => {
      try {
        
        setSelectedCategory(categoryId);
        // Petició per obtenir els materials de la categoría seleccionada
        const response = await api.get(`${url}/list?page=${page}&category=${categoryId}`);
        //console.log(response.data)

        setData(response.data);
        setPage(response.data.page);
      } catch (error) {
        setErrors([{ msg: "Error recuperant el material seleccionat..." }]);
      }
    };
    

 

    if(!data) return <div> <ShowMessage message={"Carregant dades..."} setMessage={setMessage} ></ShowMessage></div>
    return (
      <>
        <AlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} handleDelete={handleDelete} message={"Segur que vols eliminar el material?"}></AlertDialog>
        <NewEditDialog open={openNewEditDialog} setOpen={setOpenNewEditDialog}
                       currentItem={currentItem} setCurrentItem={setCurrentItem}
                       getList={getList} isEditing={isEditing}
        />
    
        <ShowErrors errors={errors} setErrors={setErrors} ></ShowErrors>
        <ShowMessage message={message} setMessage={setMessage} ></ShowMessage>
    
        <Stack  direction="row" spacing={2}>
      
        <div style={{ flex: 1, marginRight: '10px', maxWidth: '200px', marginLeft: '-10%' }}>
        <Tree onSelectCategory={handleSelectCategory} updateList={getListReset}/>
        </div>
            <div>
    
        
            <TableContainer component={Paper}>

              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Imatge</TableCell>
                    
                    {userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Teacher')) && (
                    <TableCell>
                      <IconButton aria-label="new" onClick={handleOpenNewEditDialog}>
                        <AddCircleIcon />
                      </IconButton>
                    </TableCell>
                  )}

                  </TableRow>
                </TableHead>

                <TableBody>
              {data.docs.map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row" style={{ width: '300px' }}> {}
                    {row.name}
                  </TableCell>
                  <TableCell style={{ width: '300px' }}> {}
                     <Avatar alt="My Image" src={row.image} />
                  </TableCell>
                  <TableCell style={{ width: '300px' }}> {}

                    <Stack spacing={1} direction="row">

                    {userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Teacher')) && (// Mostra el botó només si l'usuari té el rol "Teacher" o "Admin" 
                      <IconButton aria-label="delete" size="small" onClick={() => handleConfirmDelete(row._id, index)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                       )}

                    {userRoles && (userRoles.some(role => role.name === 'Admin') || userRoles.some(role => role.name === 'Teacher')) && (
                      <IconButton aria-label="edit" size="small" onClick={() => handleEdit(row._id)}>
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                      )}

                     
                      <IconButton aria-label="stock" size="small" component={Link} to={"/stocks/"+row._id}>
                        <InventoryIcon fontSize="inherit" />
                      </IconButton>
                      

                    </Stack>

                  </TableCell>
                </TableRow>
              ))}
                </TableBody>

              </Table>
            </TableContainer>
    
            <Paper variant="outlined" sx={{ p: 1, mt: 2, display: 'flex', flexDirection: 'column', alignItems: "center" }}>
              <Pagination count={data.totalPages} page={data.page} onChange={handleChangePage} siblingCount={0} />
            </Paper>
            </div>
         
        </Stack>
      </>
    );
    
  };
   
  export default List;