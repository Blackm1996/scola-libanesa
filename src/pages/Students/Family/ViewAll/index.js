import { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme, Checkbox } from '@mui/material';
import "./shared/styles/style.css";
const ViewAllFamilies = (props)=>
{
    const selectTableRef= useRef();


    const onRowClick = (event, rowData) => {
      window.open("/admin/students/viewFamily/" + rowData.id,'_blank');
    };
    const themea=createTheme();
    return(
        <div className="main-table">
            <div className="container-fluid">
            <div className="col-12 text-center">
            <h2 className="title-of-middle">All Families</h2>
          </div>
            <div className="students-all col-12 mx-auto">
          <ThemeProvider theme={themea}>
          <MaterialTable
            tableRef={selectTableRef}
            title=""
            columns={[
                { title: "ID", field: "id" },
                { title: "Phone", field: "Comm_Phone" },
                { title: "Father", field: "Father_Name" },
                { title: "Mother", field: "Mother_Name" },
                { title: "Number of Students", field: "Members" },
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
                        process.env.REACT_APP_API_URL+`families/${limit}/${search}/${orderBy}/${orderDirection}?page=${pageNum}`
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
    );

}

const mapStateToProps = (state) => {
    return {
      language: state.language,
    };
  };
  
  export default connect(mapStateToProps)(ViewAllFamilies);