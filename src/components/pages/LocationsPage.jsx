import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import List from "../locations/List"
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';


export const LocationsPage = () => {   
    return (
        <BasicPage title="Localitzacions" icon={<MeetingRoomIcon/>}>
          <List></List>
        </BasicPage>
  )
};