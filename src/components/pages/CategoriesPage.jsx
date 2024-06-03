import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import List from "../categories/List"


export const CategoriesPage = () => {   
    return (
        <BasicPage title="Categories" icon={<SchoolIcon/>}>
          <List></List>
        </BasicPage>
  )
};