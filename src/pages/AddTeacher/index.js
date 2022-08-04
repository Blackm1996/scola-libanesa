import React, { useState, useEffect } from "react";
import { Grid, Paper, Button, Typography } from "@mui/material";
import { TextField, withStyles } from "@mui/material";
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

const AddExpense = (props) => {
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
    name,
    prename,
    password,
    userName,
    passwordConfirm,
    phoneNumber,
    add,
    registerHere,
    fillMessage,
    required,
    passwordWarning1,
    passwordWarning2,
    selectTime,
    partTime,
    fullTime,
    passwordMustMatch,
    validNumber,
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
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    time: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(1, "It's too short").required(required),
    lastName: Yup.string().min(1, "It's too short").required(required),
    userName: Yup.string().min(3, "It's too short").required(required),
    email: Yup.string().email("Enter valid email"),
    password: Yup.string()
      .min(8, passwordWarning1)
      .matches(passwordRegExp, passwordWarning2)
      .required(required),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], passwordMustMatch)
      .required(required),
    phoneNumber: Yup.number().typeError(validNumber),
    time: Yup.string().required(required),
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
          <Typography variant="h6">{registerHere}</Typography>
          <Typography variant="caption">{fillMessage}</Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form>
              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="firstName"
                  label={prename}
                  fullWidth
                  error={props.errors.firstName && props.touched.firstName}
                  helperText={<ErrorMessage name="firstName" />}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="lastName"
                  label={name}
                  fullWidth
                  error={props.errors.lastName && props.touched.lastName}
                  helperText={<ErrorMessage name="lastName" />}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="userName"
                  label={userName}
                  fullWidth
                  error={props.errors.userName && props.touched.userName}
                  helperText={<ErrorMessage name="userName" />}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="password"
                  label={password}
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
                  label={passwordConfirm}
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
              <div style={{ marginBottom: 20 }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  error={props.errors.email && props.touched.email}
                  helperText={<ErrorMessage name="email" />}
                  autoComplete="off"
                />
              </div>
              <div style={{ marginBottom: 30 }}>
                <Field
                  as={TextField}
                  name="phoneNumber"
                  label={phoneNumber}
                  fullWidth
                  error={props.errors.phoneNumber && props.touched.phoneNumber}
                  helperText={<ErrorMessage name="phoneNumber" />}
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                  {/* <InputLabel id="demo-simple-select-standard-label">
                  Full time / Part time
                </InputLabel>*/}

                  <Field
                    as={Select}
                    name="time"
                    label="Time"
                    fullWidth
                    error={props.errors.time && props.touched.time}
                    helperText={<ErrorMessage name="time" />}
                    required
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      {selectTime}
                    </MenuItem>
                    <br />
                    <MenuItem value="Full_Time">{fullTime}</MenuItem>
                    <br />
                    <MenuItem value="Part_Time">{partTime}</MenuItem>
                  </Field>
                </FormControl>
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

export default connect(mapStateToProps)(AddExpense);
