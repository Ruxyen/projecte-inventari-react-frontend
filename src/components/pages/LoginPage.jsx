import { useState } from "react";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ShowErrors from "../utils/ShowErrors";
import api from '../services/axiosClient'
import { useAuth } from "../hooks/useAuth";

const theme = createTheme({
    palette: {
      primary: { main: "#212f3d" }
    }
  });






export const LoginPage = () => {

  const { login} = useAuth();
  const [errors, setErrors] = useState(null);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {                 
        const response = await api.post("/auth/login", {email, password } );   
        login({
            email: response.data.email,
            name: response.data.name,
            role: response.data.role,
            token: response.data.token
        });
       
    }
    catch(error)
    {       
        if(error.response.data.errors) setErrors(error.response.data.errors)
        else setErrors([{msg:"Error en les credencials"}]) 
       // login(null)        
    }   


  };

  

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(vib.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
           
            </Box>
          </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
          
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            
              <Button
                type="submit"
                fullWidth
               
                variant="contained"
                
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              
              <ShowErrors errors={errors} setErrors={setErrors} ></ShowErrors>


            </Box>
            
          </Box>

        </Grid>

      

      </Grid>
    </ThemeProvider>
  );
};
