import React from "react";
import PlumbingIcon from '@mui/icons-material/Plumbing';
import { BasicPage } from "../templates/BasicPage";
import List from "../incident/List"


export const IncidentsPage = () => {   
    return (
        <BasicPage title="Incidents" icon={<PlumbingIcon/>}>
          <List></List>
        </BasicPage>
  )
};