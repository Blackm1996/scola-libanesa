import React, { Component } from "react";
import Select from "react-select";
import swal from "sweetalert";
import { distributeStudents } from "../../Api/StudentsDistribution";
import SelectionTable from "../../components/SelectionTable";
import "./style.css";

class StudentsDistribution extends Component {
  state = {
    loading: true,
    loadingTable: false,
    students: [],
    grades: [
      { id: 1, value: "grade1" },
      { id: 2, value: "grade2" },
      { id: 3, value: "grade3" },
      { id: 4, value: "grade4" },
      { id: 5, value: "grade5" },
      { id: 6, value: "grade6" },
      { id: 7, value: "grade7" },
      { id: 8, value: "grade8" },
      { id: 9, value: "grade9" },
      { id: 10, value: "grade10" },
      { id: 11, value: "grade11" },
      { id: 12, value: "grade12" },
    ],
    sectionSelected: "",
    gradeSelected: "",
  };

  // component did mount
  componentDidMount = () => {
    const gradeId = this.props.match.params.id;
    this.setState({
      loading: false,
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

  //submit registered students
  submitStudents = (students = []) => {
    let gradeId = this.state.gradeSelected,
      sectionName = this.state.sectionSelected;

    if (students.length === 0) {
      swal("please enter at least one student ..");
      return;
    }
    if (gradeId !== "" && sectionName !== "") {
      let json = JSON.stringify({
        gradeId,
        sectionName,
        students,
      });
      //send post
      distributeStudents(json)
        .then(() => {
          swal("Students distributed successfuly", {
            icon: "success",
          });
          //this.props.history.push("/users");
        })
        .catch((error) => {
          swal("error", {
            icon: "error",
          });
        });
    }
  };
  //onDropdownChane
  onDropdownChange = (value) => {
    this.setState({
      loadingTable: false,
      gradeSelected: value.id,
      students: [
        {
          id: 1,
          first_name: "Josh",
          last_name: "Craise",
        },
        {
          id: 2,
          first_name: "Gerry",
          last_name: "Tertre",
        },
        {
          id: 3,
          first_name: "Gerry",
          last_name: "Tertre",
        },
        {
          id: 3,
          first_name: "Gerry",
          last_name: "Tertre",
        },
      ],
    });
  };

  //handle section input change
  handleSection = (e) => {
    this.setState({
      sectionSelected: e.target.value.trim(),
    });
  };
  //render
  render() {
    // grades options array
    var grades = this.state.grades,
      gradesOptions = [];
    for (var i = 0; i < grades.length; i++) {
      gradesOptions.push({
        id: grades[i].id,
        value: grades[i].value,
        label: grades[i].value,
      });
    }

    return this.state.loading ? (
      <div className="loading">loading ...</div>
    ) : (
      <div className="grades-distribution">
        <h2 className="title-of-middle">Grades distribution</h2>

        {/* Start select search */}
        <div className="select-container">
          <div className="select mb-4">
            <label>Grade :</label>
            <Select
              style={{ fontSize: 0 }}
              placeholder="Select class"
              options={gradesOptions}
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

          {/* start section name input */}
          {this.state.students.length > 0 && !this.state.loadingTable ? (
            <div className="select">
              <div className="form-group">
                <label for="sectionName">Section :</label>
                <input
                  name="firstName"
                  type="text"
                  className="form-control"
                  id="sectionName"
                  placeholder="Section name"
                  autocomplete="off"
                  onChange={this.handleSection}
                />
                {this.state.sectionSelected === "" ? (
                  <span className="error">* required</span>
                ) : null}
              </div>
            </div>
          ) : null}
          {/* end section name input */}
        </div>
        {/* end select search */}

        {/* start selection table */}

        {/* if the table of getted students is not empty*/}
        {!this.state.loadingTable && this.state.students.length !== 0 ? (
          <SelectionTable
            data={this.state.students}
            submitStudents={this.submitStudents}
          />
        ) : null}

        {/* if the table of getted students is empty*/}
        {!this.state.loadingTable && this.state.students.length === 0 ? (
          <div>no students for adding</div>
        ) : null}
        {/* end selection table */}
      </div>
    );
  }
}

export default StudentsDistribution;
