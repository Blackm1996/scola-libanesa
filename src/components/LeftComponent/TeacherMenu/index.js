// Teacher Menu Component
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ItemMenu from "./ItemMenu";
import "./style.css";
import { connect } from "react-redux";
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
import axios from "axios";

class TeacherMenu extends Component {
  state = {
    titleName: {
      [ENGLISH]: "My Classes",
      [FRENCH]: "Mes Classes",
      [PORTO]: "Minhas Aulas",
    },
    teacherId: 2,
    grades: [],
  };
  componentDidMount = () => {
    // get grades
    axios.get(`/section/2021-2022`).then((response) => {
      this.setState({
        grades: response.data,
      });
    });
  };
  render() {
    const language = this.props.language;
    return (
      <div className="teacher-menu d-print-none">
        <ul
          className="d-print-none position-absolute w-100"
          style={{ height: "fit-content", listStyleType: "none" }}
        >
          {this.state.grades.length > 0 &&
            this.state.grades.map((item, index) => {
              return (
                <ItemMenu
                  className={item.gradeName}
                  key={index}
                  gradeName={item.gradeName}
                  gradeId={item.gradeId}
                  sections={item.sections}
                />
              );
            })}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(TeacherMenu);
