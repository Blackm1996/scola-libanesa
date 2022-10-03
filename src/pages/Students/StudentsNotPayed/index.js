import React, { useState, useEffect, useRef } from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SelectMonth from "../../../components/SelectMonth";
import SelectYear from "../../../components/SelectYear";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import "./style.css";
import axios from "axios";
import  Select  from "react-select";

const NotPayedStudents =(props)=> {
  const tableRef = useRef();

  const[langKeywords,setLangKeywords]=useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const[year,setYear]=useState();
  const[month,setMonth]=useState(9);
  const[type,setType]=useState("Monthly");
  const[tot,setTot]=useState(0);
  const[totst,setTotst]=useState(0);

  useEffect(()=>{
    axios
    .get("/schoolYear")
    .then((response)=>{
      setYear(response.data['school_year']);
    })
  },[])

  useEffect(()=>{
    tableRef.current.onQueryChange();
  },[year,month,type])

  //update year
  const updateYear = (year) => {
    setYear(year);
  };

  const updateTot = (totv) => {
    setTot(totv);
  };

  const updateTotst = (totstv) => {
    setTotst(totstv);
  };

  //update grade id
  const updateMonth = (month) => {
    setMonth(month);
  };

  const updateType = (type)=>{
    //console.log("Type selected",type)
    setType(type.value);
    if(type.value !== "Monthly")
      setMonth(0);
    else
      setMonth(9);
  };

  // on Row click
  const onRowClick = (event, rowData) => {
    props.history.push("/admin/profile/" + rowData.id);
  };

  //custom stlyes
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
  };
    // Page Lang
    const pageLanguage = props.language;

    // Language KEywords
    const {
      titlePage,
      studentId,
      firstName,
      lastName,
      search,
      noRecords,
      section,
      rest,
      grade,
      totalPay,
      totalstnb,
    } =langKeywords[pageLanguage];

    const columns = [
      { title: studentId, field: "id" },
      { title: firstName, field: "First_Name" },
      { title: lastName, field: "Last_Name" },
      { title: grade, field: "gradeName" },
      { title: section, field: "className" },
      { title: rest, field: "rest" },
    ];
    const billOptions = [{label: "Monthly", value: "Monthly"},
                            {label: "Inscription Tax", value: "Inscription"},
                            {label: "Books and Uniforms", value: "BooksUniforms"}];
    const thema=createTheme();

    
      
    return (
      <div className="main-table">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{titlePage}</h2>
          </div>

          <div className="d-flex col-12 mx-auto">
            {/* Start years selection */}
            <SelectYear updateYear={updateYear} />
            {/* End years selection */}
            <div style={{marginLeft : 20 , marginRight:20}}>
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select type"
                  defaultValue={{label: type, value: type}}
                  value={{label: type, value: type}}
                  options={billOptions}
                  styles={customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "hotpink",
                      primary: "#ff634766",
                    },
                  })}
                  onChange={updateType}
                />
              </div>
            {/* Start month Selection */}
            {type ==="Monthly" && <SelectMonth updateMonth={updateMonth} />}
            {/* End Month Selection */}
          </div>
          {/* start table */}
          <br/>
          <div className="d-flex col-12 mx-auto"><b>{totalPay}: {tot}</b></div><br/>
          <div className="d-flex col-12 mx-auto"><b>{totalstnb}: {totst}</b></div><br/>
          <div className="students-all col-12 mx-auto">
            <ThemeProvider theme={thema}>
            <MaterialTable
              tableRef={tableRef}
              title=""
              columns={columns}
              options={{
                debounceInterval: 700,
                padding: "dense",
                paging: false,
              }}
              onRowClick={onRowClick}
              localization={{
                toolbar: { searchPlaceholder: `${search}` },
                body: {
                  emptyDataSourceMessage: `${noRecords}`,
                },
              }}
              data={(query) =>
                new Promise((resolve, reject) => {
                  // prepare your data and then call resolve like this:
                  var search = "^";
                  var orderBy = "id";
                  var orderDirection = "asc";

                  //searching
                  if (query.search) {
                    search = query.search.trim();
                  }
                  //sorting
                  if (query.orderBy) {
                    orderBy = query.orderBy.field;
                    orderDirection = query.orderDirection;
                  }
                  //filtering
                  if (query.filters.length) {
                    const filter = query.filters.map((filter) => {
                      return `&${filter.column.field}${filter.operator}${filter.value}`;
                    });
                  }
                  //pagination
                  /*const pageNum = query.page + 1;
                  const limit = query.pageSize;*/
                  const stri=process.env.REACT_APP_API_URL+`notPayedstudent/${month}/${type}/${year}/${search}/${orderBy}/${orderDirection}`;
                  //console.log(stri);
                  fetch(
                    stri
                  )
                    .then((resp) => resp.json())
                    .then((resp) => {
                      /*const numberOfPages = this.pagesNumber(
                        resp.total,
                        query.pageSize
                      );*/
                      //console.log(resp);
                      
                      updateTot(resp[resp.length-1].tot)
                      resp.splice(resp.length-1,1);
                      updateTotst(resp.length)
                      resolve({
                        data: resp, // your data array
                        //age: query.page, // current page number
                        totalCount: resp.length, // total row number
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
export default connect(mapStateToProps)(NotPayedStudents);