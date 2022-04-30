import React, { Component } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import Select from "react-select";
import BillsModal from "../../../components/BillsModal";
import { getYears, getBills } from "../../../Api/Payments";
import "./style.css";
import swal from "sweetalert";
import { ThemeProvider } from "styled-components";

class View extends Component {
  state = {
    loading: false,
    showTable: false,
    modalVis: false,
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    id: "",
    monthSelected: "",
    yearSelected: "",
    startMonth: 9,
    years: [],
    bills: [],
  };

  //component did mount
  componentDidMount = () => {
    // student id
    const studentID = this.props.match.params.id;

    //set id student in state
    this.setState({
      id: studentID,
      yearSelected: this.props.schoolYear,
    });

    //get years inscripted by student
    //get years select box

    getYears(studentID)
      .then((response) => {
        if (response.status == 200)
          this.setState({
            years: response.data,
          });
        else swal("there is a error, please refresh page", { icon: "error" });
      })
      .catch((error) => {
        swal("there is a error, please refresh page", { icon: "error" });
        //window.location.reload();
      });

    // get bills for current year
    // get bills
    getBills(studentID, this.props.schoolYear) // e.value is year selected
      .then((response) => {
        if (response.status == 200) {
          if (response.data.startMonth != null) {
            this.setState({
              ...response.data,
              showTable: true,
            });
          }
        } else swal("there is a error, please try again ..", { icon: "error" });
      })
      .catch((error) => {
        swal("there is a error, please try again ..", { icon: "error" });
      });
  };

  //show bills when we click on  month
  showBills = (month) => {
    this.setState({
      monthSelected: month,
      modalVis: !this.state.modalVis,
    });
  };

  //custom stlyes
  customStyles = {
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

  //close modal
  closeModal = () => {
    this.setState({
      modalVis: false,
    });
  };

  //show modal
  toggleModalVis = () => {
    this.setState({
      modalVis: !this.state.modalVis,
    });
  };

  //onDropdownChange
  onDropdownChange = (e) => {
    // id student getted from url
    const studentID = this.props.match.params.id;
    //set selected year in the state
    this.setState({
      yearSelected: e.value,
    });

    // get bills
    getBills(studentID, e.value) // e.value is year selected
      .then((response) => {
        if (response.status == 200)
          this.setState({
            ...response.data,
            showTable: true,
          });
        else swal("there is a error, please try again ..", { icon: "error" });
      })
      .catch((error) => {
        swal("there is a error, please try again ..", { icon: "error" });
      });
  };

  //render
  render() {
    //years option
    var years = [],
      year = "";

    for (var i = 0; i < this.state.years.length; i++) {
      year = this.state.years[i]["School_Year"];
      years.push({ value: year, label: year });
    }
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      title,
      month,
      total,
      paidAmount,
      rest,
      status,
      completed,
      insertYear,
    } = this.state.langKeywords[pageLanguage];

    return (
      <div className="view-bills">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{title}</h2>

            {/* Start Bills Modal section */}
            {this.state.modalVis ? (
              <BillsModal
                id={this.state.id} // id student
                yearSelected={this.state.yearSelected} // year selected
                monthSelected={this.state.monthSelected} // month selected
                closeModal={this.closeModal}
                toggleModalVis={this.toggleModalVis}
              />
            ) : null}
            {/* End Bills Modal section */}

            {/* Start select search */}
            <div className="select-container w-100">
              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select class"
                  defaultValue={{
                    label: `${this.props.schoolYear}`,
                    value: ` ${this.props.schoolYear} `,
                  }}
                  options={years}
                  styles={this.customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "hotpink",
                      primary: "#ff634766",
                    },
                  })}
                  onChange={this.onDropdownChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="add-grade col-lg-6 col-12">
              {/* start payments table*/}
              {this.state.showTable ? (
                <div style={{ "overflow-x": "auto" }}>
                  <table className="bills-table">
                    <thead>
                      <tr style={{ cursor: "pointer" }}>
                        <th>{month}</th>
                        <th>{total}</th>
                        <th>{paidAmount}</th>
                        <th>{rest}</th>
                        <th>{status}</th>
                      </tr>
                    </thead>
                    {this.state.bills.length === 0 ? (
                      <div>empty</div>
                    ) : (
                      this.state.bills.map((bill, index) => (
                        <tr
                          key={index}
                          onClick={() => this.showBills(bill.month)}
                        >
                          <td>{bill.month}</td>
                          <td>{bill.totalCost}</td>
                          <td>{bill.payed}</td>
                          <td>{bill.theRest}</td>
                          <td>
                            {bill.status == "true" ? (
                              <span
                                style={{ color: "#0f660fbd", fontSize: "13px" }}
                              >
                                <i className="fa fa-check"></i> {completed}
                              </span>
                            ) : (
                              <span
                                style={{ color: "#ff600299", fontSize: "15px" }}
                              >
                                <i className="fa fa-spinner fa-lg"></i>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </table>
                </div>
              ) : (
                <div>{insertYear}</div>
              )}
              {/* end payments table */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    schoolYear: state.schoolYear,
  };
};
export default connect(mapStateToProps)(View);
