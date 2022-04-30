import React, { useState, Component } from "react";
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

class AllStudents extends Component {
  tableRef = React.createRef();
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    year: "2021-2022",
    gradeId: "0",
    sectionId: "0",
   
  };
 
  //update year 
  updateYear = ( year ) => {
    this.setState({
      year
    });
    this.tableRef.current.onQueryChange();
  }

  //update grade id
  updateGradeId = (id) => {
    this.setState({
      gradeId: id,
      sectionId: 0
    });
    this.tableRef.current.onQueryChange();
  };

  //update section id
  updateSectionId = (id) => {
    this.setState({
      sectionId: id
    });
    this.tableRef.current.onQueryChange();
  };

  // on Row click
  onRowClick = (event, rowData) => {
    this.props.history.push("/admin/profile/" + rowData.id);
  };

  //onChangeRowsPerPage
  onChangeRowsPerPage  = ( value ) => {
    this.setState({
      limit: value
    })
  }
  //add Pages
  pagesNumber = (total , limit) => {
    let totalStudents = total / limit ;
    let numberOfPages;
    if ( !(totalStudents % 1 == 0) )  // number of pages contains decimal that means we should add 1
      return numberOfPages = parseInt( totalStudents + 1);
    else 
      return numberOfPages = parseInt( totalStudents );  
  }
  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { titlePage, studentId, firstName, lastName, search, noRecords } =
      this.state.langKeywords[pageLanguage];

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
        
          
          <div className="d-flex col-12 mx-auto">
            {/* Start years selection */}
            <SelectYear
              updateYear={ this.updateYear }
            />
            {/* End years selection */}
            {/* Start grade DDL */}
            <GradeDDL
              updateGradeId={this.updateGradeId}
              updateSectionId={this.updateSectionId}
            />
            {/* End grade DDL */}
          </div>
          {/* start table */}
          
        <div className="students-all col-12 mx-auto">
          <MaterialTable
            tableRef={this.tableRef}
            title=""
            columns={columns}
            options={{
              pageSize: 5,
              pageSizeOptions:[5, 10, 20, 30, 50],
              debounceInterval: 700,
              padding: "dense"
            }} 
            onRowClick={this.onRowClick} 
            localization={{
                    toolbar: { searchPlaceholder: `${search}` },
                    body: {
                      emptyDataSourceMessage: `${noRecords}`,
                    },
            }}
            data={(query) =>
              new Promise((resolve, reject) => {
                // prepare your data and then call resolve like this:
                var gradeId = this.state.gradeId;
                var sectionId = this.state.sectionId;
                var search = "^";
                var orderBy = "id";
                var orderDirection = "desc";
                let url = "http://localhost:3000/olympic?";
                //searching
                if (query.search) {
                  url += `q=${query.search}`;
                  search = query.search.trim();
                }
                //sorting
                if (query.orderBy) {
                  url += `&_sort=${query.orderBy.field}&_order=${query.orderDirection}`;
                  orderBy = query.orderBy.field;
                  orderDirection = query.orderDirection;
                }
                //filtering
                if (query.filters.length) {
                  const filter = query.filters.map((filter) => {
                    return `&${filter.column.field}${filter.operator}${filter.value}`;
                  });
                  url += filter.join("");
                }
                //pagination
                url += `&_page=${query.page + 1}`;
                url += `&_limit=${query.pageSize}`;
                const pageNum = query.page + 1;
                const limit = query.pageSize;

                fetch(
                  `https://management.escola-libanesa.com/test2/api/student/${limit}/${search}/${orderBy}/${orderDirection}/${ this.state.year }/${gradeId}/${sectionId}?page=${pageNum}`
                )
                  .then((resp) => resp.json())
                  .then((resp) => {
                    const numberOfPages = this.pagesNumber( resp.total, query.pageSize );
                        
                    resolve({
                      data: resp.data, // your data array
                      page: query.page, // current page number
                      totalCount: resp.total// total row number
                    });
                  });
              })
            }
          />
        </div>
        {/* end table */}
        </div>
        
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(AllStudents);

