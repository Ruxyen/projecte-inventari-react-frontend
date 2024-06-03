import { useEffect, useState } from 'react';
import axiosClient from '../services/axiosClient'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ShowCategoriesTree } from "./ShowCategoriesTree";

import NewEditDialog from "./NewEditDialog";
import AlertDialog from "../utils/AlertDialog";
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";

function List() {

    const url = "/categories"
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [categories, setCategories] = useState(null);
    const [openNewEditDialog, setOpenNewEditDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState({ _id: null, name: "", parent_id: "" });
    const [userRoles, setUserRoles] = useState([]);
    const userRol = JSON.parse(localStorage.getItem('user'))?.role;

    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);

    const handleConfirmDelete = (id) => {
        setOpen(true);
        setSelectedId(id);
    }

    const handleDelete = async (id) => {
        setOpen(false);
        try {
            await axiosClient.delete('/categories/recursive/' + selectedId);
            getList(); 
            setMessage("Categoría y subcategorías eliminades correctamente.");
        } catch (error) {
            console.log(error);
            setErrors([{ msg: "Error al eliminar la categoría" }]);
        }
    };

    const getList = async () => {
        try {
            const response = await axiosClient.get(url + '/tree');
            setData(response.data)
        }
        catch {
            setErrors([{ msg: "Error recuperant la llista d'elements..." }])
        }
    };

    const handleOpenNewEditDialog = (parent_id) => {
        setCurrentItem({
            _id: null, name: "", parent_id: parent_id
        })
        setOpenNewEditDialog(true);
    }

    const handleSelectItem = async (event, nodeId) => {
        console.log(nodeId)
        console.log(event.target.innerText)
    }

    const handleEdit = async (id) => {
        try {
            const response = await axiosClient.get(url + "/" + id);
            setCurrentItem(response.data)
            setOpenNewEditDialog(true);

        }
        catch {
            setErrors([{ msg: "Error recuperant el cicle formatiu seleccionat..." }])
        }
    }

    useEffect(() => {
        getList();
    }, []);

    if (!data) {
        return <>Carregant dades.....</>
    }

    return (
        <Stack spacing={2} sx={{ maxWidth: '80%', margin: 'auto', justifyContent: 'center' }}>

            <AlertDialog open={open}
                setOpen={setOpen}
                message={"Segur que vols esborrar la categoria y totes les seves subcategories?"}
                handleDelete={handleDelete}>
            </AlertDialog>

            <NewEditDialog open={openNewEditDialog} setOpen={setOpenNewEditDialog}
                currentItem={currentItem} setCurrentItem={setCurrentItem}
                getList={getList}
            />

            <ShowCategoriesTree
                items={data}
                handleSelectItem={handleSelectItem}
                selectedItem={null}
                handleEdit={handleEdit}
                handleDelete={handleConfirmDelete}
                handleOpenNewEditDialog={handleOpenNewEditDialog}
                userRol={userRol}
            />
        </Stack>
    );
}

export default List