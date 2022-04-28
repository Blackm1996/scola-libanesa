import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { Box } from "@mui/material";
import { Modal, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import { connect } from "react-redux";
import TeachersTable from "./sub-components/TeachersTable";
import BodyOfEdit from "./sub-components/BodyOfEdit";
import swal from "sweetalert";

// base url
const baseUrl = "http://mmm.escola-libanesa.com/test2/api/usersInfos";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    //border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

function TeachersList(props) {
  //useStyles
  const styles = useStyles();

  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const [data, setData] = useState([]);
  const [dataAPI, setDataAPI] = useState([]);
  const [loading, setLoading] = useState([]);

  // modals
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // choosed User
  const [choosedUser, setChoosedUser] = useState({
    id: "",
    userName: "",
    role: "",
  });

  // Language KEywords
  const {
    teachers,
    id,
    role,
    userName,
    actions,
    searchQuery,
    edit,
    delete1,
    confirmDeleteStr,
    phoneNumber,
    name,
    success,
  } = langKeywords[pageLanguage];

  //table columns
  const columns = [
    { title: `${id}`, field: "id" },
    { title: `${name}`, field: "full_name" },
    { title: `${userName}`, field: "userName" },
    //{ title: `${role}`, field: "role" },
    { title: `${phoneNumber}`, field: "Tel" },
    { title: "Email", field: "Email" },
  ];

  // use effect
  useEffect(() => {
    axios
      .get(`/teachersInfos`)
      .then((response) => {
        setData(response.data);
        setDataAPI(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setChoosedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  //on search change
  const search = (query) => {
    if (query.toString().trim() !== "") {
      console.log(query.toString().trim());
      let students = dataAPI.filter((student) => {
        let { id, userName, role } = student;
        userName = userName.toLowerCase();
        role = role.toLowerCase();
        if (
          id.toString().startsWith(query) ||
          userName.startsWith(query.toLowerCase()) ||
          role.startsWith(query.toLowerCase())
        ) {
          return student;
        }
      });
      setData(students);
    } else {
      setData(dataAPI);
    }
  };

  const updateUser = async () => {
    await axios
      .post(baseUrl, choosedUser)
      .then((response) => {
        setData(data.concat(response.data));
        openCloseModalIsert();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //delete teachers from db
  const confirmDelete = async () => {
    setLoading(true);
    await axios
      .delete(`/deleteInstructor/${choosedUser.id}`)
      .then((response) => {
        if (response.status === 200) {
          swal(success, {
            icon: "success",
          }).then((succ) => {
            setData(data.filter((user) => user.id !== choosedUser.id));
            openCloseModalDelete();
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const chooseUser = (user, caso) => {
    console.log("user choosed", user);
    setChoosedUser(user);
    caso === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const openCloseModalIsert = () => {
    setModalInsert(!modalInsert);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Add new User</h3>
      <TextField
        className={styles.inputMaterial}
        label="user name"
        name="userName"
        onChange={handleChange}
      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="password"
        name="password"
        onChange={handleChange}
      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="password confirm"
        name="passwordConfirm"
        onChange={handleChange}
      />
      <br />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => updateUser()}>
          Insertar
        </Button>
        <Button onClick={() => openCloseModalIsert()}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>
        {confirmDeleteStr} <b>{choosedUser && choosedUser.id}</b>?{" "}
      </p>
      <div align="right">
        <Button color="secondary" onClick={() => confirmDelete()}>
          Yes
        </Button>
        <Button onClick={() => openCloseModalDelete()}>No</Button>
      </div>
    </div>
  );

  return (
    <div className="update-teachers">
      <br />
      {/*<Button onClick={() => openCloseModalIsert()}>Insert new user</Button>*/}
      <br />
      <br />
      <div className="col-10 mx-auto">
        <TeachersTable
          data={data}
          teachers={teachers}
          actions={actions}
          langKeys={(edit, delete1)}
          columns={columns}
          chooseUser={chooseUser}
        ></TeachersTable>
      </div>
      <Modal open={modalInsert} onClose={openCloseModalIsert}>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEdit} onClose={openCloseModalEdit}>
        <BodyOfEdit
          choosedUser={choosedUser}
          openCloseModalEdit={openCloseModalEdit}
        />
      </Modal>

      <Modal open={modalDelete} onClose={openCloseModalDelete}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(TeachersList);
