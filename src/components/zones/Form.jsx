import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react'
import api from "../services/axiosClient";
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";

export default function Form({  open, setOpen, currentItem, setCurrentItem, getList}) {

  //CONST
    const [buildings, setBuildings]= useState([]);
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);
    const [image,setImage] = useState(null);

    //GET
    const getBuildings = async () => {
      try {
        const url = "/buildings";
        const response = await api.get(url);
        setBuildings(response.data);
      } catch {
        setErrors([{ msg: "Error recuperant la llista de Buildings..." }]);
      }
    };

    //HANDLE

    const handleChangeBlueprint = (e) => {
      const file = e.target.files[0];
      console.log(e.target.files[0])
      console.log(URL.createObjectURL(e.target.files[0]))
     // setCurrentItem({ ...currentItem, [e.target.name]: "hola" });
      setImage(e.target.files[0])
      //setCurrentItem({ ...currentItem, "blueprint": URL.createObjectURL(e.target.files[0]) });
      //if (file instanceof File) {
       // setCurrentItem({ ...currentItem, blueprint: file });
      //} else {
     // }
    };

    const handleChangeBuildings = (value) => {
      setCurrentItem({ ...currentItem, building: value });
      };

    const handleChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
      setErrors(null);
      setMessage(null);
  
  
      if (currentItem._id === null) save();
      else update();
    };

    const handleClose = () => {
      setErrors(null);
      setMessage(null);
      setOpen(false);
    };
  
  //SAVE,UPDATE

  const save = async (event) => {
    try {
      let url = "/zones";
      const response = await api.post(url, {
        name: currentItem.name,       
        building: currentItem.building,
      });
      console.log(response.data);
      setCurrentItem(response.data);
      setMessage("S'ha afegit correctament la nova zona.");
     
      // enviar imatge
      url = "/zones/image/"+response.data._id;
      const formData = new FormData;
      formData.append("blueprint",image) 
      const response2 = await api.put(url, formData);
      setCurrentItem(response2.data);
      getList();


    } catch (error) {
      //console.log(error);
      if (error.response.data.errors) setErrors(error.response.data.errors);
      else setErrors([{ msg: "Error al crear la zona" }]);
    }
  };

  const update = async (event) => {
    try {const url = "/zones/" + currentItem._id;
    const response = await api.put(url, currentItem);
    setMessage("S'ha modificat correctament la zona.");
    getList();
  } catch (error) {
    console.log(error);
    if (error.response.data.errors) setErrors(error.response.data.errors);
    else setErrors([{ msg: "Error al modificar la zona" }]);
  }
};

//USE EFFECT

  useEffect(() => {
  getBuildings();
  }, []);

  
  useEffect(() => {    if (!open) {
  setCurrentItem({ _id: null, name: "", blueprint: "", building: [] });
  }
  }, [open, setCurrentItem]);
  

  //LET

  let operacio = "Nova Zona";
  if (currentItem._id !== null) operacio = "Editar Zona";


  let context = "Entra les dades obligatòries per afegir una nova zona";
  if (currentItem._id !== null)
  context = "Pots canviar les dades per editar la zona";

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minHeight: "60vh",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle>{operacio}</DialogTitle>
        <DialogContent>
          <DialogContentText>{context}</DialogContentText>
          <ShowErrors errors={errors} setErrors={setErrors}></ShowErrors>
          <ShowMessage message={message} setMessage={setMessage}></ShowMessage>


  <TextField margin="dense" id="name"
  name="name"
  label="Nom"
  type="text"
  fullWidth
  variant="outlined"
  value={currentItem.name}
  onChange={handleChange}
  />

  <TextField margin="dense" id="blueprint"
  name="blueprint"
  type="file" 
  fullWidth
  variant="outlined"
  
  onChange={handleChangeBlueprint}
  />

  <TextField required margin="dense" id="buildings"
  name="buildings"
  label="Building"
  select
  fullWidth
  variant="standard"
  value={currentItem.building || ""}
  onChange={(e) => handleChangeBuildings(e.target.value)}
  >
  {buildings.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
    </MenuItem>
  ))}
</TextField>

{ currentItem.blueprint &&

<img src={"http://localhost:8080/images/zones/" +currentItem.blueprint} width="550" height="500"></img>
}
</DialogContent>

<DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
</Dialog>
</React.Fragment>
);
}


