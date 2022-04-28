import React, { useState } from "react";
import { Button, TextField, Box } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert";
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "../LangKeys";
import { connect } from "react-redux";

// maketyles for mui
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

// password reg expression
const passwordRegExp =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

// BodyOfEdit Component
const BodyOfEdit = (props) => {
  const styles = useStyles();
  //destruction props
  const { choosedUser, openCloseModalEdit } = props;

  //states
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const [loading, setLoading] = useState(false);

  // Language KEywords
  const {
    editUser,
    userName,
    password,
    passwordConfirm,
    edit,
    required,
    passwordWarning1,
    passwordWarning2,
    passwordMustMatch,
    success,
    error,
  } = langKeywords[pageLanguage];

  //validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, passwordWarning1)
      .matches(passwordRegExp, passwordWarning2)
      .required(required),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password")], passwordMustMatch)
      .required(required),
  });
  // onSubmit
  const onSubmit = ({ password }) => {
    setLoading(true);
    axios
      .put(`/updateUser/${choosedUser.id}`, {
        newPassword: password,
      })
      .then((resp) => {
        if (resp.status === 200)
          swal(success, {
            icon: "success",
          }).then((succ) => openCloseModalEdit());
        else
          swal(error, {
            icon: "error",
          }).then((succ) => openCloseModalEdit());
      });
  };
  return (
    <Formik
      initialValues={{ password: "", passwordConfirm: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <div className={styles.modal}>
            <h3>{editUser}</h3>
            <Box sx={{ paddingBottom: "7px" }}>
              <TextField
                className={styles.inputMaterial}
                label="id"
                name="id"
                value={choosedUser && choosedUser.id}
                disabled
              />
            </Box>
            <Box sx={{ paddingBottom: "7px" }}>
              <TextField
                className={styles.inputMaterial}
                label={`${userName}`}
                name="userName"
                value={choosedUser && choosedUser.userName}
                disabled
              />
            </Box>
            <Box sx={{ paddingBottom: "7px" }}>
              <Field
                as={TextField}
                name="password"
                label={`${password}`}
                fullWidth
                error={props.errors.password && props.touched.password}
                helperText={<ErrorMessage name="password" />}
                required
                autoComplete="off"
              />
            </Box>
            <Field
              as={TextField}
              name="passwordConfirm"
              label={`${passwordConfirm}`}
              fullWidth
              error={
                props.errors.passwordConfirm && props.touched.passwordConfirm
              }
              helperText={<ErrorMessage name="passwordConfirm" />}
              required
              autoComplete="off"
            />
            <div align="right">
              <Button
                color="primary"
                type="submit"
                style={{ position: "relative", top: "-21px" }}
              >
                {loading ? "..loading" : edit}
              </Button>
              <Button onClick={() => openCloseModalEdit()}>Cancel</Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(BodyOfEdit);
