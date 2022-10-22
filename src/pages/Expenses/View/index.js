import React, { useEffect, useState, useRef} from "react";
import MaterialTable from "material-table";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import axios from "axios";
import "./style.css";
import { ThemeProvider, createTheme ,FormControlLabel, Checkbox} from '@mui/material';
import Select from "react-select";

const ExpensesList=(props)=> {

  const tableRef = useRef();
  const[langKeywords,setLangKeywords]=useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
    
    const [totalAmount,setTotalAmount]=useState(0);
    const [category,setCategory]=useState("^");
    const [transaction,setTransaction]=useState("^");
    const [isRange,setIsRange]=useState(false);
    const [fromDate,setFromDate]=useState(dayjs());
    const [toDate,setToDate]=useState(dayjs());

    useEffect(()=>{
      tableRef.current.onQueryChange();

    },[fromDate,toDate,isRange,category,transaction]);
    // Page Lang
    const pageLanguage = props.language;

    // Language KEywords
    const {
      titlePage,
      categorys,
      search,
      description,
      noRecords,
      amount,
      date
    } = langKeywords[pageLanguage];

    //Payement Options
  var paymentOptions=[{label:"All", value:"^"},
  {label:"Cash", value:"cash"},
  {label:"Bank Transfer", value:"bank_transfer"},
  {label:"Check", value:"check"},
  {label:"Orange Money", value:"orange_money"},];
const defaultPaymentValue = {label:"All", value:"^"};

 //Category Options
 var categoryOptions=[{label:"All", value:"^"},
 {label:"Autre", value:"Autre"},
 {label:"Idrissa", value:"Idrissa"},
 {label:"Papelaria Bah", value:"Papelaria_Bah"},
 {label:"Salaire Prof", value:"Salaire_Prof"},
 {label:"Salaire Menor", value:"Salaire_Menor"},
 {label:"Courant", value:"Courant"},
 {label:"Segurança/Imposto", value:"Segurança_Imposto"},
 {label:"Internet/orange", value:"Internet_orange"},
 {label:"Produit Hygiènique", value:"Produit_Hygiènique"},
 {label:"Batiment", value:"Batiment"},];
const defaultCategoryValue = {label:"All", value:"^"};

    const columns = [
      { title: `${date}`, field: "Date" },
      { title: `${amount}`, field: "Amount" },
      { title: `${description}`, field: "Description" },
      { title: `${categorys}`, field: "Category" },
      
    ];

    const fromChange = (newValue) => {
      setFromDate(newValue);
      if(toDate.isBefore(newValue))
        setToDate(newValue);
      
    };

    const toChange = (newValue) =>{
      if(newValue.isAfter(fromDate))
        setToDate(newValue);
    }
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
    const thema=createTheme();
    return (
      <div className="main-table">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{titlePage}</h2>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="d-flex col-10 mx-auto" style={{ marginBottom: 20 }}>
          
          <DesktopDatePicker
            label="from"
            inputFormat="DD-MM-YYYY"
            minDate={dayjs('2022-09-01')}
            maxDate={new Date()}
            value={fromDate}
            onChange={fromChange}
            renderInput={(params) => <TextField {...params} />}
          />
          
          
          </div>
          <div className="d-flex col-10 mx-auto" style={{ marginBottom: 20 }}>
            <FormControlLabel 
              control={
                <Checkbox checked={isRange}
                    onChange={value=>{setIsRange(value.target.checked)}}/>
                }
              label="Range?"
              labelPlacement="end"/>
          </div>

          {isRange && <div className="d-flex col-10 mx-auto" style={{ marginBottom: 20 }}>
          <DesktopDatePicker
            label="to"
            inputFormat="DD-MM-YYYY"
            value={toDate}
            onChange={toChange}
            renderInput={(params) => <TextField {...params} />}
          />
          
          </div>}
          </LocalizationProvider>
          
          <div className="d-flex col-10 mx-auto flex-row"  style={{ marginBottom: 20 }}>
              <div className="p-2 col-5" style={{ marginRight: 70 }}>
              <label style={{ marginRight: 20 }}>Category</label>
              <Select
                fullWidth
                style={{ fontSize: 0}}
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
                onChange={e=>setCategory(e.value)}
              />
              </div>
              <div className="p-2 col-5" >
              <label style={{ marginRight: 20 }}>Transaction</label>
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
                onChange={e=>setTransaction(e.value)}
              />
              </div>
              </div>
          {/* start table */}

         <div className="students-all col-10 mx-auto">
            <ThemeProvider theme={thema}>
          <MaterialTable
            tableRef={tableRef}
            title={"Total: "+totalAmount}
            columns={columns}
            options={{
              pageSize: 50,
              pageSizeOptions:[50, 100, 200],
              debounceInterval: 700,
              padding: "dense",
              search:false
            }} 
            localization={{
                    body: {
                      emptyDataSourceMessage: `${noRecords}`,
                    },
            }}
            data={(query) =>
              new Promise((resolve, reject) => {
                // prepare your data and then call resolve like this:
               
              
                //pagination

                const pageNum = query.page + 1;
                const limit=query.pageSize;
                const from =fromDate.format("YYYY-MM-DD");
                const to=isRange? toDate.format("YYYY-MM-DD"): "null";
                const url=process.env.REACT_APP_API_URL+`Expenses/${from}/${to}/${ transaction }/${category}/${limit}?page=${pageNum}`;
                console.log("URL:",url);
                fetch(url)
                  .then((resp) => resp.json())
                  .then((resp) => {
                    setTotalAmount(resp.total)
                    resolve({
                      data: resp.data.data, // your data array
                      page: query.page, // current page number
                      totalCount: resp.data.total// total row number
                    });
                  });
              })
            }
          />
          </ThemeProvider>
          </div>
          {/* end table */}
        </div>
      </div>
    );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(ExpensesList);
