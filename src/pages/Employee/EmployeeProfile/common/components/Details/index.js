/* Readable Scalable Secure */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { TOGGLE_LANG } from "../../../../../../redux/actions";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import EmployeeDetails from "./common/components/EmployeeDetails";
import ImageModal from "../../../../../../components/ImageModal";
import Edit from "./common/components/Edit"
import { Card } from "./common/components/EmployeeDetails/common/components/Card";

class Details extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    employeeDetails: {
      id: this.props.employeeID,
      First_Name: "mohamad",
      Last_Name: "mohyeddine",
      Birthday: "26-5-1996",
      Tel: "955589998",
      Address: "zrarieh",
      Nationality: "Lebanese",
      Type: "full_time",
      base_salary: 500000,
      debt_pay_perMonth: 0,
      position: "prof",
      start_position: "2022-04-04",
      end_position: null,
      is_Working: 1,
    },
    modalVis: false,
    printMarks: false,
    printPayment: false,
    imgToShow: "",
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
    const employeeID = this.state.employeeDetails.id;
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      bills,
      create,
      view,
      inscription,
      edit,
      updateProfile,
      profile,
      print,
    } = this.state.langKeywords[pageLanguage];
    return (
      <div className="student-profile">
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
          {/* <Card /> */}
          <EmployeeDetails
            toggleModalVis={this.toggleModalVis}
            studentDetails={this.state.employeeDetails}
          />
          {/* end student details */}

          {/* start middle navigation bar */}
          <ul className="nav nav-tabs">

            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`/admin/profile/${employeeID}/viewinscription`}
              >
                Inscription <i className="fa fa-caret-down"></i>
              </Link>
              <div className="dropdown-menu">
                <Link
                  className="dropdown-item"
                  to={`/admin/profile-employee/${employeeID}/update`}
                >
                  Update
                </Link>
              </div>
            </li>
          </ul>
          {/* end middle navigation bar */}
          {/* start routes section */}
          <div className="profile-routes-section">
            <Route
              exact
              path="/admin/profile-employee/:id"
              component={Edit}
            />
            <Route
              exact
              path="/admin/profile-employee/:id/update"
              component={Edit}
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

// export default connect(mapStateToProps, mapDispatchToProps)(EditStudent);
export default withRouter(connect(mapStateToProps)(Details));
