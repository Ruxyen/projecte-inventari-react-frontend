//componente principal para mostrar usuarios, etc

import { useEffect, useState } from "react";
import "../../App.css";
//import axiosClient from "../services/axiosClient";
import axios from "axios";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "../utils/AlertDialog";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Form from "./Form";
import ShowErrors from "../utils/ShowErrors";

function List() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [errors, setErrors] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    _id: null,
    name: "",
    zone: [],
  });

  const userRoles = JSON.parse(localStorage.getItem("user"))?.role;

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleShowForm = () => {
    setOpenForm(true);
  };

  const handleDelete = async () => {
    // esborrar el registre
    setOpen(false);
    console.log(selectedId);
    try {
      await axios.delete("/locations/" + selectedId);
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleConfirmDelete = (id) => {
    setOpen(true);
    setSelectedId(id);
    console.log(id);
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get("/locations/" + id);
      setCurrentItem(response.data);
      setOpenForm(true);
    } catch {
      setErrors([
        { msg: "Error recuperant les localitzacions seleccionat..." },
      ]);
    }
  };

  const getList = async () => {
    try {
      const response = await axios.get("/locations/list?page=" + page);
      setData(response.data);
      console.log(response.data);
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    getList();
  }, [page]);

  if (!data) return <>Carregant dades......</>;

  return (
    <div>
      <Stack spacing={2}>
        <Form
          open={openForm}
          setOpen={setOpenForm}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          getList={getList}
        ></Form>

        <AlertDialog
          open={open}
          setOpen={setOpen}
          message={"Segur que vols esborrar la localització?"}
          handleDelete={handleDelete}
        ></AlertDialog>
        <ShowErrors errors={errors} setErrors={setErrors}></ShowErrors>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="center">Zona</TableCell>
                <TableCell align="center">Reservable</TableCell>
                <TableCell align="left">
                  {userRoles &&
                    userRoles.some((role) => role.name === "Admin") && ( // Mostra el botó només si l'usuari té el rol "Teacher"
                      <IconButton onClick={handleShowForm} aria-label="alta">
                        <AddIcon />
                      </IconButton>
                    )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.docs.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.zone.name}</TableCell>
                  <TableCell align="center">
                    {row.is_bookable ? "Sí" : "No"}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      {userRoles &&
                        userRoles.some((role) => role.name === "Admin") && ( // Mostra el botó només si l'usuari té el rol "Teacher"
                          <IconButton
                            onClick={() => handleConfirmDelete(row._id)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      {userRoles &&
                        userRoles.some((role) => role.name === "Admin") && ( // Mostra el botó només si l'usuari té el rol "Teacher"
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => handleEdit(row._id)}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Paper
          variant="outlined"
          sx={{
            p: 1,
            mt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Pagination
            count={data.totalPages}
            page={data.page}
            onChange={handleChangePage}
            siblingCount={0}
          />
        </Paper>
      </Stack>
    </div>
  );
}
export default List;
