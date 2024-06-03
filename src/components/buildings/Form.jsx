import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select2 from 'react-select'
import api from '../services/axiosClient'
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";


export default function Form({ open, setOpen, currentItem, setCurrentItem, getList }) {

  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!open) {
      // Restablecer currentItem cuando se cierra el formulario
      setCurrentItem({ _id: null, name: "", address: "" });
    }
  }, [open, setCurrentItem]);
  
  const handleChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value, [e.target.address]: e.target.value });
  };
  
 
  const handleSave = (e) => {

    setErrors(null);
    setMessage(null);


    if (currentItem._id === null) save();
    else update();
  }

  const save = async (event) => {
    try {
      const url = '/buildings';
      const response = await api.post(url,
        {
          name: currentItem.name,
          address: currentItem.address,
        });
     // console.log(response.data);
      setCurrentItem(response.data);
      setMessage("S'ha afegir correctament el nou edifici");
      getList();

    }
    catch (error) {
      //console.log(error);
      if (error.response.data.errors) setErrors(error.response.data.errors);
      else setErrors([{ msg: "Error en crear el edifici" }]);
    }
  };


  const update = async (event) => {
    try {
      const url = '/buildings/' + currentItem._id;
      const response = await api.put(url, currentItem);
      setMessage("S'ha modificat correctament el edifici.");
      getList();
    }
    catch (error) {
      console.log(error)
      if (error.response.data.errors) setErrors(error.response.data.errors);
      else setErrors([{ msg: "Error en modificar el edifici" }]);
    }
  };


  const handleClose = () => {
    setErrors(null);
    setMessage(null);
    setOpen(false);
  };


  let operacio = "Nou Edifici";
  if (currentItem._id !== null) operacio = "Editar Edifici";


  let context = "Entra les dades obligatòries per afegir un nou Edifici";
  if (currentItem._id !== null) context = "Pots canviar les dades per editar el Edifici";


  return (
    <React.Fragment>
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
        <DialogTitle>{operacio}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {context}
          </DialogContentText>
          <ShowErrors errors={errors} setErrors={setErrors} ></ShowErrors>
          <ShowMessage message={message} setMessage={setMessage} ></ShowMessage>


          <TextField margin="dense" id="name" name="name" label="nom" type="text" fullWidth variant="outlined"
            value={currentItem.name} onChange={handleChange} />
          <TextField margin="dense" id="address" name="address" label="direcion" type="text" fullWidth variant="outlined"
            onChange={handleChange} >
          </TextField>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tancar</Button>
          <Button onClick={handleSave}>Desar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment >
  );
}