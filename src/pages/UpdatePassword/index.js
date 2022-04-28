import React, { useState, useEffect } from "react";
import { Grid, Paper, Button, Typography } from "@material-ui/core";
import { TextField, withStyles } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import swal from "sweetalert";
import { addTeacher } from "../../Api/Teachers";
import { connect } from "react-redux";

const UpdatePassword = (props) => {

  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [loading, setLoading] = useState(false);

  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });

  // lang keys
  // Language KEywords
  const {
    password,
    passwordConfirm,
    add,
    registerHere,
    fillMessage,
    required,
    passwordWarning1,
    passwordWarning2,
    passwordMustMatch,
    success,
    error,
  } = langKeywords[pageLanguage];
  
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  const passwordRegExp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const paperStyle = { padding: "40px 20px", width: 400, margin: "30px auto" };

  const btnStyle = {
    marginTop: 50,
    backgroundColor: "#ee664e",
    textTransform: "lowercase",
  };
  const initialValues = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  };

  //schema validation
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(required),
    password: Yup.string()
      .min(8, passwordWarning1)
      .matches(passwordRegExp, passwordWarning2)
      .required(required),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], passwordMustMatch)
      .required(required),
  });

  const onSubmit = (values, props) => {
    setLoading(true);
    //alert(JSON.stringify(values), null, 2);
    const {
      firstName: First_Name,
      lastName: Last_Name,
      userName: User_Name,
      password: Password,
      email: Email,
      phoneNumber: Tel,
      time,
    } = values;
    addTeacher({
      First_Name,
      Last_Name,
      User_Name,
      Password,
      Email,
      Tel,
      time,
    })
      .then((response) => {
        if (response.status === 204)
          swal({
            position: "center-center",
            icon: "success",
            title: success,
            showConfirmButton: false,
            timer: 2000,
          }).then((response) => {
            setLoading(false);
            props.resetForm();
          });
      })
      .catch((error1) => {
        setLoading(false);
        swal(error, {
          icon: "error",
        }).then((success) => {
          //props.resetForm();
        });
      });
  };
  return (
    <Grid>
      <Paper elevation={5} style={paperStyle}>
        <Grid align="center">
          <Typography variant="h6">Change Password</Typography>
          <Typography variant="caption">Fill The form to change password</Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form>
              {/* start old password section */}
              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="oldPassword"
                  label={password}
                  type="password"
                  fullWidth
                  error={props.errors.oldPassword && props.touched.oldPassword}
                  helperText={<ErrorMessage name="oldPassword" />}
                  required
                  autoComplete="off"
                />
              </div>
              {/* end old password section */}

              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="password"
                  label="new password"
                  type="password"
                  fullWidth
                  error={props.errors.password && props.touched.password}
                  helperText={<ErrorMessage name="password" />}
                  required
                  autoComplete="off"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="confirmPassword"
                  label="confirm new password"
                  type="password"
                  fullWidth
                  error={
                    props.errors.confirmPassword &&
                    props.touched.confirmPassword
                  }
                  helperText={<ErrorMessage name="confirmPassword" />}
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                style={btnStyle}
                variant="contained"
                color="primary"
              >
                {loading === false ? add : "...wait"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(UpdatePassword);
