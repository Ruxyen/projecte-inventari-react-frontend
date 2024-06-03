import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid'; // Importar la función uuid

import api from '../services/axiosClient';
import ShowErrors from '../utils/ShowErrors';
import ShowMessage from '../utils/showMessage';

function EditUserForm({ handleClose, userId }) {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);
    const [currentItem, setCurrentItem] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [dialogHeight, setDialogHeight] = useState('auto');

    useEffect(() => {
        getUser();
        getRoles();
    }, []); 

    useEffect(() => {
        getUser(); // Llamar a getUser() cuando cambie userId o roles
    }, [userId, roles]);

    const getUser = async () => {
        try {
            const response = await api.get(`/users/${userId}`);
            setCurrentItem({
                username: response.data.username,
                email: response.data.email,
                password: '', // Clear password for security reasons
            });

            const selectedRoleIds = response.data.role.map(role => role._id);

            const selectedRolesData = roles.filter(role => selectedRoleIds.includes(role._id));

            const selectedRolesOptions = selectedRolesData.map(role => ({
                value: role._id,
                label: role.name,
            }));

            setSelectedRoles(selectedRolesOptions);

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const getRoles = async () => {
        try {
            const response = await api.get("/roles");
            setRoles(response.data);
        } catch (error) {
            setErrors([{ msg: "Error recuperant la llista de rols..." }]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCurrentItem({
            ...currentItem,
            [name]: value,
        });
    };

    const handleSave = async () => {
        setErrors(null);
        setMessage(null);

        try {
            let data = {
                ...currentItem,
                role: selectedRoles,
            };

            if (data.password === '') {
                delete data.password;
            }

            const response = await api.put(`/users/${userId}`, data);
            setMessage("Usuari actualitzat correctament.");

        } catch (error) {
            console.error('Error updating user:', error);
            if (error.response.data.errors) setErrors(error.response.data.errors);
            else setErrors([{ msg: "Error en actualitzar l'usuari." }]);
        }
    };

    const handleCloseWithDelay = () => {
        setTimeout(() => {
            handleClose();
        }, 1000);
    };

    const handleDropdownOpen = () => setDialogHeight('55vh');
    const handleDropdownClose = () => setDialogHeight('auto');

    const filterAvailableRoles = () => {
        if (!roles || roles.length === 0) {
            return [];
        }

        return roles
            .filter(role => !selectedRoles.some(selected => selected.value === role._id))
            .map(role => ({
                value: role._id,
                label: role.name,

                key: uuidv4(),

                key: role._id,

            }));
    };

    return (
        <>
            <Dialog
                open={true}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSave,
                    style: { position: 'relative', borderRadius: 10, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', width: 700, margin: '0 auto' },
                }}
            >
                <DialogTitle style={{ background: '#2c3e50', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>Editar Usuari</DialogTitle>
                <DialogContent
                    style={{
                        background: '#ecf0f1',
                        transition: 'height 0.3s',
                        height: dialogHeight // Ajustamos la altura dinámicamente
                    }}
                >
                    <DialogContentText style={{ color: '#34495e', marginTop: '15px' , marginBottom: '10px' }}>Modifica les dades del usuari</DialogContentText>
                    <ShowErrors errors={errors} setErrors={setErrors} />
                    <ShowMessage message={message} setMessage={setMessage} />

                    <TextField
                        margin="dense"
                        id="username"
                        name="username"
                        label="Nom d'usuari"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentItem.username}
                        onChange={handleChange}
                        style={{ marginBottom: 10 }}
                    />

                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Correu electrònic"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={currentItem.email}
                        onChange={handleChange}
                        style={{ marginBottom: 10 }}
                    />

                    <TextField
                        margin="dense"
                        id="password"
                        name="password"
                        label="Nova Contrasenya (opcional)"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={currentItem.password}
                        onChange={handleChange}
                        style={{ marginBottom: 10 }}
                    />

                    <FormControl fullWidth style={{ marginBottom: 10 }}>
                        <Select
                            isMulti
                            labelId="role-label"
                            label="Rol"
                            id="role"
                            name="role"
                            options={filterAvailableRoles()}
                            value={selectedRoles}
                            onChange={(selectedOptions) => setSelectedRoles(selectedOptions)}
                            onMenuOpen={handleDropdownOpen}
                            onMenuClose={handleDropdownClose}
                            placeholder="Selecciona un rol"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions style={{ borderTop: '5px solid #bdc3c7', borderRadius: '0 0 10px 10px' }}>
                    <Button onClick={handleClose} style={{ border: '2px', color: '#e74c3c', transition: 'background-color 0.3s', fontWeight: 'bold' }} className="cancel-button">Cancelar</Button>
                    <Button onClick={handleSave} style={{ color: '#2ecc71', transition: 'background-color 0.3s', fontWeight: 'bold' }}>Guardar canvis</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


export default EditUserForm;