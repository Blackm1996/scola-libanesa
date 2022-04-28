/* Readable Scalable Secure */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import axios from "axios";
import StudentDetails from "../../../components/StudentDetails";
import ImageModal from "../../../components/ImageModal";
import ViewPayment from "../../Payments/View";
import EditStudent from "../../Students/StudentsPublicFiles/Edit";
import AddStudentYearFile from "../../Students/StudentsYearsFiles/Add";
import ViewInscription from "../../Students/StudentsYearsFiles/View";
import EditInscription from "../../Students/StudentsYearsFiles/Edit";
import EditFileYear from "../../Students/StudentsYearsFiles/Edit";
import AddPayment from "../../Payments/Add";
import PrintPayment from "../../../components/Payments/PrintPayment";

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
      Tel: "",
      Sex: "",
      Teuteur: "",
      ID_URL: "",
      Vaccine_URL: "",
    },
    printDetails: {
      name: "",
      grade: "",
      telephone: "",
      inscriptionTax: "",
      booksUniform: "",
    },
    modalVis: false,
    imgToShow: "",
  };

  //component did mount
  componentDidMount = () => {
    // student id
    //const studentID = this.props.match.params.id;
    const studentID = this.props.studentID;
    axios
      .get(`/student/${studentID}`)
      .then((response) => {
        this.setState({
          studentDetails: response.data,
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
        if (studentData != null) {
          const name = `${resp.data.First_Name} ${resp.data.Last_Name}`;
          const {
            grade,
            Tel: telephone,
            Inscription_Tax: inscriptionTax,
          } = studentData;
          const booksUniform = studentData["Books/Uniform_total"];
          const printDetails = {
            name: name === null ? "" : name,
            grade: grade === null ? "" : grade,
            telephone: telephone === null ? "" : telephone,
            inscriptionTax: inscriptionTax === null ? "" : inscriptionTax,
            booksUniform: booksUniform === null ? "" : booksUniform,
          };

          this.setState({
            printDetails: { ...printDetails },
          });
        }
        window.print();
      });
  };
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
        <PrintPayment printDetails={this.state.printDetails} />
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
                {(this.props.role == "admin" ||
                  this.props.role == "manager") && (
                  <Link
                    className="dropdown-item"
                    to={`/admin/profile/${studentId}/addbill`}
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
                  { print }
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
