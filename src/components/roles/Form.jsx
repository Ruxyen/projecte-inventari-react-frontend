import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from 'react-select';

import axiosClient from '../services/axiosClient';

export default function Form({ open, handleClose, roleToEdit }) {
    const [actions, setActions] = useState([]);
    const [selectedActions, setSelectedActions] = useState([]);
    const [dialogHeight, setDialogHeight] = useState('auto');
    const [roleName, setRoleName] = useState('');

    const resetForm = () => {
        setRoleName('');
        setSelectedActions([]);
    };

    useEffect(() => {
        getActions(); // Cargar acciones disponibles.
    }, []); // Ejecutar una vez al montar el componente

    // Verificar si es nuevo rol y resetear el formulario
    useEffect(() => {
        if (!roleToEdit) {
            resetForm(); // Restablecer el formulario para un nuevo rol
        }
    }, [open]); // Ejecuta al abrir el diálogo para crear un nuevo rol

    // Configurar el formulario para editar un rol existente
    useEffect(() => {
        if (roleToEdit && actions.length > 0) {
            setRoleName(roleToEdit.name || '');
            setSelectedActions(
                roleToEdit.actions.map(actionId => {
                    const action = actions.find(a => a._id === actionId);
                    return {
                        value: action?._id || actionId,
                        label: action?.name || 'Desconocido',
                    };
                })
            );
        }
    }, [roleToEdit, actions]); // Ejecutar cuando cambian `roleToEdit` y `actions`

    const getActions = async () => {
        try {
            const response = await axiosClient.get('/actions');
            if (response.data && Array.isArray(response.data)) {
                setActions(response.data.filter(action => action != null)); // Filtrar elementos nulos
            } else {
                setActions([]);
            }
        } catch (error) {
            console.error('Error en recuperar les accions:', error);
            setActions([]);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            const data = {
                name: roleName,
                actions: selectedActions.map(action => action.value),
            };

            if (roleToEdit) {
                await axiosClient.put(`/roles/${roleToEdit._id}`, data); // Actualizar rol existente
            } else {
                await axiosClient.post('/roles', data); // Crear nuevo rol
            }

            handleClose(); // Cerrar diálogo después de guardar
        } catch (error) {
            console.error('Error en crear/editar la funció:', error);
        }
    };

    const handleDropdownOpen = () => setDialogHeight('70vh'); // Ajustar altura al abrir el menú desplegable
    const handleDropdownClose = () => setDialogHeight('auto'); // Ajustar altura al cerrar el menú desplegable

    const filterAvailableActions = () => {
        if (!actions || actions.length === 0) {
            return [];
        }

        return actions
            .filter(action => !selectedActions.some(selected => selected.value === action._id))
            .map(action => ({
                value: action._id,
                label: action.name,
            }));
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSave,
                    style: { position: 'relative', height: dialogHeight },
                }}
            >
                <DialogTitle>{roleToEdit ? 'Editar Rol' : 'Nou Rol'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Introduce los datos para {roleToEdit ? 'editar' : 'afegir'} un {roleToEdit ? 'rol existent' : 'nou rol'}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nom del rol"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <Select
                            isMulti
                            options={filterAvailableActions()}
                            value={selectedActions}
                            onChange={(selectedOptions) => setSelectedActions(selectedOptions)}
                            onMenuOpen={handleDropdownOpen}
                            onMenuClose={handleDropdownClose}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit">{roleToEdit ? 'Desar canvis' : 'Afegir rol'}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}