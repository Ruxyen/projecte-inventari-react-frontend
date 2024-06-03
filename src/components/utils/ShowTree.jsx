import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import Paper from '@mui/material/Paper';

export const ShowTree = ({ items, handleSelectItem, defaultSelected=null, isLoading}) => {
  
  // Mostra l'arbre de forma recursiva
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id}  itemId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  
  if(items===null || items.lenght==0 ) return (
    <Paper sx={{p: 2, display: 'flex',flexDirection: 'column', }}>
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


