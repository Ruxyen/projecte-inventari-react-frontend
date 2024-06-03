
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
    family:  { type: Schema.ObjectId, ref: "Family", required: false },
    career_opportunities: [String],
    info_modules: [
        { number: {type: Number, required: true},
          name:  { type: String, required: true},
          hours: {type: Number}
        }
    ]
});
*/


export default function NewEditDialog({open, setOpen, currentItem, setCurrentItem, getList}) {
 
  //const [currentItem,setCurrentItem] = useState({ _id: null, name: "", code: "", grade: "", hours: 1000, family: [] ,career_opportunities: ["cap"],  info_modules: [
  //  { number: 1, name:  "M1", hours: 200}]  });
  const [families, setFamilies] = useState([]);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null); 

  const getFamilies = async () => {  
    try {                 
        const url = '/example/families'
        const response = await api.get(url);              
        setFamilies(response.data)
    }
    catch{
      setErrors([{msg:"Error recuperant la llista de famílies..."}])  
    }   
  };

  
  useEffect(() => {                  
    getFamilies()  
  }, []);

  const handleChange = e => {             
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });         
  };

  const handleChangeFamilies = value => {             
    setCurrentItem({ ...currentItem, "family": value });         
  };


  const handleSave =  (e) => {
   
    setErrors(null);
    setMessage(null);

    if(currentItem._id===null) save(); 
    else update();    
  }


  const save = async (event) => { 
      try {    
        const url = '/example/cfs'  
        const response = await api.post(url, 
          { 
          "name": currentItem.name, 
          "code": currentItem.code, 
          "grade": currentItem.grade, 
          "hours": currentItem.hours, 
          "family": currentItem.family ,
          "career_opportunities": ["cap"],  
          "info_modules": [{ "number": 1, "name":  "M1", "hours": 200}]  });   
        console.log(response.data)
        setCurrentItem(response.data)         
        setMessage("S'ha afegir correctament el nou cicle formatiu.");   
        getList();
        
      }
      catch(error) {
        console.log(error)
        if(error.response.data.errors) setErrors(error.response.data.errors)
        else setErrors([{msg:"Error en crear el cicle formatiu"}])                    
      }     
  };

  const update = async (event) => { 
    try {    
      const url = '/example/cfs/'+ currentItem._id  
      const response = await api.put(url, currentItem);            
      setMessage("S'ha modificat correctament el cicle formatiu.");   
      getList();
    }
    catch(error) {
      console.log(error)
      if(error.response.data.errors) setErrors(error.response.data.errors)
      else setErrors([{msg:"Error en modificar el cicle formatiu"}])                    
    }     
};


  const handleClose = () => {
    setErrors(null)
    setMessage(null)
    setOpen(false);
  };

  let operacio = "Nou Cicle Formatiu";
  if(currentItem._id!==null) operacio = "Editar Cicle Formatiu"

  let context = "Entra les dades obligatòries per afegir un nou cicle formatiu";
  if(currentItem._id!==null) context = "Pots canviar les dades per editar el cicle formatiu"

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
          <TextField margin="dense" id="code" name="code" label="codi" type="text" fullWidth variant="outlined" 
           onChange={handleChange} />
          { /*
          <Select2
                            onChange={handleChangeFamilies}
                            isMulti
                            name="family"
                            value={currentItem.family}
                            options={families}
                            getOptionLabel ={(option)=>option.name}
                            getOptionValue ={(option)=>option._id}
                            className="basic-multi-select"
                            classNamePrefix="select"
        />     
        */
      }

          <TextField margin="dense" id="grade" name="grade" label="grau" select fullWidth variant="outlined" 
           value={currentItem.grade}  onChange={handleChange} >
               <MenuItem key={"GM"} value={"GM"}>GM</MenuItem>
               <MenuItem key={"GS"} value={"GS"}>GS</MenuItem>
          </TextField>
          
          <TextField margin="dense" id="hours" name="hours" label="hores" type="number" fullWidth variant="outlined" 
            value={currentItem.hours} onChange={handleChange} />
          
          <TextField margin="dense" id="family" name="family" label="família" select fullWidth variant="outlined" 
            value={currentItem.family} onChange={handleChange} >
             <MenuItem key={"sensevalor"} value="">Tria una família</MenuItem>
            {families.map((option) => (
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