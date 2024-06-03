import React, { useState, useEffect } from "react";
import api from '../services/axiosClient';
import ShowErrors from "../utils/ShowErrors";
import ShowMessage from "../utils/showMessage";
import { ShowTree } from "../utils/ShowTree";

const Tree = ({ onSelectCategory, updateList }) => {
    const url = "/categories/tree";
    const [data, setData] = useState(null);
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

// Obtenir categoría asociada
const handleSelectItem = async (event, nodeId) => {
    const selectedCategoryData = findCategoryById(data, nodeId);

    if (!selectedCategoryData.parent_id) {
        //console.log("General clicado", nodeId);

        //evitar doble execució de "General"
        if (selectedCategory !== null) {
            setSelectedCategory(null); 
            updateList(); 
        }
    } else {
        //mostrar en la llista si es clica en una categoría sense children
        if (!selectedCategoryData.children || selectedCategoryData.children.length === 0) {
            //console.log("Categoría seleccionada: ", nodeId);
            if (nodeId !== selectedCategory) {
                setSelectedCategory(nodeId); 
                onSelectCategory(nodeId);
            }
        }
    }
};


    //Trovar categoría per Id
    const findCategoryById = (categories, categoryId) => {
        for (const category of categories) {
            if (category.id === categoryId) {
                return category;
            }
            if (category.children && category.children.length > 0) {
                const foundCategory = findCategoryById(category.children, categoryId);
                if (foundCategory) {
                    return foundCategory;
                }
            }
        }
        return null;
    };
    
    useEffect(() => {
        const getList = async () => {
            try {
                const response = await api.get(url);
                setData(response.data);
            } catch (error) {
                setErrors([{msg:"Error recuperant la llista d'elements..."}]);
            }
        };
        getList();
    }, []);

    if (!data) return <div>Carregant dades....</div>;
    return (
        <>
            <ShowErrors errors={errors} setErrors={setErrors} />
            <ShowMessage message={message} setMessage={setMessage} />
            <ShowTree items={data} handleSelectItem={handleSelectItem} selectedItem={selectedCategory} />
        </>
    );
};

export default Tree;
