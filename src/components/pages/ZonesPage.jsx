import React from "react";
import LayersIcon from '@mui/icons-material/Layers';
import { BasicPage } from "../templates/BasicPage";
import List from "../zones/List";

export const ZonesPage = () => {   
    return (
        <BasicPage title="Zones o plantes" icon={<LayersIcon/>}>
         <List></List> 
        </BasicPage>
  )
};