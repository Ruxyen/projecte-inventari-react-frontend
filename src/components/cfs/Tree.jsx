import React, { useState, useEffect } from "react";

import api from '../services/axiosClient'


import AlertDialog from "../utils/AlertDialog";
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";
import { ShowTree } from "../utils/ShowTree";

const Tree = () => {

    const url = "/categories/tree"          
    const [data, setData] = useState();      
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null); 
    
   

    const handleSelectItem = async (event,nodeId) => { 
        console.log(nodeId)
        console.log(event.target.innerText)
    }

   
  
    const getList = async () => {  
        try {                 
            const response = await api.get(url);                   
            setData(response.data)
        }
        catch{
          setErrors([{msg:"Error recuperant la llista d'elements..."}])
        }   
    };
  
  
    useEffect(() => {   
                 
        getList()  
    }, []);
     

   
   
   

    if(!data) return <div>Carregant dades....</div>
    return (
      <>                
        <ShowErrors errors={errors} setErrors={setErrors} ></ShowErrors>
        <ShowMessage message={message} setMessage={setMessage} ></ShowMessage>
        <ShowTree items={data} handleSelectItem={handleSelectItem} selectedItem={null}></ShowTree>
      </>      
    );
  
  
  
  };
   
  export default Tree;