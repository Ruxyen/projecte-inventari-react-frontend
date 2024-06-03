    import React, { useEffect, useState } from 'react';
    import Paper from '@mui/material/Paper';
    import Table from '@mui/material/Table';
    import TableBody from '@mui/material/TableBody';
    import TableCell from '@mui/material/TableCell';
    import TableContainer from '@mui/material/TableContainer';
    import TableHead from '@mui/material/TableHead';
    import TableRow from '@mui/material/TableRow';
    import CreateSharpIcon from '@mui/icons-material/CreateSharp';
    import DeleteIcon from '@mui/icons-material/Delete';
    import IconButton from '@mui/material/IconButton';
    import Box from '@mui/material/Box';
    import Dialog from '@mui/material/Dialog';
    import DialogTitle from '@mui/material/DialogTitle';
    import DialogContent from '@mui/material/DialogContent';
    import DialogActions from '@mui/material/DialogActions';
    import AddSharpIcon from '@mui/icons-material/AddSharp';
    import TextField from '@mui/material/TextField';
    import Button from '@mui/material/Button';
    import MenuItem from '@mui/material/MenuItem';
    import { styled } from '@mui/material/styles';
    import axiosClient from '../services/axiosClient';
    import axios from 'axios';
    import ShowMessage from "../utils/showMessage";
    import AlertDialog from "../utils/AlertDialog";

    const StyledTitleBox = styled(Box)({
        background: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        marginBottom: '20px',
    });

    function List({ idMaterial }) {
        const [stocks, setStocks] = useState([]);
        const [locations, setLocations] = useState([]);
        const [materials, setMaterials] = useState([]);
        const [openAddDialog, setOpenAddDialog] = useState(false);
        const [selectedLocation, setSelectedLocation] = useState('');
        const [selectedMaterial, setSelectedMaterial] = useState('');
        const [selectedStocks, setSelectedStocks] = useState({}); // Nuevo estado para almacenar los stocks seleccionados por ubicación
        const [quantity, setQuantity] = useState(0);
        const [message, setMessage] = useState(null);
        const [openAlertDialog, setOpenAlertDialog] = useState(false);
        const [selectedStockId, setSelectedStockId] = useState(null);



        useEffect(() => {
            getLocations();
            getMaterials();
            getStocks();
        }, []);

        async function getLocations() {
            try {
                const locationsResponse = await axios.get('/locations');
                setLocations(locationsResponse.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getMaterials() {
            try {
                const materialsResponse = await axios.get('/materials');
                setMaterials(materialsResponse.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getStocks() {
            try {
                const stocksResponse = await axios.get('/stocks/list?material=' + idMaterial);
                //console.log('eiii')
                //console.log(stocksResponse.data.docs)
                setStocks(stocksResponse.data);
            } catch (error) {
                console.log(error);
            }
        }

        const handleDeleteDialogOpen = (stockId) => {
            setOpenAddDialog(true);
        };
        

        const handleAddDialogOpen = () => {
            setOpenAddDialog(true);
        };

        const handleAddDialogClose = () => {
            setOpenAddDialog(false);
        };const handleAdd = async () => {
            try {
                const newStock = {
                    units: quantity,
                    location: selectedLocation,
                    material: stocks.docs[0].material._id// Obteniendo el ID del material del primer elemento de stocks.docs
                
                };
        
                const response = await axios.post('/stocks', newStock);
                handleAddDialogClose();
                getStocks();
            } catch (error) {
                console.error('Error al agregar nuevo stock:', error);
            }
        };

         //confirmar delete
    const handleConfirmDelete = (id) => {
     console.log("id del stock eliminat", id)
     setSelectedStockId(id);
     setOpenAlertDialog(true)
        
      }

         //obrir dialog delete
    const handleDelete = async () => { 
        setOpenAlertDialog(false)
        try {         
            console.log("eliminant", selectedStockId)        
          const response = await axios.delete("/stocks/"+ selectedStockId );   
          getStocks()        
         
      }
      catch{
        console.error('Error al eliminar stock:'); 
      }   

     };
        

        const handleMaterialSelectChange = (locationId) => (event) => {
            setSelectedStocks({
                ...selectedStocks,
                [locationId]: event.target.value,
            });
        };

        if (!stocks.docs) return <div> <ShowMessage message={"Carregant dades..."} setMessage={setMessage} ></ShowMessage></div>
        if (stocks.docs.length == 0) return <div> <ShowMessage message={"No hi ha stocks en l'aula seleccionada"} setMessage={setMessage} ></ShowMessage></div>
        return (
            <Box p={2}>
                        <AlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} handleDelete={handleDelete} message={"Segur que vols eliminar el stock?"}></AlertDialog>
                <StyledTitleBox>
                    {stocks.docs[0].material.name}
                </StyledTitleBox>
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Aula</TableCell>
                                <TableCell>Unitats</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.docs.map((stock) => (
                                <TableRow key={stock._id}>
                                    <TableCell>{stock.location.name}</TableCell>
                                    <TableCell>{stock.units}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" aria-label="add" onClick={handleAddDialogOpen}>
                                            <AddSharpIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" onClick={() => handleConfirmDelete(stock._id)}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


                <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
                    <DialogTitle>Add Material</DialogTitle>
                    <DialogContent>
                        <TextField

                            select
                            label="Location"

                            variant="outlined"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            fullWidth
                            style={{ marginBottom: '10px' }}
                        >
                            {locations.map((location) => (
                                <MenuItem key={location._id} value={location._id}>
                                    {location.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                            }}
                            fullWidth
                        />

                    </DialogContent>
                    <DialogActions>

                        <Button onClick={handleAddDialogClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    export default List;