import React, { useState, useEffect } from "react";
import { 
  Grid, 
  Paper, 
  Button, 
  Typography, 
  TextField 
} from "@mui/material";
import Select from "react-select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./common/LangKeys";

import swal from "sweetalert";
import axios from "axios";
import { connect } from "react-redux";


const RegistrationForm = (props) => {
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [loading, setLoading] = useState(false);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const [paymentType,setPaymentType]=useState("cash");
  const [categoryType,setCategoryType]=useState("Autre");

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

  useEffect(()=>{console.log(props)},[])

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
    //transactionType: {label:"Cash", value:"cash"},
    dateTime: new Date(),
  };

  // validation schema
  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("you must specify a number")
      .min(0, "larger than zero")
      .required(required),
    
    //transactionType: Yup.string().required(required),
    //dateTime: Yup.string().required(required),
    /*dateTime: Yup.date()
      .default(function () {
        return new Date();
      })
      .typeError("you must specify a date")
      .required(required),*/
  });

  // on submit
  const onSubmit = (values, props) => {
    var dates = new Date(values.dateTime),
      minutes = ("0" + dates.getMinutes()).slice(-2),
      hours = ("0" + dates.getHours()).slice(-2),
      seconds = ("0" + dates.getSeconds()).slice(-2),
      year = dates.getFullYear(),
      month = ("0" + (dates.getMonth() + 1)).slice(-2),
      day = ("0" + dates.getDate()).slice(-2),
      //date
      date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      console.log('"'+minutes+'"');
    setLoading(true);
    //alert(JSON.stringify(values), null, 2);
    const data = {
      Amount: values.amount,
      Description: values.description,
      Transaction_type: paymentType,
      Category: categoryType,
    };

    console.log("HAHA",data);
    // send post
    axios
      .post("/Expenses", data)
      .then((resp) => {
        if (resp.status === 201)
          {setLoading(false);
          props.resetForm();}
          
      })
      .catch((err) => {
        setLoading(false);
        swal(error, {
          icon: "error",
        }).then((succ) => {});
      });
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isDisabled ? "red" : "tomato",
      fontSize: 13,
      color: state.isFocused ? "#fff" : "#958282",
      backgroundColor: state.isFocused ? "tomato" : "transparent",
      cursor: "pointer",
    }),
    singleValue: (provided, state) => {
      const color = state.isDisabled ? "#958282" : "#958282";
      const transition = "opacity 300ms";

      return { ...provided, color, transition };
    },
    control: (base) => ({
      ...base,
      fontSize: 13,
      marginBottom: 7,
    }),
    menu: base => ({
      ...base,
      zIndex: 100
    })
  };


  //Payement Options
  var paymentOptions=[{label:"Cash", value:"cash"},
  {label:"Bank Transfer", value:"bank_transfer"},
  {label:"Check", value:"check"},
  {label:"Orange Money", value:"orange_money"},];
const defaultPaymentValue = {label:"Cash", value:"cash"};

 //Category Options
 var categoryOptions=[{label:"Autre", value:"Autre"},
 {label:"Idrissa", value:"Idrissa"},
 {label:"Papelaria Bah", value:"Papelaria_Bah"},
 {label:"Salaire Prof", value:"Salaire_Prof"},
 {label:"Courant", value:"Courant"},
 {label:"Segurança/Imposto", value:"Segurança_Imposto"},
 {label:"Internet/orange", value:"Internet_orange"},
 {label:"Produit Hygiènique", value:"Produit_Hygiènique"},
 {label:"Batiment", value:"Batiment"},];
const defaultCategoryValue = {label:"Autre", value:"Autre"};

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
                 type="number"
                 name="amount"
                 label={amount}
                 fullWidth
                 error={props.errors.amount && props.touched.amount}
                 helperText={<ErrorMessage name="amount" />}
                 required
                 autoComplete="off"
               />
             </div>
             <div className="select-container w-100 "  style={{ marginBottom: 20 }}>
              <label>Category</label>
              <Select
                fullWidth
                style={{ fontSize: 0 }}
                placeholder="Select category"
                options={categoryOptions}
                styles={customStyles}
                defaultValue={defaultCategoryValue}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "hotpink",
                    primary: "#ff634766",
                  },})}
                onChange={e=>setCategoryType(e.value)}
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
                 autoComplete="off"
               />
             </div>
             
             {/*<LocalizationProvider dateAdapter={AdapterDateFns}>
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
             <div style={{ marginBottom: 20 }}></div>*/}
             <div className="select-container w-100 "  style={{ marginBottom: 20 }}>
              <label>{transactionType}</label>
              <Select
                fullWidth
                style={{ fontSize: 0 }}
                placeholder="Select payement type"
                options={paymentOptions}
                styles={customStyles}
                defaultValue={defaultPaymentValue}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "hotpink",
                    primary: "#ff634766",
                  },})}
                onChange={e=>setPaymentType(e.value)}
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
   </>
    
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(RegistrationForm);
