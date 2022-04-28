import React, { Component } from "react";
import UpdateGradeBooks from "../UpdateGradeBooks";
import UpdateGradeCourses from "../UpdateGradeCourses";
import UpdateGradeTaxes from "../UpdateGradeTaxes";
import { Route } from "react-router-dom";

class UpdateGrade extends Component {
  state = {
    gradeId: this.props.match.params.id,
  };
  render() {
    return (
      <div className="update-grade">
        <Route
          exact
          path="/admin/grades/edit/:id"
          component={UpdateGradeTaxes}
        />
        <Route path="/admin/grades/edit/:id" component={UpdateGradeBooks} />
        <Route path="/admin/grades/edit/:id" component={UpdateGradeCourses} />
      </div>
    );
  }
}

export default UpdateGrade;
