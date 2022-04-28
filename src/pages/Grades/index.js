import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import TeacherMenu from "../../components/LeftComponent/TeacherMenu";
import { Link, Route } from "react-router-dom";
import AddGrade from "../../pages/Grades/AddGrade";
import UpdateGrade from "../../pages/Grades/UpdateGrade";
import UpdateGradeBooks from "../../pages/Grades/UpdateGradeBooks";
import UpdateGradeCourses from "../../pages/Grades/UpdateGradeCourses";
import ViewGrade from "../../pages/Grades/ViewGrade";

class Grades extends Component {
  render() {
    //navbar links
    const links = [
      { linkName: "Add Grade", to: "/admin/grades/add" },
      { linkName: "edit Grade taxes", to: "/admin/grades/view" },
      { linkName: "edit Books", to: "/admin/grades/editbooks/5" },
      { linkName: "edit Courses", to: "/admin/grades/editcourses/5" },
    ];
    return (
      <div className="grades row ml-0 mr-0">
        {/* Start left component */}
        <div className="left-component col-12 col-md-3 col-lg-2 pl-0">
          <TeacherMenu />
          {/* start left links */}
          {/*
          <ul>
            {links.map((link) => (
              <li>
                <Link to={link.to}>{link.linkName}</Link>
              </li>
            ))}
          </ul>
          */}
          {/* end left links*/}
        </div>

        {/* Start main section */}
        <div className="middle-component col-12 col-md-8 col-lg-8">
          <Route exact path="/admin/grades" component={AddGrade} />
          <Route exact path="/admin/grades/add" component={AddGrade} />
          <Route exact path="/admin/grades/edit/:id" component={UpdateGrade} />
          <Route exact path="/admin/grades/view" component={ViewGrade} />
          <Route
            exact
            path="/admin/grades/editbooks/:id"
            component={UpdateGradeBooks}
          />
          <Route
            exact
            path="/admin/grades/editcourses/:id"
            component={UpdateGradeCourses}
          />
        </div>

        {/* Start right Section */}
        <div className="right-component col-12 col-md-3 col-lg-2"></div>
      </div>
    );
  }
}

export default Grades;
