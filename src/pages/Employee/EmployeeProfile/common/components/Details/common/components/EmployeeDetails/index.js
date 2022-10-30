import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../../../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import "./style.css";
import swal from "sweetalert";
import axios from "axios";
import { Card } from "./common/components/Card";

class StudentDetails extends Component {
  render() {
    return (
      <div>
        <Card />
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
