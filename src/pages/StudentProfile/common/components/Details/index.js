/* Readable Scalable Secure */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import axios from "axios";
import StudentDetails from "../../../../../components/StudentDetails";
import ImageModal from "../../../../../components/ImageModal";
import ViewPayment from "../../../../Payments/View";
import EditStudent from "../../../../Students/StudentsPublicFiles/Edit";
import AddStudentYearFile from "../../../../Students/StudentsYearsFiles/Add";
import ViewInscription from "../../../../Students/StudentsYearsFiles/View";
import EditInscription from "../../../../Students/StudentsYearsFiles/Edit";
import EditFileYear from "../../../../Students/StudentsYearsFiles/Edit";
import AddPayment from "../../../../Payments/Add";
import PrintPayment from "../../../../../components/Payments/PrintPayment";
import AddFamily from "../../../../Payments/AddFamily";
import PrintStudentMarks from "../PrintStudentMarks";
import ShowStudentMarks from "../ShowStudentMarks";

class Details extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    studentDetails: {
      id: this.props.studentID,
      First_Name: "",
      Last_Name: "",
      Birthday: "",
      Birthplace: "",
      Nationality: "",
      Sex: "",
      ID_URL: "",
      Vaccine_URL: "",
      id_family: "",
      id_guardian: "",
      phone_number: "",
    },
    printDetails: {
      id: "",
      name: "",
      grade: "",
      inscriptionTax: "",
      booksUniform: "",
    },
    modalVis: false,
    printMarks: false,
    printPayment: false,
    imgToShow: "",
    medical: [],
    medicine: [],
  };

  //component did mount
  componentDidMount = () => {
    // student id
    //const studentID = this.props.match.params.id;
    const studentID = this.props.studentID;
    axios
      .get(`/student/${studentID}`)
      .then((response) => {
        console.log(response);
        this.setState({
          studentDetails: response.data,
          medical: response.data.medical,
          medicine: response.data.medicine,
        });
      });
  };
  //close modal
  closeModal = () => {
    this.setState({
      modalVis: false,
    });
  };

  // print bill
  printBill = () => {

    axios
      .get(
        `/printBill/${this.props.match.params.id}/${this.props.schoolYear}`
      )
      .then((resp) => {

        const studentData = resp.data;
        console.log(studentData);
        if (studentData != null) {
          const name = `${resp.data.First_Name} ${resp.data.Last_Name}`;
          const {
            id,
            grade,
            Inscription_Tax: inscriptionTax,
          } = studentData;
          const booksUniform = studentData["Books/Uniform_total"];
          const printDetails = {
            id: id === null ? "" : id,
            name: name === null ? "" : name,
            grade: grade === null ? "" : grade,
            inscriptionTax: inscriptionTax === null ? "" : inscriptionTax,
            booksUniform: booksUniform === null ? "" : booksUniform,
          };

          this.setState({
            printDetails: { ...printDetails },
            printPayment: true,
            printMarks: false
          });
          setTimeout(() => window.print(), 2000)
        }
      });
  };

  printStuMarks = () => {
    this.setState({
      printPayment: false,
      printMarks: true
    });
  }
  //show modal
  toggleModalVis = (e) => {

    this.setState({
      imgToShow: e.target.src,
      modalVis: !this.state.modalVis,
    });
  };
  render() {
    // student id
    const studentId = this.state.studentDetails.id;
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { bills, create, view, inscription, edit, updateProfile, profile, print } =
      this.state.langKeywords[pageLanguage];
    return (
      <div className="student-profile">
        {this.state.printPayment && <PrintPayment printDetails={this.state.printDetails} />}
        {this.state.printMarks && <PrintStudentMarks printStuMarks={this.printStuMarks} />}
        {this.state.modalVis ? (
          <ImageModal
            img={this.state.imgToShow}
            toggleModalVis={this.toggleModalVis}
            closeModal={this.closeModal}
          />
        ) : null}
        <div className="container-fluid">
          {/*  Start title sectio */}
          <div className="col-12 text-center">
            <div className="title-of-middle">
              <h2>{profile}</h2>
            </div>
          </div>
          {/* end title section*/}

          {/* start student details */}
          <StudentDetails
            toggleModalVis={this.toggleModalVis}
            studentDetails={this.state.studentDetails}
          />
          {/* end student details */}

          {/* start middle navigation bar */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`/admin/profile/${studentId}/viewbill`}
              >
                {bills} <i className="fa fa-caret-down"></i>
              </Link>
              <div className="dropdown-menu">
                {(this.props.role === "admin" ||
                  this.props.role === "manager") && this.state.studentDetails.id_family === null && (
                    <Link
                      className="dropdown-item"
                      to={`/admin/profile/${studentId}/addbill`}
                    >
                      {create}
                    </Link>
                  )}
                {(this.props.role === "admin" ||
                  this.props.role === "manager") && this.state.studentDetails.id_family !== null && (
                    <Link
                      className="dropdown-item"
                      to={`/admin/profile/${studentId}/addFamilyBills/${this.state.studentDetails.id_family}`}
                    >
                      {create}
                    </Link>
                  )}
                <Link
                  className="dropdown-item"
                  to={`/admin/profile/${studentId}/viewbill`}
                >
                  {view}
                </Link>
                <Link className="dropdown-item" onClick={this.printBill}>
                  {print}
                </Link>
              </div>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`/admin/profile/${studentId}/viewinscription`}
              >
                {inscription} <i className="fa fa-caret-down"></i>
              </Link>
              <div className="dropdown-menu">
                <Link
                  className="dropdown-item"
                  to={`/admin/profile/${studentId}/inscription`}
                >
                  {create}
                </Link>
                <Link
                  className="dropdown-item"
                  to={`/admin/profile/${studentId}/editinscription`}
                >
                  {edit}
                </Link>
                <Link
                  className="dropdown-item"
                  to={`/admin/profile/${studentId}/viewinscription`}
                >
                  {view}
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`/admin/profile/${studentId}/view-marks`}
              >
                Marks <i className="fa fa-caret-down"></i>
              </Link>
              <div className="dropdown-menu">
                <Link
                  className="dropdown-item"
                  to={`/admin/profile/${studentId}/view-marks`}
                >
                  view
                </Link>
                <Link
                  className="dropdown-item"
                  onClick={this.printStuMarks}
                >
                  print
                </Link>
              </div>
            </li>
          </ul>
          {/* end middle navigation bar */}
          {/* start routes section */}
          <div className="profile-routes-section">
            <Route
              exact
              path="/admin/profile/:id"
              component={ViewInscription}
            />
            <Route
              exact
              path="/admin/profile/:id/addbill"
              component={AddPayment}
            />

            <Route
              exact
              path="/admin/profile/:id/details"
              component={Details}
            />
            <Route
              exact
              path="/admin/profile/:id/editfileyear"
              component={EditFileYear}
            />
            <Route
              exact
              path="/admin/profile/:id/viewbill"
              component={ViewPayment}
            />
            <Route
              exact
              path="/admin/profile/:id/edit"
              component={EditStudent}
            />
            <Route
              exact
              path="/admin/profile/:id/inscription"
              component={AddStudentYearFile}
            />
            <Route
              exact
              path="/admin/profile/:id/editinscription"
              component={EditInscription}
            />
            <Route
              exact
              path="/admin/profile/:id/viewinscription"
              component={ViewInscription}
            />
            <Route
              exact
              path="/admin/profile/:id/updatestudent"
              component={EditStudent}
            />
            <Route
              exact
              path="/admin/profile/:id/addFamilyBills/:familyID"
              component={AddFamily}
            />
            <Route
              exact
              path="/admin/profile/:id/view-marks"
              component={ShowStudentMarks}
            />
            {/* end routes section */}
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
    role: state.role,
  };
};
export default withRouter(connect(mapStateToProps)(Details));
