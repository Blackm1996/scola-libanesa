import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

// import languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import "./style.css";
import swal from "sweetalert";
import axios from "axios";

class StudentDetails extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
  };

  // delete student
  deleteStudent = () => {
    // student id
    const studentID = this.props.studentDetails.id;
    const pageLanguage = this.props.language;
    // Language KEywords

    const { deleteMessage, error1, deletedProfileSuccess } =
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
            `/student/${studentID}`
          )
          .then((response) => {
            if (response.status == 204) {
              swal(deletedProfileSuccess, {
                icon: "success",
              }).then((response) => {
                this.props.history.push("/admin");
              });
            } else {
              swal(error1, {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal(error1, {
              icon: "error",
            });
          });
      }
    });
  };

  //update student
  updateStudent = () => {
    // student id
    const studentID = this.props.studentDetails.id;
    //this.props.history.push(`/admin/profile/${ studentID  }/editinscription`);
    window.scrollTo(550, 550);
  };
  render() {
    // student details
    const student = this.props.studentDetails;

    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      name,
      prename,
      birthDate,
      sex,
      vaccination,
      guardian,
      studentId,
      phoneNumber,
      placeOfBirth,
    } = this.state.langKeywords[pageLanguage];

    return (
      <div className="studentID-section">
        <div className="row">
          {/* Start Section of images */}
          <div className="col-md-4 mb-3 pr-0">
            <div className="images">
              <div className="d-flex flex-column align-items-center text-center">
                <div className="mb-2 pt-3">
                  <span className="d-block">{studentId} : </span>
                  <img
                    //https://picsum.photos/200/200
                    src={process.env.REACT_APP_BACKEND+`project/storage/app/${student.ID_URL}`}
                    alt="ID URL"
                    className="img-thumbnail"
                    onClick={this.props.toggleModalVis}
                  />
                </div>
              </div>
              <div className="d-flex flex-column align-items-center text-center">
                <div>
                  <span className="d-block">{vaccination} : </span>
                  <img
                    src={process.env.REACT_APP_BACKEND+`project/storage/app/${student.Vaccine_URL}`}
                    alt="Vaccine URL"
                    className="img-thumbnail"
                    onClick={this.props.toggleModalVis}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* end section of images */}

          <div className="col-md-8 pl-0">
            <div className="card mb-3">
              <div className="card-body">
              <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">ID</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {student.id}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{prename}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {student.First_Name}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{name}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {student.Last_Name}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{birthDate}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {student.Birthday}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{sex}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">{student.Sex}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{placeOfBirth}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {student.Birthplace}
                  </div>
                </div>
                <hr />
              </div>

              {/* start trash edit icons sectio*/}
              <div className="trash-and-edit">
                <Link
                  to={`/admin/profile/${this.props.match.params.id}/updatestudent`}
                >
                  <i className="fa fa-edit" onClick={this.updateStudent}></i>
                </Link>

                {/* admin only can delete student profile */}
                {this.props.role == "admin" && (
                  <i className="fa fa-trash" onClick={this.deleteStudent}></i>
                )}
              </div>
              {/* end trash edit icons sectio*/}
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
    role: state.role,
  };
};

export default connect(mapStateToProps)(withRouter(StudentDetails));
