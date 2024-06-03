import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import Paper from '@mui/material/Paper';

export const ShowCategoriesTree = ({ items, handleSelectItem, handleEdit, handleDelete, handleOpenNewEditDialog, defaultSelected = null, isLoading, userRol }) => {

    // Mostra l'arbre de forma recursiva
    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} itemId={nodes.id}
            label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{nodes.name}</span>
                    <div style={{ marginLeft: 'auto' }}>
                        {userRol && (userRol.some(role => role.name === 'Admin') || userRol.some(role => role.name === 'Teacher')) && (
                            <IconButton onClick={(event) => {
                                event.stopPropagation();
                                handleOpenNewEditDialog(nodes.id);
                            }}>
                                <AddCircleIcon />
                            </IconButton>
                        )}

                        {userRol && (userRol.some(role => role.name === 'Admin') || userRol.some(role => role.name === 'Teacher')) && (
                            <IconButton onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(nodes.id);
                            }}>
                                <EditIcon />
                            </IconButton>
                        )}

                        {userRol && (userRol.some(role => role.name === 'Admin') || userRol.some(role => role.name === 'Teacher')) && (
                            <IconButton onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(nodes.id);
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </div>
                </div>
            }
        >
            {
                Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null
            }
        </TreeItem >
    );


    if (items === null || items.lenght == 0) return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', }}>
            Arbre no carregat ...
        </Paper>
    )

    // Es crea per si tenim un Arbre amb diverses caregories pare
    const listItems = items.map((node) =>
        renderTree(node)
    );

    return (
        <SimpleTreeView

            onSelectedItemsChange={handleSelectItem}

            disableSelection={isLoading}
        >
            {listItems}
        </SimpleTreeView>
    );
}