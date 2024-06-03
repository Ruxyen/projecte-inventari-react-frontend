import * as React from 'react';
import Alert from '@mui/material/Alert';


const ShowMessage = ({message, setMessage}) => {
//export default function ShowMessage({message, setMessage}) {

  if(!message) return <></>
  return (
  
      <Alert severity="success" sx={{ mt:2, mb:2 }} onClose={() => { setMessage(null) }}>      
           { message }       
      </Alert>    
   
  );
}

export default ShowMessage;