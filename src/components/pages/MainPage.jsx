import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { BasicPage } from "../templates/BasicPage";


import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const MainPage = () => {
  return (
    <BasicPage title="Home" icon={<DashboardIcon />}>

      <Grid container spacing={3}>
        {/* General */}
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ minHeight: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image='/classroom.jpg'
              title="una classe amb taules"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Inventari
              </Typography>
              <Typography variant="body2" color="text.secondary">
                La nostra app de gestió d'inventari per a instituts de secundària ofereix una plataforma centralitzada per gestionar eficaçment tots els recursos i materials de l'institut. Amb aquesta aplicació, el personal de l'institut, com ara els administradors, els professors i els membres del personal, poden supervisar i controlar el flux d'articles, des de material d'oficina fins a equips de laboratori i material educatiu.
              </Typography>
            </CardContent>

          </Card>

        </Grid>


          {/* Grup 1 */}
               <Grid item xs={12} md={8} lg={6}>
                  <Card sx={{ minHeight: 345 }}>
                            <CardMedia
                              sx={{ height: 140 }}
                              image='/imatge-materials.jpg'
                              title="una classe amb taules"
                            />
                            <CardContent>
                              <Typography gutterBottom variant="h5" component="div">
                                Elements inventari
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                            
                              Ens centrem en garantir que el material necessari estigui disponible, utilitzant categories per classificar-lo i un sistema de stock per quantificar-lo. L'objectiu és facilitar l'accés del personal de l'institut als materials essencials per a les seves tasques diàries. També mantenim les categories de materials actualitzades per a una millor organització dels recursos al sistema de gestió d'inventari.
                               </Typography>
                            </CardContent>
                          
                  </Card>              
                
              </Grid>


        {/* Grup 2 */}
        <Grid item xs={12} md={8} lg={6}>
          <Card >
            <CardMedia
              sx={{ height: 140 }}
              image='/classroom.jpg'
              title="una classe amb taules"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ...............

              </Typography>
            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={8} lg={6}>
          <Card >
            <CardMedia
              sx={{ height: 140 }}
              image='/building.jpg'
              title="una classe amb taules"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Edifici, Aula i Zones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                El nostre grup s'ha encarregat dels edificis, zones i aules que té l'institut.

                En els edificis es podrà veure la direcció on aquesta situat i el nom que tenen.

                En la zona es podrà veure el nom, el pla i l'edifici on es veurien les plantes.

                A l'aula es veurà el nom, si és reservable i la zona en la qual se situa.
              </Typography>
            </CardContent>

          </Card>

        </Grid>



        {/* Accions, Rols i Usuaris */}
        <Grid item xs={12} md={8} lg={6}>
          <Card >
            <CardMedia
              sx={{ height: 140 }}
              image='/usuaris.png'
              title="tres persones treballant amb l'ordinador"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Accions, Rols i Usuaris
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aquesta secció de l'aplicació proporciona funcionalitats relacionades amb la gestió d'accions, rols i usuaris. Permet als administradors supervisar i controlar les accions disponibles, assignar rols als usuaris i gestionar l'accés i els permisos dels mateixos. A més, ofereix la capacitat d'afegir, editar i eliminar tant accions com rols i usuaris, proporcionant així una eina completa de gestió de permisos i accessos a l'aplicació.
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        {/* Grup 4 */}
        

      </Grid>

    </BasicPage>
  )
};


