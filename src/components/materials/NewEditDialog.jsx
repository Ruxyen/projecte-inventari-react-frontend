
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Tree from "./Tree";

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


export default function NewEditDialog({open, setOpen, currentItem, setCurrentItem, getList, isEditing}) {
 
  //const [currentItem,setCurrentItem] = useState({ _id: null, name: "", code: "", grade: "", hours: 1000, family: [] ,career_opportunities: ["cap"],  info_modules: [
  //  { number: 1, name:  "M1", hours: 200}]  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null); 
  const [image, setImage] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  //imatge seleccionada per l'usuari
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    
  };

  //obtenir categories 
  const getCategories = async () => {  
    try {                 
        const url = '/categories'
        const response = await api.get(url);              
        setCategories(response.data)
    }
    catch{
      setErrors([{msg:"Error recuperant la llista de categoríes..."}])  
    }   
  };

  //obtenir el nom de la categoria seleccionada
  const getCategoryName = async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      setCategoryName(response.data.name); // Almacenar el nombre de la categoría en la variable de estado
    } catch (error) {
      setErrors([{ msg: "Error obtenint el nom de la categoria seleccionada" }]);
    }
  };


  useEffect(() => {

    if (currentItem.category) {
      getCategoryName(currentItem.category);
    }
    //console.log("isEditing: ", currentItem.category)
    getCategories();
    setSelectedCategory(currentItem.category);
  }, [currentItem.category]); 


  const handleChange = e => {             
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });         
  };


  const handleSave =  (e) => {
   
    setErrors(null);
    setMessage(null);

    if(currentItem._id===null) save(); 
    else update();    
  }



  
  const save = async () => { 
    try {    
        // 1: Enviar les dades del material
        const url = '/materials';
        const responseMaterial = await api.post(url, { 
            "name": currentItem.name, 
            "description": currentItem.description, 
            "category": currentItem.category, 
        });   

        //console.log(responseMaterial.data);
        setCurrentItem(responseMaterial.data);

        // 2: Pujar la imatge si hi ha resposta del POST
        if (responseMaterial.data) {
            const urlImage = `/materials/image/${responseMaterial.data._id}`;
            var formData = new FormData();

            //console.log("Selected Image:", image); 
            formData.append('image', image);
            
            const responseImage = await api.put(urlImage, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            

            //console.log(responseImage.data);
            setMessage("S'ha afegit correctament el nou material.");   
            getList();
        }
        
    } catch(error) {
        console.error(error);
        if (error.response.data.errors) {
            setErrors(error.response.data.errors);
        } else {
            setErrors([{msg:"Error en crear el material"}]);
        }
    }     
};


  const update = async (event) => { 
    try {    
      // 1: Actualitzar la informació del material
      const url = '/materials/' + currentItem._id;
      
      // Assignar la categoria seleccionada per l'usuari a currentItem
      currentItem.category = selectedCategory; 
      
      const responseMaterial = await api.put(url, currentItem);            
  
      setCurrentItem(responseMaterial.data);

      // 2: Pujar la imatge si s'ha seleccionat
      if (responseMaterial.data && image) { 
        const urlImage = `/materials/image/${responseMaterial.data._id}`;
        var formData = new FormData();
    
        formData.append('image', image);
                
        const responseImage = await api.put(urlImage, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setMessage("S'ha modificat correctament el material.");  
      } else {
        //Si no s'ha enviat cap imatge, mostrar missatge i actualitzar taula
        setMessage("S'ha modificat correctament el material.");  
        getList();
      }
    }
    catch(error) {
      console.log(error)
      if(error.response.data.errors) setErrors(error.response.data.errors)
      else setErrors([{msg:"Error en modificar el material"}])                    
    }     
  };




//Tancar formulari
  const handleClose = () => {
    setErrors(null)
    setMessage(null)
    setOpen(false);
  };

  
// handle la selecció de la categoria
const handleSelectCategory = async (categoryId) => {
  try {
    setSelectedCategory(categoryId);

    //Obtenir i mostrar el nom de la categoria seleccionada
    await getCategoryName(categoryId); 
  } catch (error) {
    setErrors([{ msg: "Error obtenint el nom de la categoria seleccionada" }]);
  }
};
      
  
//Títol del Form
  let operacio = `Nou Material ${categoryName}`;
  if(currentItem._id!==null) operacio = "Editar Material"

  let context = "Entra les dades obligatòries per afegir un nou material";
  if(currentItem._id!==null) context = "Pots canviar les dades per editar el material"

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
           
           <input
              accept="image/*"
              id="image-input"
              name="image" 
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
          />

    <label htmlFor="image-input">
    
      <Button variant="contained" component="span">
        Subir Imagen
      </Button>
    </label>


          <TextField margin="dense" id="description" name="description" label="descripció" type="text" fullWidth variant="outlined" 
            value={currentItem.description} onChange={handleChange} />
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

          
<React.Fragment>
  {/* Mostrar textfield amb el nom de la categoria*/}
  <div>
    <TextField
      margin="dense"
      id="category"
      name="category"
      label="categoría"
      fullWidth
      variant="outlined"
      value={categoryName || 'Per crear un material, selecciona una categoría'}
      InputProps={{
        readOnly: true,
      }}
    />
  </div>

  {/* Mostrar Tree en cas que s'estigui editant */}
  {isEditing && <Tree onSelectCategory={handleSelectCategory}/>}
</React.Fragment>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tancar</Button>
          <Button onClick={handleSave}>Desar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}