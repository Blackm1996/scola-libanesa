import React, { useState, useRef, useEffect } from "react";
import MaterialTable from "material-table";
import GradeDDL from "../../../components/GradeDDL";
import SelectYear from "../../../components/SelectYear";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import './style.css';
import { ThemeProvider, createTheme } from '@mui/material';
import axios from "axios";


const AllStudents = (props) => {

  const tableRef = useRef();
  const[pageLang,setPageLang]=useState(props.language);
  const[langKeywords,setLangKeywords]=useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const[year,setYear]=useState(props.match.schoolYear);
  const[gradeId,setGradeId]=useState(0);
  const[sectionId,setSectionId]=useState(0);
 
  useEffect(()=>{
    axios
        .get("/schoolYear")
        .then(response=>{
          setYear(response.data["school_year"]);
          tableRef.current.onQueryChange();
        })
  },[])
  //update year 
  const updateYear = ( year ) => {
    setYear(year);
    tableRef.current.onQueryChange();
  }

  //update grade id
  const updateGradeId = (id) => {
    setGradeId(id);
    setSectionId(0);
    tableRef.current.onQueryChange();
  };

  //update section id
  const updateSectionId = (id) => {
    setSectionId(id);
    tableRef.current.onQueryChange();
  };

  // on Row click
  const onRowClick = (event, rowData) => {
    window.open("/admin/profile/" + rowData.id,'_blank');
    //props.history.push("/admin/profile/" + rowData.id);
  };

  const themea=createTheme();

    // Page Lang

    // Language KEywords
    const { titlePage, studentId, firstName, lastName, search, noRecords } = langKeywords[pageLang];

    const columns = [
      { title: studentId, field: "id" },
      { title: firstName, field: "First_Name" },
      { title: lastName, field: "Last_Name" },
    ];
    return (
      <div className="main-table">
        <div className="container-fluid">
        
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{ titlePage }</h2>
          </div>
        
          
          <div className="d-flex flex-row">
            {/* Start years selection */}
            <SelectYear className="p-2"
              updateYear={ updateYear }
            />
            {/* End years selection */}
            {/* Start grade DDL */}
            <GradeDDL className="p-2"
              updateGradeId={updateGradeId}
              updateSectionId={updateSectionId}
            />
            {/* End grade DDL */}
          </div>
          {/* start table */}
          
        <div className="students-all col-12 mx-auto">
          <ThemeProvider theme={themea}>
          <MaterialTable
            tableRef={tableRef}
            title=""
            columns={columns}
            options={{
              pageSize: 50,
              pageSizeOptions:[50, 100, 200],
              debounceInterval: 700,
              padding: "dense"
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
                var orderDirection = "desc";
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

                const pageNum = query.page + 1;
                const limit=query.pageSize;
                const url=process.env.REACT_APP_API_URL+`student/${limit}/${search}/${orderBy}/${orderDirection}/${ year }/${gradeId}/${sectionId}?page=${pageNum}`;
                fetch(url)
                  .then((resp) => resp.json())
                  .then((resp) => {
                                            
                    resolve({
                      data: resp.data, // your data array
                      page: query.page, // current page number
                      totalCount: resp.total// total row number
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
export default connect(mapStateToProps)(AllStudents);

