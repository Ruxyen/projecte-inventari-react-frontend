import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import Tree from "../cfs/Tree";


export const TreePage = () => {   
    return (
        <BasicPage title="Exemple arbre" icon={<SchoolIcon/>}>
           <Tree ></Tree>
        </BasicPage>
  )
};