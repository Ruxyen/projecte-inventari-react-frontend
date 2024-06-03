import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import List from "../buildings/List"

export const BuildingsPage = () => {   
    return (
        <BasicPage title="Edificis" icon={<SchoolIcon/>}>
          <List></List>
        </BasicPage>
  )
};