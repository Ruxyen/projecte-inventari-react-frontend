
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';

//import Select2 from 'react-select'

import api from '../services/axiosClient'
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";



/*
var  CFSchema = new Schema({  
    name: { type: String, required: true, unique: true },
    code: {type: String, required: true, unique: true},
    grade: {
        type: String,
        enum : ['GM','GS'],
        default: 'GM'
    },
    hours: {type: Number, min: 1000},
    isDUAL: Boolean,
    category:  { type: Schema.ObjectId, ref: "Category", required: false },
    career_opportunities: [String],
    info_modules: [
        { number: {type: Number, required: true},
          name:  { type: String, required: true},
          hours: {type: Number}
        }
    ]
});
*/


export default function NewEditDialog({ open, setOpen, currentItem, setCurrentItem, getList }) {

  //const [currentItem,setCurrentItem] = useState({ _id: null, name: "", code: "", grade: "", hours: 1000, category: [] ,career_opportunities: ["cap"],  info_modules: [
  //  { number: 1, name:  "M1", hours: 200}]  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);

  const getCategories = async () => {
    try {
      const url = '/categories'
      const response = await api.get(url);
      setCategories(response.data)
    }
    catch {
      setErrors([{ msg: "Error recuperant la llista de categories..." }])
    }
  };

  useEffect(() => {
    getCategories()
  }, []);

  const handleChange = e => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const handleChangeCategories = value => {
    setCurrentItem({ ...currentItem, "category": value });
  };


  const handleSave = (e) => {

    setErrors(null);
    setMessage(null);

    if (currentItem._id === null) save();
    else update();
  }


  const save = async (event) => {
    try {
      const url = '/categories'
      const response = await api.post(url, {
        "name": currentItem.name,
        "parent_id": currentItem.parent_id,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data)
      setCurrentItem(response.data)
      setMessage("S'ha afegir correctament la nova categoria.");
      getList();
      await getCategories();
    }
    catch (error) {
      console.log(error)
      if (error.response.data.errors) setErrors(error.response.data.errors)
      else setErrors([{ msg: "Error en crear la categoria" }])
    }
  };

  const update = async (event) => {
    try {
      const url = '/categories/' + currentItem._id
      const response = await api.put(url, currentItem, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage("S'ha modificat correctament la categoria.");
      getList();
      await getCategories();
    }
    catch (error) {
      console.log(error)
      if (error.response.data.errors) setErrors(error.response.data.errors)
      else setErrors([{ msg: "Error en modificar la categoria" }])
    }
  };

  const handleClose = () => {
    setErrors(null)
    setMessage(null)
    setOpen(false);
  };

  let operacio = "Nova Categoria";
  if (currentItem._id !== null) operacio = "Editar Categoria"

  let context = "Entra les dades obligatòries per afegir una nova categoria";
  if (currentItem._id !== null) context = "Pots canviar les dades per editar la categoria"

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minHeight: '40vh',
            maxHeight: '80vh',
            minWidth: '70vh',
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
          { /*
          <Select2
                            onChange={handleChangeCategories}
                            isMulti
                            name="category"
                            value={currentItem.category}
                            options={categories}
                            getOptionLabel ={(option)=>option.name}
                            getOptionValue ={(option)=>option._id}
                            className="basic-multi-select"
                            classNamePrefix="select"
        />     
        */
          }

          <TextField margin="dense" id="parent_id" name="parent_id" label="categoria pare" select fullWidth variant="outlined"
            value={currentItem.parent_id || ""} onChange={handleChange} disabled={currentItem._id === null && currentItem.parent_id !== ""} >
            <MenuItem key={"Sense categoria"} value="">Sense categoria</MenuItem>
            {categories.filter(option => option._id !== currentItem._id).map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name}
              </MenuItem>
            ))}
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