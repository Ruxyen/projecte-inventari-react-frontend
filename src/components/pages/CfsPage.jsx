import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import List from "../cfs/List"

export const CfsPage = () => {   
    return (
        <BasicPage title="Cicles formatius" icon={<SchoolIcon/>}>
           <List></List>
        </BasicPage>
  )
};