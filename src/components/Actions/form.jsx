import React, { useEffect, useState } from 'react';
import '../../App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import axiosClient from '../services/axiosClient';

export default function Form({ open, handleClose, actionToEdit , getList}) {
    const [actions, setActions] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        functionality: ''
    });

    useEffect(() => {
        getActions();
    }, []);

    useEffect(() => {
        if (actionToEdit) {
            setFormData({
                name: actionToEdit.name,
                functionality: actionToEdit.functionality
            });
        }
    }, [actionToEdit]);

    const getActions = async () => {
        try {
            const response = await axiosClient.get('/actions');
            setActions(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('error');
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            if (actionToEdit) {
                await axiosClient.put(`/actions/${actionToEdit._id}`, formData);
                console.log('Action updated:', formData);
            } else {
                await axiosClient.post('/actions', formData);
                console.log('New action created:', formData);
            }
            getList();
            handleClose();
        } catch (error) {
            console.error('Error saving action:', error);
        }
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSave,
                }}
            >
                <DialogTitle>{actionToEdit ? 'Editar Acció' : 'Nova Acció'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionToEdit ? 'Modifica les dades de l\'acció' : 'Entra les dades per introduir la nova acció'}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nom de l'acció"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="functionality"
                        name="functionality"
                        label="Funcionalitat"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.functionality}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Tanca</Button>
                    <Button type="submit">{actionToEdit ? 'Desar' : 'Desar'}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
