import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import TeacherMenu from "../../../components/LeftComponent/TeacherMenu";
import Details from "./common/components/Details";
import "./style.css";

class StudentProfile extends Component {
  componentDidMount = () => {
    console.log("stud prof", this.props);
  };
  render() {
    // student id passed by url
    return (
      <div className="students row">
        <div className="left-component pl-0 col-12 col-md-3 col-lg-2">
          <TeacherMenu />
        </div>

        <div className="middle-component col-12 col-md-9 col-lg-10">
          <Details employeeID = { this.props.match.params.id } />
        </div>
      </div>
    );
  }
}

export default withRouter(StudentProfile);
