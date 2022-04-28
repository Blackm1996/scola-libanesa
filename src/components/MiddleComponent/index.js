// Middle Component
import React, { Component } from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import InscriptionStudent from "../../pages/Students/StudentsPublicFiles/Add";
import AddGrade from '../../pages/Grades/AddGrade';
import "./style.css";
import styles from "./style.module.css";

class MiddleComponent extends Component {
  state = {
    idMatiere: 3,
    nameMatiere: "Arabic",
    studentsMarks: [
      {
        idStud: 2,
        season1Mark: 40,
        season2Mark: 60,
        season3Mark: 90,
        season4Mark: 9,
        season5Mark: 11,
        season6Mark: 100,
      },
      {
        idStud: 2,
        season1Mark: 40,
        season2Mark: 60,
        season3Mark: 90,
        season4Mark: 9,
        season5Mark: 11,
        season6Mark: 100,
      },
      {
        idStud: 2,
        season1Mark: 40,
        season2Mark: 60,
        season3Mark: 90,
        season4Mark: 9,
        season5Mark: 11,
        season6Mark: 100,
      },
      {
        idStud: 2,
        season1Mark: 40,
        season2Mark: 60,
        season3Mark: 90,
        season4Mark: 9,
        season5Mark: 11,
        season6Mark: 100,
      },
    ],
  };
  render() {
    return (
      <div className={`${styles.middleComponent} col-12 col-md-8 col-lg-8`}>
          <Route exact path="/dashboard" component={InscriptionStudent} />
          <Route exact path="/dashboard/addgrade" component={AddGrade} />
          <Route exact path="/dashboard/addstudent" component={InscriptionStudent} />
        {/* <EditStudents />  */}
      </div>
    );
  }
}
export default MiddleComponent;
