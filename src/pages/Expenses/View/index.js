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
import axios from "axios";
import "./style.css";

class NotPayedStudents extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    year: "2021-2022",
    month: "9",
    data: [
      {
        amount: 2,
        date: "1/2/2009",
        description: "test",
      },
    ],
  };
  componentDidMount = () => {
    axios.get(`/Expenses/${this.state.month}`).then((resp) => {
      this.setState({
        data: resp.data,
      });
    });
  };
  //update year
  updateYear = (year) => {
    this.setState({
      year,
    });
  };

  //update grade id
  updateMonth = (month) => {
    axios.get(`/Expenses/${month}`).then((resp) => {
      this.setState({
        data: resp.data,
      });
    });
  };

  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      titlePage,
      type,
      search,
      description,
      noRecords,
      amount,
      date
    } = this.state.langKeywords[pageLanguage];

    const columns = [
      { title: `${amount}`, field: "Amount" },
      { title: `${description}`, field: "Description" },
      { title: `${type}`, field: "transaction_type" },
      { title: `${date}`, field: "Date" },
    ];
    return (
      <div className="main-table">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{titlePage}</h2>
          </div>

          <div className="d-flex col-10 mx-auto">
            {/* Start years selection 
            <SelectYear updateYear={this.updateYear} />
            End years selection */}
            {/* Start month Selection */}
            <SelectMonth updateMonth={this.updateMonth} />
            {/* End Month Selection */}
          </div>
          {/* start table */}

          {/* onChangePage = { (e, pg) => {console.log(`current page is : ${e} `); this.setState({ pageNum: e })}} */}
          <div className="students-all col-10 mx-auto">
            <MaterialTable
              title={titlePage}
              columns={columns}
              options={{
                debounceInterval: 700,
                padding: "dense",
                pageSize: 20,
                pageSizeOptions: [20, 30, 50, 100],
              }}
              data={this.state.data}
              onRowClick={this.onRowClick}
              onSearchChange={this.onSearchChange}
              localization={{
                toolbar: { searchPlaceholder: `${search}` },
                body: {
                  emptyDataSourceMessage: `${noRecords}`,
                },
              }}
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
