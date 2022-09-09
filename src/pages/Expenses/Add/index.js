import React, { useState, useEffect } from "react";
import { 
  Grid, 
  Paper, 
  Button, 
  Typography, 
  TextField 
} from "@mui/material";
import { withStyles } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./common/LangKeys";

import swal from "sweetalert";
import axios from "axios";
import { connect } from "react-redux";
import { LocalizationProvider, DateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const RegistrationForm = (props) => {
  const [value1, setValue1] = React.useState(new Date());
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [loading, setLoading] = useState(false);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });

  // Language KEywords
  const {
    amount,
    add,
    description,
    transactionType,
    time,
    success,
    error,
    addAnExpense,
    fillMessage,
    required,
  } = langKeywords[pageLanguage];
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);

  const paperStyle = { padding: "40px 20px", width: 400, margin: "30px auto" };

  const btnStyle = {
    marginTop: 50,
    backgroundColor: "#ee664e",
    textTransform: "lowercase",
  };

  // initial values
  const initialValues = {
    amount: "",
    description: "",
    transactionType: "",
    dateTime: new Date(),
  };

  // validation schema
  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("you must specify a number")
      .min(0, "larger than zero")
      .required(required),
    description: Yup.string().required(required),
    transactionType: Yup.string().required(required),
    //dateTime: Yup.string().required(required),
    dateTime: Yup.date()
      .default(function () {
        return new Date();
      })
      .typeError("you must specify a date")
      .required(required),
  });

  // on submit
  const onSubmit = (values, props) => {
    var date = new Date(values.dateTime),
      minutes = ("0" + date.getMinutes()).substr(-2),
      hours = ("0" + date.getHours()).substr(-2),
      seconds = ("0" + date.getSeconds()).substr(-2),
      year = date.getFullYear(),
      month = ("0" + (date.getMonth() + 1)).substr(-2),
      day = ("0" + date.getDate()).substr(-2),
      //date
      date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    setLoading(true);
    //alert(JSON.stringify(values), null, 2);
    const data = {
      Amount: values.amount,
      Description: values.description,
      transaction_type: values.transactionType,
      Date: date,
    };

    // send post
    axios
      .post("/Expenses", data)
      .then((resp) => {
        if (resp.status === 200)
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
      .catch((err) => {
        setLoading(false);
        swal(error, {
          icon: "error",
        }).then((succ) => {});
      });
  };

  return (
    <>
    <Grid>
   <Paper elevation={5} style={paperStyle}>
       <Grid align="center">
         <Typography variant="h6">{addAnExpense}</Typography>
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
                 name="amount"
                 label={amount}
                 fullWidth
                 error={props.errors.amount && props.touched.amount}
                 helperText={<ErrorMessage name="amount" />}
                 required
                 autoComplete="off"
               />
             </div>
             <div style={{ marginBottom: 20 }}>
               <Field
                 as={TextField}
                 name="description"
                 label={description}
                 fullWidth
                 error={props.errors.description && props.touched.description}
                 helperText={<ErrorMessage name="description" />}
                 required
                 autoComplete="off"
               />
             </div>
             <div style={{ marginBottom: 20 }}>
               <Field
                 as={TextField}
                 name="transactionType"
                 label={transactionType}
                 fullWidth
                 error={
                   props.errors.transactionType &&
                   props.touched.transactionType
                 }
                 helperText={<ErrorMessage name="transactionType" />}
                 required
                 autoComplete="off"
               />
             </div>

             <div style={{ marginBottom: 20 }}></div>
             <LocalizationProvider dateAdapter={AdapterDateFns}>
               <DateTimePicker
                 name="dateTime"
                 renderInput={(props) => <TextField {...props} />}
                 label={time}
                 value={props.values.dateTime}
                 onChange={(value) => props.setFieldValue("dateTime", value)}
                 inputFormat="dd/MM/yyyy hh:mm:ss"
                 ampm={false}
               />
             </LocalizationProvider>
               
             <span className="error">
               <ErrorMessage name="dateTime" />
             </span>   
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
   </>
    
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(RegistrationForm);
