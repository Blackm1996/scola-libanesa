import React, { useState, Component } from "react";
import MaterialTable from "material-table";
import SelectMonth from "../../../components/SelectMonth";
import SelectYear from "../../../components/SelectYear";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import "./style.css";

class NotPayedStudents extends Component {
  tableRef = React.createRef();
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    year: "2021-2022",
    month: "9",
    tot: "0",
    totst: "0",
  };

  //update year
  updateYear = (year) => {
    this.setState({
      year,
    });
    this.tableRef.current.onQueryChange();
  };

  updateTot = (totv) => {
    this.setState({tot : totv,});
  };

  updateTotst = (totstv) => {
    this.setState({totst : totstv,});
  };

  //update grade id
  updateMonth = (month) => {
    this.setState({
      month,
    });
    this.tableRef.current.onQueryChange();
  };

  // on Row click
  onRowClick = (event, rowData) => {
    this.props.history.push("/admin/profile/" + rowData.id);
  };

  //onChangeRowsPerPage
  /*onChangeRowsPerPage = (value) => {
    this.setState({
      limit: value,
    });
  };*/
  //add Pages
  /*pagesNumber = (total, limit) => {
    let totalStudents = total / limit;
    let numberOfPages;
    if (!(totalStudents % 1 == 0))
      // number of pages contains decimal that means we should add 1
      return (numberOfPages = parseInt(totalStudents + 1));
    else return (numberOfPages = parseInt(totalStudents));
  };*/
  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

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
      phoneNumber,
      totalPay,
      totalstnb,
    } = this.state.langKeywords[pageLanguage];

    const columns = [
      { title: studentId, field: "id" },
      { title: firstName, field: "First_Name" },
      { title: lastName, field: "Last_Name" },
      { title: grade, field: "gradeName" },
      { title: section, field: "className" },
      { title: rest, field: "rest" },
      { title: phoneNumber, field: "Tel" },
    ];
    return (
      <div className="main-table">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{titlePage}</h2>
          </div>

          <div className="d-flex col-12 mx-auto">
            {/* Start years selection */}
            <SelectYear updateYear={this.updateYear} />
            {/* End years selection */}
            {/* Start month Selection */}
            <SelectMonth updateMonth={this.updateMonth} />
            {/* End Month Selection */}
          </div>
          {/* start table */}
          <br/>
          <div className="d-flex col-12 mx-auto"><b>{totalPay}: {this.state.tot}</b></div><br/>
          <div className="d-flex col-12 mx-auto"><b>{totalstnb}: {this.state.totst}</b></div><br/>
          <div className="students-all col-12 mx-auto">
            <MaterialTable
              tableRef={this.tableRef}
              title=""
              columns={columns}
              options={{
                debounceInterval: 700,
                padding: "dense",
                paging: false,
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

                  fetch(
                    `https://management.escola-libanesa.com/test2/api/notPayedstudent/${this.state.month}/${this.state.year}/${search}/${orderBy}/${orderDirection}`
                  )
                    .then((resp) => resp.json())
                    .then((resp) => {
                      /*const numberOfPages = this.pagesNumber(
                        resp.total,
                        query.pageSize
                      );*/
                      //console.log(resp);
                      
                      this.updateTot(resp[resp.length-1].tot)
                      resp.splice(resp.length-1,1);
                      this.updateTotst(resp.length)
                      resolve({
                        data: resp, // your data array
                        //age: query.page, // current page number
                        totalCount: resp.length, // total row number
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
export default connect(mapStateToProps)(NotPayedStudents);