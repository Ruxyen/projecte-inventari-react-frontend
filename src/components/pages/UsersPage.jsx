import React from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { BasicPage } from "../templates/BasicPage";
import List from "../users/List"

export const UsersPage = () => {   
    return (
        <BasicPage title="Usuaris" icon={<AccountCircle/>}>
          <List></List>
        </BasicPage>
  )
};