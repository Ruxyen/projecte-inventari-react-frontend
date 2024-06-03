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
import api from '../services/axiosClient';
import ShowErrors from '../utils/ShowErrors';
import ShowMessage from '../utils/showMessage';

function UserForm({ open, handleClose, userId }) {
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
        if (!open) {
            // Limpiar errores y mensajes cuando el formulario se cierra
            setErrors(null);
            setMessage(null);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setCurrentItem({
                username: '',
                email: '',
                password: '',
            });
            setSelectedRoles([]); // Limpiar los roles seleccionados al abrir el formulario
        }
    }, [open]);

    const getRoles = async () => {
        try {
            const response = await api.get('/roles');
            setRoles(response.data);
        } catch (error) {
            setErrors([{ msg: 'Error recuperant la llista de rols...' }]);
        }
    };

    useEffect(() => {
        getRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCurrentItem({
            ...currentItem,
            [name]: value,
        });
    };

    const handleRoleChange = (selectedOptions) => {
        setSelectedRoles(selectedOptions);
    };

    const handleSave = async (event) => {
        event.preventDefault()
        setErrors(null);
        setMessage(null);

        // Validar que el nombre de usuario no contenga espacios en blanco
        if (currentItem.username.includes(" ")) {
            setErrors([{ msg: "El nom d'usuari no pot contenir espais en blanc." }]);
            return; // Detener el proceso de guardado
        }

        try {
            const data = {
                ...currentItem,
                role: selectedRoles.map((role) => role.value),
            };

            let response;
            if (userId) {
                response = await api.put(`/users/${userId}`, data); // Actualizar usuario existente
            } else {
                console.log(data)
                response = await api.post('/users', data); // Crear nuevo usuario
            }

            setMessage("Usuari creat correctament.");
        } catch (error) {
            console.error("Error updating user:", error);
            if (error.response.data.errors) setErrors(error.response.data.errors);
            else setErrors([{ msg: "Error en crear l'usuari." }]);
        }
    };

    const handleCloseWithDelay = () => {
        setTimeout(() => {
            handleClose();
        }, 1000); // Delay de 1 segundo (1000 milisegundos)
    };

    const handleDropdownOpen = () => setDialogHeight('55vh'); // Ajustar altura al abrir el menú desplegable
    const handleDropdownClose = () => setDialogHeight('auto'); // Ajustar altura al cerrar el menú desplegable

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSave,
                    style: { position: 'relative', borderRadius: 10, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', width: 700, margin: '0 auto' },
                }}
            >
                <DialogTitle style={{ background: '#2c3e50', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>Crear Usuari</DialogTitle>
                <DialogContent
                    style={{
                        background: '#ecf0f1',
                        transition: 'height 0.3s',
                        height: dialogHeight // Ajustamos la altura dinámicamente
                    }}
                >
                    <DialogContentText style={{ color: '#34495e', marginTop: '15px' , marginBottom: '10px' }}>Ingresa les dades del {userId ? 'usuari' : 'nou usuari'}</DialogContentText>
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
                        label="Contrasenya"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={currentItem.password}
                        onChange={handleChange}
                        style={{ marginBottom: 10 }}
                    />

                    <FormControl fullWidth style={{ marginBottom:15 }}>
                        <Select
                            isMulti
                            labelId="role-label"
                            label="Rol"
                            id="role"
                            name="role"
                            options={roles.map((role) => ({ value: role._id, label: role.name }))}
                            value={selectedRoles}
                            onChange={handleRoleChange}
                            onMenuOpen={handleDropdownOpen}
                            onMenuClose={handleDropdownClose}
                            placeholder="Selecciona un rol"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions style={{ borderTop: '5px solid #bdc3c7', borderRadius: '0 0 10px 10px' }}>
                    <Button onClick={handleClose} style={{ border: '2px', color: '#e74c3c', transition: 'background-color 0.3s', fontWeight: 'bold' }} className="cancel-button">Cancelar</Button>
                    <Button type="submit" style={{ color: '#2ecc71', transition: 'background-color 0.3s', fontWeight: 'bold' }} className="add-button">{userId ? 'Guardar cambios' : 'Afegir usuari'}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


export default UserForm;


