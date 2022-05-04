import React, { Component } from "react";
import Select from "react-select";
import swal from "sweetalert";
import { distributeStudents } from "../../Api/StudentsDistribution";
import { connect } from "react-redux";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import "./style.css";
import axios from "axios";
import CoursesTeachersSelection from "../../components/CoursesTeachersSelection";

class StudentsDistribution extends Component {
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    loading: true,
    loadingTable: false,
    students: [],
    studentsDistributed: [],
    studentsNotDistributed: [],
    stNotDistAfterSearch: [],
    grades: [],
    sectionSelected: "",
    gradeSelected: "",
    recordsMessage: "",
    sectionError: "",
    search: "",
    selectedTeachers: [],
  };

  addSelectedTeachers = (e, idTeacher, idCourse) => {
    const selected = [...this.state.selectedTeachers];
    let find;

    if (e.value.toString().trim() === "") {
      find = selected.some((item) => {
        return item.idCourse === idCourse;
      });
      if (find) {
        let x = this.state.selectedTeachers.filter(
          (item) => item.idCourse !== idCourse
        );
        this.setState({
          selectedTeachers: [...x],
        });
      }
    } else {
      //setSelectedTeachers([...selectedTeachers, { idTeacher, idCourse }]);
      find = selected.some((item) => {
        return item.idCourse === idCourse;
      });

      if (find) {
        let x = this.state.selectedTeachers.map((item) => {
          if (item.idCourse === idCourse)
            return {
              idTeacher,
              idCourse,
            };
          return item;
        });
        this.setState({
          selectedTeachers: [...x],
        });
      } else {
        this.setState({
          selectedTeachers: [
            ...this.state.selectedTeachers,
            { idTeacher, idCourse },
          ],
        });
      }
    }
  };

  // component did mount
  componentDidMount = () => {
    // Page Lang
    const pageLanguage = localStorage.getItem("language");

    // Language KEywords
    //const { addSectionFailed } = this.state.langKeywords[pageLanguage];
    // get grades array with each grade its id and name
    let grades = [];
    this.props.schoolYear !== "" &&
      axios
        .get(`/section/${this.props.schoolYear}`)
        .then((response) => {
          grades = response.data;
          grades = grades.map((grade) => {
            return {
              id: grade.gradeId,
              value: grade.gradeName,
            };
          });
          this.setState({
            loading: false,
            grades,
          });
        })
        .catch((error) => {
          swal("addSectionFailed", {
            icon: "error",
          });
        });
  };
  componentDidUpdate = (prevProps, prevState) => {
    // Page Lang
    const pageLanguage = localStorage.getItem("language");

    // Language KEywords
    //const { addSectionFailed } = this.state.langKeywords[pageLanguage];
    // get grades array with each grade its id and name
    if (prevProps.schoolYear != this.props.schoolYear) {
      console.log("props mmm", this.props.schoolYear);
      let grades = [];
      axios
        .get(`/section/${this.props.schoolYear}`)
        .then((response) => {
          grades = response.data;
          grades = grades.map((grade) => {
            return {
              id: grade.gradeId,
              value: grade.gradeName,
            };
          });
          this.setState({
            loading: false,
            grades,
          });
        })
        .catch((error) => {
          swal("addSectionFailed", {
            icon: "error",
          });
        });
    }
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
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { noRecords, addSectionFailed } =
      this.state.langKeywords[pageLanguage];
    this.setState({
      studentsDistributed: [],
    });
    // grade id selected
    const gradeId = value.id;
    axios
      .get(`/missingStudent/${gradeId}/${this.props.schoolYear}`)
      .then((resp) => {
        let students = resp.data,
          student = {};

        students = students.map((student) => {
          return {
            id: student.id,
            firstName: student.First_Name,
            lastName: student.Last_Name,
          };
        });
        this.setState({
          students,
          loadingTable: false,
          gradeSelected: value.id,
          studentsNotDistributed: students,
          stNotDistAfterSearch: students,
        });
        // show message no records if students array getted is empty
        this.setState({
          recordsMessage: `${noRecords}`,
        });
      })
      .catch((error) => {
        swal(addSectionFailed, {
          icon: "error",
        });
      });
  };
  //handle on Blur
  handleBlur = () => {
    if (this.state.sectionSelected === "")
      this.setState({
        sectionError: "* required",
      });
    else
      this.setState({
        sectionError: "",
      });
  };
  //handle section input change
  handleSection = (e) => {
    this.setState({
      sectionSelected: e.target.value.trim(),
    });
  };

  // function shuffle array
  randomArrayShuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  //add student to distribution list when we click on table row in students list
  addStudentToDist = (id) => {
    let arr = this.state.studentsNotDistributed;
    let studentObj = arr.find((o) => o.id === id);
    // students array after remove student from students list and add it to distributed list
    let filteredArray = this.state.studentsNotDistributed.filter(
      (item) => item.id !== id
    );
    let filteredArray2 = this.state.stNotDistAfterSearch.filter(
      (item) => item.id !== id
    );
    let distributedStudents = this.state.studentsDistributed;
    distributedStudents.push(studentObj);
    this.setState({
      studentsNotDistributed: filteredArray,
      studentsDistributed: distributedStudents,
      stNotDistAfterSearch: filteredArray2,
    });
  };

  //handle number of students
  handleNumber = () => {
    const studentsDist = this.state.studentsNotDistributed.slice(
      0,
      this.state.randomNum
    );
    this.randomArrayShuffle(studentsDist);

    //students list after getting students from it
    let studentsList1 = this.state.studentsNotDistributed;
    studentsList1 = studentsList1.filter(
      (ar) => !studentsDist.find((rm) => rm.id === ar.id)
    );

    let studentsList2 = this.state.stNotDistAfterSearch;
    studentsList2 = studentsList2.filter(
      (ar) => !studentsDist.find((rm) => rm.id === ar.id)
    );

    this.setState({
      studentsNotDistributed: studentsList1,
      stNotDistAfterSearch: studentsList2,
      studentsDistributed: [...this.state.studentsDistributed, ...studentsDist],
    });
  };

  //remove item from distribution
  removeStudentFromDist = (id) => {
    //students array after dist
    let arr = this.state.studentsDistributed;
    let studentObj = arr.find((o) => o.id === id);
    // distributed students array after remove student from distributed students list
    let filteredArray = this.state.studentsDistributed.filter(
      (item) => item.id !== id
    );
    let studentsAfterPush = this.state.studentsNotDistributed;
    studentsAfterPush.push(studentObj);
    this.setState({
      studentsNotDistributed: studentsAfterPush,
      stNotDistAfterSearch: studentsAfterPush,
      studentsDistributed: filteredArray,
      search: "",
    });
  };

  // distribution submit button
  distribute = () => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { addSectionSuccess, addSectionFailed } =
      this.state.langKeywords[pageLanguage];
    //chack if section name field is setted or not
    if (this.state.sectionSelected.trim() === "") {
      this.setState({
        sectionError: "* required",
      });
    }
    let gradeId = parseInt(this.state.gradeSelected);
    if (
      //this.state.studentsDistributed.length > 0 &&
      this.state.sectionSelected.trim() !== "" &&
      !isNaN(gradeId)
    ) {
      let students = this.state.studentsDistributed.map((student) => {
        return student.id;
      });
      axios
        .post(`/section`, {
          gradeId,
          School_Year: this.props.schoolYear,
          sectionName: this.state.sectionSelected,
          students,
          selectedTeachers: [...this.state.selectedTeachers],
        })
        .then((response) => {
          if (response.status == 200) {
            swal(addSectionSuccess, {
              icon: "success",
            }).then((success) => {
              this.setState({
                studentsDistributed: [],
                sectionSelected: "",
                randomNum: "",
              });
              window.location.reload();
            });
          } else {
            swal(addSectionFailed, {
              icon: "error",
            });
          }
        })
        .catch((error) => {
          swal(addSectionFailed, {
            icon: "error",
          });
        });
    }
  };

  //handle random num
  handleRandom = (e) => {
    let randomNum = e.target.value;

    if (!isNaN(randomNum)) {
      if (randomNum < 0) {
        this.setState({
          randomNum: 0,
        });
      } else if (randomNum > this.state.studentsNotDistributed.length) {
        this.setState({
          randomNum: this.state.studentsNotDistributed.length,
        });
      } else {
        this.setState({
          randomNum,
        });
      }
    }
  };

  //search students
  searchStudents = (e) => {
    const query = e.target.value.trim().toLowerCase();

    //get students
    let students = this.state.studentsNotDistributed.filter((student) => {
      if (
        student.id.toLowerCase().startsWith(query) ||
        student.firstName.toLowerCase().startsWith(query) ||
        student.lastName.toLowerCase().startsWith(query)
      ) {
        return student;
      }
    });
    this.setState({
      stNotDistAfterSearch: students,
      search: query,
    });
  };
  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      addSection,
      selectGrade,
      sectionName,
      optional,
      added,
      add,
      notAdded,
      generateRandom,
      click,
      search,
      prename,
      name,
      studentId,
    } = this.state.langKeywords[pageLanguage];
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
        <h2 className="title-of-middle">{addSection}</h2>

        {/* Start grade select search */}
        <div className="select-container w-100 mb-0">
          <div className="select mb-4">
            <Select
              style={{ fontSize: 0 }}
              placeholder={`${selectGrade}`}
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
            {/* start section name input */}
            {!this.state.loadingTable ? (
              <div className="select">
                <div className="form-group d-flex">
                  <input
                    name="section"
                    type="text"
                    className="form-control rounded-0 mt-2"
                    id="sectionName"
                    autocomplete="off"
                    onChange={this.handleSection}
                    onBlur={this.handleBlur}
                    placeholder={`${sectionName}`}
                    value={this.state.sectionSelected}
                  />
                  <span className="error">{this.state.sectionError}</span>
                </div>
              </div>
            ) : null}
            {/* end section name input */}

            {/* start generate section randomly section */}
            {this.state.students.length > 0 ? (
              <div className="select mx-auto generate-randomly">
                <fieldset style={{ width: "300px !important" }}>
                  <legend>{optional}</legend>
                  <div className="input-group mb-3 mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`${generateRandom}`}
                      value={this.state.randomNum}
                      onChange={this.handleRandom}
                      type="number"
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={this.handleNumber}
                      >
                        {click}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            ) : null}
            {/* end generate section randomly section */}
          </div>
        </div>
        {/* end select search */}

        {/* start students after distribution */}

        <div className="col-12 mx-auto">
          {this.state.students.length > 0 ? (
            <fieldset className="mx-auto">
              <legend className="mx-auto">
                {added} : {this.state.studentsDistributed.length}
              </legend>

              {/* start distribution table */}
              <div style={{ maxHeight: "430px", overflowY: "auto" }}>
                <table>
                  {this.state.studentsDistributed.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        onClick={() => this.removeStudentFromDist(item.id)}
                      >
                        <td>{item.id}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
              {/* end distribution table */}
            </fieldset>
          ) : null}
        </div>
        {/* end students after distribution */}

        {/* start students before distribution */}
        {this.state.students.length > 0 ? (
          <div className="col-12 mx-auto">
            <fieldset className="mx-auto">
              <legend className="mx-auto">
                {notAdded}: {this.state.studentsNotDistributed.length}
              </legend>

              {/* start search section */}
              <div className="select">
                <div className="form-group d-flex">
                  <label>{search} :</label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={this.searchStudents}
                    value={this.state.search}
                  />
                </div>
              </div>
              {/* end search section */}

              {/* start students table before distribution */}
              <div style={{ maxHeight: "430px", overflowY: "auto" }}>
                <table className="w-100">
                  <thead>
                    <tr>
                      <td>{studentId}</td>
                      <td>{prename}</td>
                      <td>{name}</td>
                    </tr>
                  </thead>
                  {this.state.stNotDistAfterSearch.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        onClick={() => this.addStudentToDist(item.id)}
                      >
                        <td>{item.id}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
              {/* end students table before distribution */}
            </fieldset>
          </div>
        ) : (
          <div className="text-center">{this.state.recordsMessage}</div>
        )}
        {/* end students before distribution */}
        <CoursesTeachersSelection
          gradeId={this.state.gradeSelected}
          addSelectedTeachers={this.addSelectedTeachers}
        />
        {/* start submit button */}
        <div className="select">
          <div className="form-group col-12">
            {/* show create distribution button if there at least one student recored */}
            {this.state.studentsDistributed.length > 0 ||
            this.state.selectedTeachers.length > 0 ? (
              <button
                type="submit"
                className="btn btn-primary btn-block"
                onClick={this.distribute}
              >
                {add}
              </button>
            ) : null}
          </div>
        </div>
        {/* end submit button */}
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

export default connect(mapStateToProps)(StudentsDistribution);
