import React, { Component } from "react";
import Select from "react-select";
import swal from "sweetalert";
import { distributeStudents } from "../../Api/StudentsDistribution";
import { connect } from "react-redux";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import {
  ENGLISHWORDS,
  FRENCHWORDS,
  PORTOWORDS,
} from "../StudentsDistributionTest/LangKeys";
import SelectionTable from "../../components/SelectionTable";
import "./style.css";
import axios from "axios";
import CoursesTeachersSelection from "../../components/UpdateTeachersCourses";
import UpdateCoursesTeachers from "./UpdateCoursesTeachers";

class UpdateSection extends Component {
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    loading: true,
    loadingTable: false,
    m: [],
    students: [],
    studentsDistributed: [],
    studentsNotDistributed: [],
    stNotDistAfterSearch: [],
    grades: [],
    fixedSectionName: "",
    sectionSelected: "",
    gradeSelected: "",
    recordsMessage: "",
    sectionError: "",
    removedStudents: [], // added ids
    addedStudents: [], //added Ids
    addedInstructor: [],
    removedInstructor: [],
  };

  // component did mount
  componentDidMount = () => {
    // Page Lang
    const pageLanguage = localStorage.getItem("language");

    // Language KEywords
    //const { addSectionFailed } = this.state.langKeywords[pageLanguage];
    // get grades array with each grade its id and name
    let grades = [];
    axios
      .get(
        `/section/${this.props.schoolYear}`
      )
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
    //get distributed and not distributed students from databse
    axios
      .get(
        `/missingStudents/${this.props.match.params.id}`
      )
      .then((response) => {
        let stDistributedAPI =
          Object.keys(response.data).length > 0
            ? response.data.sectionStudent[0]
            : [];
        let stNotDistributedAPI =
          Object.keys(response.data).length > 0
            ? response.data.studentsNotDistributed[0]
            : [];
        //convert php paramters to js paramters
        stDistributedAPI = stDistributedAPI.map((student) => {
          return {
            id: student.id,
            firstName: student.First_Name,
            lastName: student.Last_Name,
          };
        });
        //convert php paramters to js paramters
        stNotDistributedAPI = stNotDistributedAPI.map((student) => {
          return {
            id: student.id,
            firstName: student.First_Name,
            lastName: student.Last_Name,
          };
        });

        this.setState({
          fixedSectionName: response.data.sectionName,
          fixedGradeName: response.data.gradeName,
          sectionSelected: response.data.sectionName,
          students: [...stNotDistributedAPI],
          studentsDistributed: [...stDistributedAPI],
          m: [...stDistributedAPI],
          studentsNotDistributed: [...stNotDistributedAPI],
          stNotDistAfterSearch: [...stNotDistributedAPI],
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
    const idExists1 = this.state.students.some((student) => student.id === id);
    const idExists2 = this.state.addedStudents.indexOf(id);
    const idExists3 = this.state.removedStudents.indexOf(id);
    if (idExists2 > -1 && idExists1) {
      let oldRemovedStudents = this.state.removedStudents;
      oldRemovedStudents.splice(id, 1);
      this.setState({
        removedStudents: [...oldRemovedStudents],
      });
    }
    if (idExists3 > -1) {
      let oldRemovedStudents = this.state.removedStudents;
      oldRemovedStudents = oldRemovedStudents.filter(
        (studentId) => studentId != id
      );

      this.setState({
        removedStudents: [...oldRemovedStudents],
      });
    }
    if (idExists1 && idExists2 === -1)
      this.setState({
        addedStudents: [...this.state.addedStudents, id],
      });
  };

  //remove item from distribution
  removeStudentFromDist = (id) => {
    //add id student who is added new to addStudents array
    let removedStudents = this.state.removedStudents;
    let studentsDist = this.state.m;
    //id exist or not in distributed array
    const idExists1 = this.state.m.some((student) => student.id === id);
    const idExists2 = this.state.removedStudents.indexOf(id);
    const idExists3 = this.state.addedStudents.indexOf(id);

    if (idExists1 && idExists2 === -1) {
      this.setState({
        removedStudents: [...removedStudents, id],
      });
    }
    if (idExists3 > -1) {
      let addedStudents = this.state.addedStudents;
      addedStudents = addedStudents.filter((studentId) => {
        return studentId !== id;
      });
      this.setState({
        addedStudents: [...addedStudents],
      });
    }
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
      studentsNotDistributed: [...studentsAfterPush],
      stNotDistAfterSearch: [...studentsAfterPush],
      studentsDistributed: [...filteredArray],
    });
  };

  // distribution submit button
  distribute = () => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { addSectionFailed, addSectionSuccess } =
      this.state.langKeywords[pageLanguage];
    //chack if section name field is setted or not
    if (this.state.sectionSelected.trim() === "") {
      this.setState({
        sectionError: "* required",
      });
    }

    if (this.state.sectionSelected != "") {
      console.log(".....");
      let sendedObj = {
        School_Year: this.props.schoolYear,
      };
      if (this.state.sectionSelected != this.state.fixedSectionName)
        sendedObj.sectionName = this.state.sectionSelected;
      if (this.state.addedStudents.length > 0)
        sendedObj.addedStudents = this.state.addedStudents;
      if (this.state.removedStudents.length > 0)
        sendedObj.removedStudents = this.state.removedStudents;
      sendedObj.removedInstructor = [...this.state.removedInstructor];
      sendedObj.addedInstructor = [...this.state.addedInstructor];
      axios
        .put(
          `/section/${this.props.match.params.id}`,
          sendedObj
        )
        .then((response) => {
          if (response.status == 200) {
            swal(addSectionSuccess, {
              icon: "success",
            }).then((success) => {
              this.props.history.push(
                `/admin/students/section/${this.props.match.params.id}`
              );
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
    });
  };

  //delete section
  deleteSection = () => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { deleteMessage, deleteSectionFailed, success } =
      this.state.langKeywords[pageLanguage];
    swal({
      title: deleteMessage,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `/section/${this.props.match.params.id}`
          )
          .then((response) => {
            if (response.status == 200) {
              swal(success, {
                icon: "success",
              }).then((success) => {
                this.props.history.push("/admin");
              });
            } else {
              swal(deleteSectionFailed, {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal(deleteSectionFailed, {
              icon: "error",
            });
          });
      }
    });
  };

  //update courses Teachers

  addCoursesAndTeachers = (coursesArr, teachersArr) => {
    this.setState({
      allTeachers: [...teachersArr],
      courses: [...coursesArr],
    });
  };
  //update teachers
  update = (idTeacher, idCourse) => {
    let added = [];
    let removed = [];
    let find1, find2, find3;

    //when we send None
    if (idTeacher.toString().trim() === "") {
      find1 = this.state.addedInstructor.some(
        (item) => item.idCourse == idCourse
      );
      //exist in addedInstructor array
      if (find1) {
        let x = this.state.addedInstructor.filter(
          (item) => item.idCourse != idCourse
        );
        this.setState({
          addedInstructor: [...x],
        });
      }

      // exists in courses array
      find2 = this.state.courses.some(
        (item) => item.id_course == idCourse && item.instructor_id != null
      );
      if (find2) {
        removed = [...this.state.removedInstructor];
        let foundIndex = this.state.courses.findIndex(
          (item) => item.id_course == idCourse
        );
        let removedObj = {
          idCourse: this.state.courses[foundIndex].id_course,
          idInstructor: this.state.courses[foundIndex].instructor_id,
        };

        removed = removed.filter((item) => item.idCourse != idCourse);
        removed.push(removedObj);
        //console.log("find3", find3);
        this.setState({
          removedInstructor: [...removed],
        });
      }
      // exist already in addedInstructor
      find3 = this.state.addedInstructor.some(
        (item) => item.idCourse == idCourse && item.idInstructor == idTeacher
      );
      if (find3) {
        removed = [...this.state.removedInstructor];
        removed = removed.filter(
          (item) => item.idCourse != idCourse || item.idInstructor != idTeacher
        );
        this.setState({
          removedInstructor: [...removed],
        });
      }
    } else {
      added = [...this.state.addedInstructor];
      removed = [...this.state.removedInstructor];
      let find4;
      //find in courses list
      find1 = this.state.courses.some((item) => {
        return item.instructor_id == idTeacher && item.id_course == idCourse;
      });
      find2 = this.state.addedInstructor.some((item) => {
        return item.idInstructor == idTeacher && item.idCourse == idCourse;
      });
      find3 = this.state.addedInstructor.some((item) => {
        return item.idCourse == idCourse;
      });

      added = added.filter((item) => item.idCourse != idCourse);
      added.push({
        idInstructor: idTeacher,
        idCourse,
      });
      if (find1) {
        removed = removed.filter(
          (item) => item.idCourse != idCourse || item.idInstructor != idTeacher
        );
        this.setState({
          removedInstructor: [...removed],
        });
      }
      // find4
      find4 = this.state.courses.some(
        (item) => item.id_course == idCourse && item.instructor_id != null
      );
      if (find4) {
        removed = [...this.state.removedInstructor];
        let foundIndex = this.state.courses.findIndex(
          (item) => item.id_course == idCourse
        );
        let removedObj = {
          idCourse: this.state.courses[foundIndex].id_course,
          idInstructor: this.state.courses[foundIndex].instructor_id,
        };

        removed = removed.filter((item) => item.idCourse != idCourse);
        removed.push(removedObj);
        //console.log("find3", find3);
        this.setState({
          removedInstructor: [...removed],
        });
      }
      this.setState({
        addedInstructor: [...added],
      });
    }
  };
  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      updateSection,
      sectionName,
      added,
      notAdded,
      search,
      studentId,
      prename,
      name,
      update,
      remove,
    } = this.state.langKeywords[pageLanguage];
    return this.state.loading ? (
      <div className="loading">loading ...</div>
    ) : (
      <div className="grades-distribution">
        <h2 className="title-of-middle">{updateSection}</h2>

        {/* Start grade select search */}
        <div className="select-container w-100 mb-0">
          <div className="select mb-4">
            {/* start section name input */}
            {!this.state.loadingTable ? (
              <div className="select">
                <h5 className="text-center">{this.state.fixedGradeName}</h5>
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
          </div>
        </div>
        {/* end select search */}

        {/* start students after distribution */}

        <div
          className="col-12 mx-auto mb-4"
          style={{ maxHeight: "430px", overflowY: "auto" }}
        >
          <fieldset className="mx-auto">
            <legend className="mx-auto">
              {added} : {this.state.studentsDistributed.length}
            </legend>

            {/* start distribution table */}
            <table className="w-100">
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
            {/* end distribution table */}
          </fieldset>
        </div>
        {/* end students after distribution */}

        {/* start students before distribution */}

        <div>
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
                />
              </div>
            </div>
            {/* end search section */}

            {/* start students table before distribution */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
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

        {/* end students before distribution */}
        {/* <CoursesTeachersSelection /> */}
        <UpdateCoursesTeachers
          update={this.update}
          addCoursesAndTeachers={this.addCoursesAndTeachers}
        />
        {/* start submit button */}
        <div className="select">
          <div className="form-group col-12">
            {/* show create distribution button if there at least one student recored */}
            {this.state.sectionSelected.trim() !==
              this.state.fixedSectionName.trim() ||
            this.state.addedStudents.length != 0 ||
            this.state.removedStudents.length != 0 ||
            this.state.addedInstructor.length != 0 ||
            this.state.removedInstructor.length != 0 ? (
              <button
                type="submit"
                className="btn btn-primary btn-block mb-0"
                onClick={this.distribute}
              >
                {update}
              </button>
            ) : null}
          </div>
          {/* start delete button */}
          <div className="form-group col-12">
            {/* show create distribution button if there at least one student recored */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={this.deleteSection}
            >
              {remove}
            </button>
          </div>
          {/* end delete button */}
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

export default connect(mapStateToProps)(UpdateSection);
