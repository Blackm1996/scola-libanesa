import React, { Component } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Select from "react-select";
import { getStudentFileYear, getYears } from "../../Api/StudentsYearsFiles.js";
import swal from "sweetalert";
import "./style.css";

class ViewFileYear extends Component {
  state = {
    studentFileYear: {
      Inscription_Tax: "",
      "Books/Uniform_total": "",
      Monthly_Total: "",
      Month_Start: ""
    },
    loading: true,
    inscriptionYears: [],
    selectedYear: "",
  };

  //component did mount
  componentDidMount = () => {
    const studentID = this.props.match.params.id;

    //get years select box
    getYears(studentID)
      .then((response) => {
        if (response.status == 200)
          this.setState({
            inscriptionYears: response.data,
            loading: false,
          });
        else swal("there is a error, please refresh page", { icon: "error" });

        // if (response.status == 200)
        //   this.setState({
        //     inscriptionYears: response.data,
        //     loading: false,
        //   });
      })
      .catch((error) => {
        swal("there is a error, please refresh page", { icon: "error" });
        //window.location.reload();
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

  //onDropdownChange
  onDropdownChange = (e) => {
    // id student getted from url
    const studentID = this.props.match.params.id,
      yearSelected = e.value;
    this.setState({
      selectedYear: yearSelected,
    });
    //const link = `https://escola-elissa.com/laravel-testing/test2/api/student/${studentID}/${yearSelected}`;
    //console.log(link);
    // axios
    //   .get(link)
    //   .then((response) => {
    //     this.setState({
    //       student: response.data[0],
    //     });
    //   })
    //   .catch((error) => {
    //     swal("error");
    //   });

    //get student details
    getStudentFileYear(studentID, yearSelected)
      .then((response) => {
        if (response.status == 200)
          this.setState({
            studentFileYear: response.data
          });
        else swal("there is a error, please refresh page", { icon: "error" });

      })
      .catch((error) => {
        swal("there is a error, please refresh page", { icon: "error" });
        //window.location.reload();
      });
  };

  //render
  render() {
    //years option
    var years = [],
      year = "";

    for (var i = 0; i < this.state.inscriptionYears.length; i++) {
      year = this.state.inscriptionYears[i]["School_Year"];
      years.push({ value: year, label: year });
    }
    
    // student year file
    const studentFileYear = this.state.studentFileYear;

    return !this.state.loading ? (
      <div className="add-grade">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">Inscription details</h2>

            {/* Start select search */}
            <div className="select-container">
              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select class"
                  defaultValue={{ label: "2021-2022", value: "2021-2022" }}
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
            {/* end select search */}

          </div>
          {/* start student details */}
              <div className="row">
                <div className="mx-auto col-lg-6 col-12">
                  <pre className="student-details">
                    <div>Student number      : {this.props.match.params.id}</div>
                    <div>Inscription tax     : {studentFileYear.Inscription_Tax}</div>
                    <div>Books/Uniform total : {studentFileYear["Books/Uniform_total"]}</div>
                    <div>Month Start         : {studentFileYear.Month_Start}</div>
                    <div>Monthly total       : {studentFileYear.Monthly_Total}</div>
                    <div>Grade               :</div>
                    <div>Section             :</div>
                  </pre>
                </div>
              </div>
          {/* end student details */}

        </div>
      </div>
    ) : (
      <div>...loading</div>
    );
  }
}

export default ViewFileYear;
