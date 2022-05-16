// Teacher Menu Component
import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemMenu from "./ItemMenu";
import "./style.css";
import { connect } from "react-redux";
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
import axios from "axios";

const TeacherMenu = (props) => {
  const [grades, setGrades] = useState([]);
  useEffect(() => {
    const { year } = props;
    year !== "" &&
      year !== undefined &&
      axios.get(`/section/${year}`).then((response) => {
        setGrades([...response.data]);
      });
  }, []);
  useEffect(() => {
    const { year } = props;
    year !== "" &&
      year !== undefined &&
      axios.get(`/section/${year}`).then((response) => {
        setGrades([...response.data]);
      });
  }, [props.year]);

  const language = props.language;
  return (
    <div className="teacher-menu d-print-none">
      <ul
        className="d-print-none position-absolute w-100"
        style={{ height: "fit-content", listStyleType: "none" }}
      >
        {grades.length > 0 &&
          grades.map((item, index) => {
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
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
    year: state.schoolYear,
  };
};
export default connect(mapStateToProps)(TeacherMenu);
