import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI
import TextField from '@mui/material/TextField'; // Importa el componente TextField de Material-UI
import Dialog from '@mui/material/Dialog'; // Importa el componente Dialog de Material-UI
import DialogActions from '@mui/material/DialogActions'; // Importa el componente DialogActions de Material-UI
import DialogContent from '@mui/material/DialogContent'; // Importa el componente DialogContent de Material-UI
import DialogContentText from '@mui/material/DialogContentText'; // Importa el componente DialogContentText de Material-UI
import DialogTitle from '@mui/material/DialogTitle'; // Importa el componente DialogTitle de Material-UI
import MenuItem from '@mui/material/MenuItem'; // Importa el componente MenuItem de Material-UI

import Select2 from 'react-select'; // Importa el componente Select2

import axios from 'axios';
import useAxiosInterceptors from '../hooks/useAxiosInterceptors';
import ShowErrors from "../utils/ShowErrors"; // Importa el componente ShowErrors para mostrar errores de validación
import ShowMessage from "../utils/showMessage"; // Importa el componente showMessage para mostrar mensajes de éxito

// Componente funcional principal
export default function NewEditDialogManteniment({ open, setOpen, currentItem, setCurrentItem, getList }) {
    // Estado local para manejar errores
    const [errors, setErrors] = useState(null);
    // Estado local para manejar mensajes
    const [message, setMessage] = useState(null);
    // Estado local para la fecha de resolución, inicializado con la fecha actual
    const [resolution_date, setResolutionDate] = useState(new Date().toISOString().substr(0, 10)); 
    
    // Manejador para cambios en los campos del formulario
    const handleChange = (e) => {
        setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
        // Actualiza la fecha de resolución al valor actual
        setResolutionDate(new Date().toISOString().substr(0, 10));
    };

    // Función para guardar una nueva incidencia
    const save = async () => {
        const response = await axios.post('/incidents', currentItem);
        setMessage("La incidencia se ha creado correctamente.");
        setCurrentItem(response.data);
    };

    // Función para actualizar una incidencia existente
    const update = async () => {
        await axios.put(`/incidents/${currentItem._id}`, currentItem);
        setMessage("La incidencia se ha actualizado correctamente.");
    };

    // Función para cerrar el diálogo
    const handleClose = () => {
        setErrors(null);
        setMessage(null);
        setOpen(false);
    };

    // Función para guardar una incidencia (nueva o actualizada) al hacer clic en el botón "Guardar"
    const handleSave = async () => {
        setErrors(null);
        setMessage(null);

        try {
            if (currentItem._id === null) {
                await save();
            } else {
                await update();
            }
            getList(); // Actualiza la lista de incidencias
            handleClose(); // Cierra el diálogo después de guardar
        } catch (error) {
            console.error("Error:", error);
            // Manejo de errores: muestra mensajes de error específicos si están disponibles en la respuesta del servidor
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([{ msg: "Error al guardar los cambios." }]);
            }
        }
    };

    // Renderizado del componente
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    minHeight: '60vh',
                    maxHeight: '80vh',
                }
            }}
        >
            {/* Título del diálogo */}
            <DialogTitle>{currentItem._id === null ? "Nueva Incidencia, solo para Técnicos" : "Editar Incidencia, solo para Técnicos"}</DialogTitle>
            <DialogContent>
                {/* Texto descriptivo */}
                <DialogContentText>
                    {currentItem._id === null ? "Completa los datos para crear una nueva incidencia." : "Modifica los datos de la incidencia, solo para Técnicos."}
                </DialogContentText>
                {/* Componentes para mostrar errores y mensajes */}
                <ShowErrors errors={errors} setErrors={setErrors} />
                <ShowMessage message={message} setMessage={setMessage} />

                {/* Campos de formulario para prioridad, descripción, estado, resolución, fecha de resolución y tipo */}
                                        <TextField
                                        margin="dense"
                                        id="priority"
                                        name="priority"
                                        label="Prioridad"
                                        select
                                        fullWidth
                                        variant="outlined"
                                        value={currentItem.priority}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Alta">Alta</MenuItem>
                                        <MenuItem value="Media">Media</MenuItem>
                                        <MenuItem value="Baja">Baja</MenuItem>
                                    </TextField>
                            
                                    <TextField
                                        margin="dense"
                                        id="description"
                                        name="description"
                                        label="Descripción"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={currentItem.description}
                                        onChange={handleChange}
                                    />
                            
                                    <TextField
                                        margin="dense"
                                        id="state"
                                        name="state"
                                        label="Estado"
                                        select
                                        fullWidth
                                        variant="outlined"
                                        value={currentItem.state}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Abierto">Abierto</MenuItem>
                                        <MenuItem value="Cerrado">Cerrado</MenuItem>
                                        <MenuItem value="En revisión">En revisión</MenuItem>
                                    </TextField>
                                                                
                                    <TextField
                                        margin="dense"
                                        id="type"
                                        name="type"
                                        label="Tipo"
                                        select
                                        fullWidth
                                        variant="outlined"
                                        value={currentItem.type}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Hardware">Hardware</MenuItem>
                                        <MenuItem value="Software">Software</MenuItem>
                                        <MenuItem value="Material">Material</MenuItem>
                                        <MenuItem value="Redes">Redes</MenuItem>
                                        <MenuItem value="Seguridad">Seguridad</MenuItem>
                                        <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                                        <MenuItem value="Instalación">Instalación</MenuItem>
                                        <MenuItem value="Acceso">Acceso</MenuItem>
                                        <MenuItem value="Problemas del sistema">Problemas del sistema</MenuItem>
                                        <MenuItem value="Consultas generales">Consultas generales</MenuItem>
                                        <MenuItem value="Otro">Otro</MenuItem>
                                    </TextField>
                            
                                    <TextField
                                        margin="dense"
                                        id="resolution"
                                        name="resolution"
                                        label="Resolución"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={currentItem.resolution}
                                        onChange={handleChange}
                                    />
                            
                                    <TextField
                                        margin="dense"
                                        id="resolution_date"
                                        name="resolution_date"
                                        label="Fecha de Resolución"
                                        type="date"
                                        fullWidth
                                        variant="outlined"
                                        value={resolution_date}
                                        onChange={handleChange}
                                    />
            </DialogContent>
        {/* Acciones del diálogo: botones para cancelar o guardar */}
        <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSave}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
}