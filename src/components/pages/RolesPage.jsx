import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import List from "../roles/List"

export const RolesPage = () => {   
    return (
        <BasicPage title="Roles" icon={<SchoolIcon/>}>
          <List></List>
        </BasicPage>
  )
};