import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";

import Select2 from "react-select";

import api from "../services/axiosClient";
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";

export default function Form({
  open,
  setOpen,
  currentItem,
  setCurrentItem,
  getList,
}) {
  
  const [zones, setZones] = useState([]);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);

  const getZones = async () => {
    try {
      const url = "/zones";
      const response = await api.get(url);
      setZones(response.data);
    } catch {
      setErrors([{ msg: "Error recuperant la llista de Zones..." }]);
    }
  };

  useEffect(() => {
    getZones();
  }, []);

  useEffect(() => {
    if (!open) {
      // Restablecer currentItem cuando se cierra el formulario
      setCurrentItem({ _id: null, name: "", zone: [], is_bookable: false });
    }
  }, [open, setCurrentItem]);

  const handleChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const handleChangeZones = (value) => {
    setCurrentItem({ ...currentItem, zone: value });
  };

  const handleSave = (e) => {
    setErrors(null);
    setMessage(null);

    if (currentItem._id === null) save();
    else update();
  };

  const save = async (event) => {
    try {
      const url = "/locations";
      const response = await api.post(url, {
        name: currentItem.name,
        zone: currentItem.zone,
        is_bookable: currentItem.is_bookable,
      });
      console.log(response.data);
      setCurrentItem(response.data);
      setMessage("S'ha afegit correctament la nova localització.");
      getList();
    } catch (error) {
      console.log(error);
      if (error.response.data.errors) setErrors(error.response.data.errors);
      else setErrors([{ msg: "Error en crear la localització" }]);
    }
  };

  const update = async (event) => {
    try {
      const url = "/locations/" + currentItem._id;
      const response = await api.put(url, currentItem);
      setMessage("S'ha modificat correctament la localització.");
      getList();
    } catch (error) {
      console.log(error);
      if (error.response.data.errors) setErrors(error.response.data.errors);
      else setErrors([{ msg: "Error en modificar la localització" }]);
    }
  };

  const handleClose = () => {
    setErrors(null);
    setMessage(null);
    setOpen(false);
  };

  let operacio = "Nova localització";
  if (currentItem._id !== null) operacio = "Editar localització";

  let context = "Entra les dades obligatòries per afegir una nova localització";
  if (currentItem._id !== null)
    context = "Pots canviar les dades per editar la localització";

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

          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Nom"
            type="text"
            fullWidth
            variant="outlined"
            value={currentItem.name}
            onChange={handleChange}
          />

          <TextField
            required
            margin="dense"
            id="zones"
            name="zones"
            label="Zona"
            select
            fullWidth
            variant="standard"
            value={currentItem.zone || ""}
            onChange={(e) => handleChangeZones(e.target.value)}
          >
            {zones.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name} - {option.building.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="dense"
            id="is_bookable"
            name="is_bookable"
            label="Reservable"
            select
            fullWidth
            variant="standard"
            value={currentItem.is_bookable}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, is_bookable: e.target.value })
            }
          >
            <MenuItem value={true}>Sí</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tancar</Button>
          <Button onClick={handleSave}>Desar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
