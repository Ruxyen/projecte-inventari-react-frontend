import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import MaterialIcon from '@mui/icons-material/HdrStrong';
import { BasicPage } from "../templates/BasicPage";
import List from "../materials/List"


export const MaterialsPage = () => {   
    return (
        <BasicPage title="Materials" icon={<MaterialIcon/>}>
                     <List></List>
        </BasicPage>
  )
};
