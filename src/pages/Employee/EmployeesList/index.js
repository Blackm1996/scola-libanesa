import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useEffect, useState,useRef } from "react";
import Select from 'react-select';
import MaterialTable from "material-table";
import { ThemeProvider, createTheme, Checkbox } from '@mui/material';
import "./shared/styles/style.css";

const Wrapper = styled.div`
  min-height: calc(100vh - 60px);
  padding-bottom: 150px;
`;

const EmplyeesList = (props) => {
    const selectTableRef= useRef();

    const [type,setType] = useState('^');
    const [position,setPosition] = useState('^');

    useEffect(()=>{
        selectTableRef.current.onQueryChange();
  
      },[type,position]);

    const onRowClick = (event, rowData) => {
      //window.open("/admin/students/viewFamily/" + rowData.id,'_blank');
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

      var TypeOptions=[{label:"All", value:"^"},
      {label:"Full Time", value:"full_time"},
      {label:"Hourly", value:"hourly"},];
     const defaultTypeValue = {label:"All", value:"^"};

     var PositionOptions=[{label:"All", value:"^"},
      {label:"Professeur", value:"prof"},
      {label:"Menor", value:"menor"},
      {label:"Stagiere", value:"stagiere"},
      {label:"Superviseur", value:"superviseur"},];
     const defaultPositionValue = {label:"All", value:"^"};
     
     
    const themea=createTheme();
    return(
        <Wrapper>
            <div className="main-table">
            <div className="container-fluid">
            <div className="col-12 text-center">
            <h2 className="title-of-middle">Emplyees List</h2>
          </div>
          <div className="d-flex col-10 mx-auto flex-row"  style={{ marginBottom: 20 }}>
              <div className="p-2 col-5" style={{ marginRight: 70 }}>
              <label style={{ marginRight: 20 }}>Type</label>
              <Select
                fullWidth
                style={{ fontSize: 0}}
                placeholder="Select category"
                options={TypeOptions}
                styles={customStyles}
                defaultValue={defaultTypeValue}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "hotpink",
                    primary: "#ff634766",
                  },})}
                onChange={e=>setType(e.value)}
              />
              </div>
              <div className="p-2 col-5" >
              <label style={{ marginRight: 20 }}>Position</label>
              <Select
                fullWidth
                style={{ fontSize: 0 }}
                placeholder="Select payement type"
                options={PositionOptions}
                styles={customStyles}
                defaultValue={defaultPositionValue}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "hotpink",
                    primary: "#ff634766",
                  },})}
                onChange={e=>setPosition(e.value)}
              />
              </div>
              </div>
            <div className="students-all col-12 mx-auto">
          <ThemeProvider theme={themea}>
          <MaterialTable
            tableRef={selectTableRef}
            title=""
            columns={[
                { title: "ID", field: "id" },
                { title: "Name", field: "name" },
                { title: "Tel", field: "Tel" },
                { title: "Position", field: "position" },
                { title: "Type", field: "Type" },
            ]}
            options={{
              pageSize: 50,
              pageSizeOptions:[50, 100, 200],
              debounceInterval: 700,
              padding: "dense"
            }} 
            onRowClick={onRowClick} 
            localization={{
                    toolbar: { searchPlaceholder: `Search` },
                    body: {
                      emptyDataSourceMessage: `No records to display`,
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
               
                //pagination
                const pageNum = query.page + 1;
                const limit = query.pageSize;

                fetch(
                        process.env.REACT_APP_API_URL+`allEmployees/${limit}/${search}/${type}/${position}/${orderBy}/${orderDirection}?page=${pageNum}`
                )
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
            </div>
        </div>
        </Wrapper>
    );
}

const mapStateToProps = (state) => {
    return {
      language: state.language,
      role: state.role,
    };
  };
  export default connect(mapStateToProps)(EmplyeesList);