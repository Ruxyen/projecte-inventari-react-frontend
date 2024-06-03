import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export default function ShowErrors({errors, setErrors}) {

  console.log(errors)
  if(!errors) return <></>
  return (
  
      <Alert severity="error" sx={{ mt:2, mb:2 }} onClose={() => { setErrors(null) }}>
        <AlertTitle>Error</AlertTitle>
          <Stack sx={{ width: '100%' }} spacing={2}>
           {  errors.map((error, index) =>  <div key={index}> {error.msg} </div>) }
          </Stack>
      </Alert>    
   
  );
}
