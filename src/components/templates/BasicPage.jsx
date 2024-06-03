import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { deepOrange, green } from '@mui/material/colors';
export const BasicPage = ({ title, icon, children }) => {
  return (
    <Container component="main">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Avatar>{icon}</Avatar>
       
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
      </Box>
      {children}
    </Container>
  );
};

