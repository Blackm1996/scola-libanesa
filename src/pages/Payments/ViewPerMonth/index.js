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
import axios from "axios";

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
    data: [],
    dataAPI: [],
  };
  componentDidMount = () => {
    const { month, year } = this.state;
    axios.get(`/allMonthBills/${month}/${year}`).then((resp) => {
      this.setState({
        data: resp.data,
        dataAPI: resp.data,
      });
    });
  };
  //update year
  updateYear = (year) => {
    this.setState({
      year,
    }).then((res) => {});
  };

  //update grade id
  updateMonth = (month) => {
    console.log(this.state.year);
    this.setState({
      month,
    });
    axios.get(`/allMonthBills/${month}/${this.state.year}`).then((resp) => {
      this.setState({
        data: resp.data,
        dataAPI: resp.data,
      });
    });
  };
  // on Row click
  onRowClick = (event, rowData) => {
    this.props.history.push("/admin/profile/" + rowData.id);
  };
  //on search change
  onSearchChange = (query) => {
    let bills = this.state.dataAPI.filter((bill) => {
      let { id, name, Amount: amount, date, type } = bill;
      console.log("amount", amount);
      type = type == null && "";
      id = id.toString();
      name = name.toLowerCase();
      //type = type.toLowerCase();

      amount = amount.toString();
      if (
        id.startsWith(query) ||
        name.startsWith(query.toLowerCase()) ||
        amount.startsWith(query.toLowerCase()) ||
        date.startsWith(query.toLowerCase()) ||
        type.startsWith(query.toLowerCase())
      ) {
        return bill;
      }
    });
    this.setState({
      data: bills,
    });
  };
  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { bills, search, noRecords, id, amount, date, type, name } =
      this.state.langKeywords[pageLanguage];

    const columns = [
      { title: `${id}`, field: "id" },
      { title: `${name}`, field: "name" },
      { title: `${amount}`, field: "Amount" },
      { title: `${date}`, field: "date" },
      { title: `${type}`, field: "type" },
    ];
    return (
      <div className="main-table">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{bills}</h2>
          </div>

          <div className="d-flex col-10 mx-auto">
            {/* Start years selection */}
            <SelectYear updateYear={this.updateYear} />
            {/* End years selection */}
            {/* Start month Selection */}
            <SelectMonth updateMonth={this.updateMonth} />
            {/* End Month Selection */}
          </div>
          {/* start table */}

          {/* onChangePage = { (e, pg) => {console.log(`current page is : ${e} `); this.setState({ pageNum: e })}} */}
          <div className="students-all col-10 mx-auto">
            <MaterialTable
              title={bills}
              columns={columns}
              options={{
                debounceInterval: 700,
                padding: "dense",
                pageSize: 5,
                pageSizeOptions: [5, 10, 20, 30],
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
