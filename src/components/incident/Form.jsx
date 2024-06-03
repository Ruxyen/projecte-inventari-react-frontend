import React, { useState } from 'react'; // Importa React y el hook useState
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI
import TextField from '@mui/material/TextField'; // Importa el componente TextField de Material-UI
import Dialog from '@mui/material/Dialog'; // Importa el componente Dialog de Material-UI
import DialogActions from '@mui/material/DialogActions'; // Importa el componente DialogActions de Material-UI
import DialogContent from '@mui/material/DialogContent'; // Importa el componente DialogContent de Material-UI
import DialogContentText from '@mui/material/DialogContentText'; // Importa el componente DialogContentText de Material-UI
import DialogTitle from '@mui/material/DialogTitle'; // Importa el componente DialogTitle de Material-UI
import MenuItem from '@mui/material/MenuItem'; // Importa el componente MenuItem de Material-UI
import axios from 'axios';
import useAxiosInterceptors from '../hooks/useAxiosInterceptors';
// Componente funcional Form
export default function Form({ open, handleClose , getList}) {

  // Estados locales
  const [priority, setPriority] = useState(''); // Estado para la prioridad de la incidencia
  const [description, setDescription] = useState(''); // Estado para la descripción de la incidencia
  const [creation_date, setCreationDate] = useState(new Date().toISOString().split('T')[0]); // Estado para la fecha de creación de la incidencia
  const [error, setError] = useState(''); // Estado para manejar errores
  const [type, setType] = useState(''); // Estado para el tipo de incidencia

  // Opciones de prioridad para el selector
  const priorityOptions = [
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' },
  ];

  // Tipos de incidencia para el selector
  const incidentTypes = [
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Software', label: 'Software' },
    { value: 'Material', label: 'Material' },
    { value: 'Redes', label: 'Redes' },
    { value: 'Seguridad', label: 'Seguridad' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
    { value: 'Instalación', label: 'Instalación' },
    { value: 'Acceso', label: 'Acceso' },
    { value: 'Problemas del sistema', label: 'Problemas del sistema' },
    { value: 'Consultas generales', label: 'Consultas generales' },
    { value: 'Otro', label: 'Otro' },
  ];

  // Manejador para guardar una nueva incidencia
  const handleSave = async () => {
    try {
      const formData = { // Datos del formulario
        priority,
        description,
        creation_date,
        type,
        state: 'Abierto', // Estado predeterminado
      };
      await axios.post('/incidents', formData); // Realiza la solicitud POST a la API
      // Reinicia los estados y cierra el diálogo
      setPriority('');
      setDescription('');
      setCreationDate(new Date().toISOString().split('T')[0]);
      setType('');
      // Actualiza la lista de incidencias y cierra el diálogo
      getList();
      handleClose();
    } catch (error) { // Manejo de errores
      if (error.response) { // Error de respuesta del servidor
        setError('Hubo un error al crear la incidencia. Por favor, inténtalo de nuevo.');
      } else if (error.request) { // Error de solicitud
        setError('No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
      } else { // Error inesperado
        setError('Hubo un error inesperado. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };
  

  return (
    <Dialog open={open} onClose={handleClose}> {/* Diálogo para el formulario */}
      <DialogTitle>Crear incidencia</DialogTitle> {/* Título del diálogo */}
      <DialogContent> {/* Contenido del diálogo */}
        <DialogContentText> {/* Texto de descripción */}
          Por favor, completa el formulario para crear una nueva incidencia.
        </DialogContentText>
        {/* Selector de prioridad */}
        <TextField
          autoFocus
          required
          margin="dense"
          id="priority"
          name="priority"
          label="Prioridad"
          select
          fullWidth
          variant="standard"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {/* Campo de descripción */}
        <TextField
          required
          margin="dense"
          id="description"
          name="description"
          label="Descripción"
          fullWidth
          variant="standard"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Selector de tipo de incidencia */}
        <TextField
          required
          margin="dense"
          id="type"
          name="type"
          label="Tipo de Incidencia"
          select
          fullWidth
          variant="standard"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {incidentTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        {/* Campo de fecha de creación */}
        <TextField
          required
          margin="dense"
          id="creation_date"
          name="creation_date"
          label="Fecha de Creación"
          type="date"
          fullWidth
          variant="standard"
          value={creation_date}
          onChange={(e) => setCreationDate(e.target.value)}
        />
        {/* Mensaje de error */}
        {error && <DialogContentText color="error">{error}</DialogContentText>}
      </DialogContent>
      {/* Acciones del diálogo */}
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button> {/* Botón para cancelar */}
        <Button onClick={handleSave}>Crear</Button> {/* Botón para crear la incidencia */}
      </DialogActions>
    </Dialog>
  );
}
