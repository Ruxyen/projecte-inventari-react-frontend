import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import { BasicPage } from "../templates/BasicPage";
import List from "../Stocks/List";
import { useParams } from 'react-router-dom';

export const StocksPage = () => {
    const { id } = useParams();

    return (
        <BasicPage title="Stocks" icon={<SchoolIcon/>}>
             <List idMaterial={id}></List>
        </BasicPage>
    );
};
