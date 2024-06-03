import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import List from "../../components/Actions/List";


export const ActionsPage = () => {   
    return (
        <BasicPage title="Accions" icon={<SchoolIcon/>}>
                     <List></List>

        </BasicPage>
  )
};