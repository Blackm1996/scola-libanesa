import React, { Component } from "react";
import { Route } from "react-router-dom";
import InscriptionStudent from "../Students/StudentsPublicFiles/Add";
import StudentsTable from "./StudentsPublicFiles/Table";
import EditStudent from "./StudentsPublicFiles/Edit";
import StudentsDistribution from "../StudentsDistributionTest";
import TableYears from "../../pages/Students/StudentsYearsFiles/Table";
import AddUser from "../../pages/Users/AddUser";
import EditFileYear from "../Students/StudentsYearsFiles/Edit";
import AddPayment from "../Payments/Add";
import ViewPayment from "../Payments/View";
import TeacherMenu from "../../components/LeftComponent/TeacherMenu";
import StudentsGrade from "./StudentsGrade";
import StudentsSection from "./StudentsSection";
import UpdateSection from "../UpdateSection";
import AllStudents from "./AllStudentsTable2";
import NotPayedStudents from "./StudentsNotPayed";
import AddTeacher from "../AddTeacher";
import styles from "./style.module.css";
import "./style.css";
import UpdatePassword from "../UpdatePassword";
import UsersList from "../../pages/Users/UsersList";
import SchoolYear from "../ControlPanel/SchoolYear";
import AddTrimester from "../ControlPanel/AddTrimester";
import TeachersList from "../Teachers/TeachersList";
import AddExpense from "../Expenses/Add";
import ExpensesList from "../Expenses/View";
import ViewBillsPerMonth from "../Payments/ViewPerMonth";
import SpecialPage from "../SpecialPage";
import addFamilyBills from "../Payments/AddFamily";
import viewFamily from "../Students/Family/View";
import ViewAllFamilies from "../Students/Family/ViewAll";
import AllStudentsTable from "./AllStudentsTable";
import AddEmployee  from "../Employee/AddEmployee";
import EmployeesList from "../Employee/EmployeesList";
import HourlyEmployeeAttendance from "../Employee/EmployeeAttendance";
class Students extends Component {
  render() {
    //navbar links
    const links = [
      //{linkName: "student profile", to: "/admin/profile/m"},
      { linkName: "all students", to: "/admin" },
      { linkName: "Add public file", to: "/admin/students/add" },
      //{ linkName: "update public file", to: "/admin/students/update/2" },
      //{linkName: "files years", to: "/admin/students/filesyear"},
      { linkName: "Add file years", to: "/admin/students/addyearfile/3" },
      { linkName: "students distribution", to: "/admin/students/distribution" },
      //{ linkName: "view bills", to: "/admin/students/payments/view/:id" },
      //{ linkName: "add bill", to: "/admin/students/payments/add/:id" }
    ];
    return (
      <div className="students row">
        {/* Start left component */}
        <div className="left-component col-12 col-md-3 col-lg-2 pl-0  d-print-none">
          <TeacherMenu />
        </div>
        {/*end left component */}

        {/* Start main section */}
        <div className={`${styles.middleComponent} col-12 col-md-8 col-lg-8`}>
          <Route exact path="/admin" component={AllStudents} />
          <Route exact
            path="/admin/students/All"
            component={AllStudentsTable}
          />
          <Route
            exact
            path="/admin/students/notpayed"
            component={NotPayedStudents}
          />
          <Route
            exact
            path="/admin/students/addTeacher"
            component={AddTeacher}
          />
          <Route
            exact
            path="/admin/students/password"
            component={UpdatePassword}
          />

          {/* <Route  exact path="/admin/students" component={AllStudentsTable} /> */}
          <Route exact path="/admin/students" component={AllStudents} />
          <Route
            exact
            path="/admin/students/add"
            component={InscriptionStudent}
          />
          <Route
            exact
            path="/admin/students/update/:id"
            component={EditStudent}
          />
          <Route exact path="/admin/students/view" component={StudentsTable} />
          <Route
            exact
            path="/admin/students/edit/:id"
            component={EditStudent}
          />
          <Route
            exact
            path="/admin/students/distribution"
            component={StudentsDistribution}
          />
          <Route
            exact
            path="/admin/students/filesyear"
            component={TableYears}
          />
          <Route
            exact
            path="/admin/students/studentsyearsfiles/edit/:id"
            component={EditFileYear}
          />
          <Route
            exact
            path="/admin/students/payments/add/:id"
            component={AddPayment}
          />
          <Route
            exact
            path="/admin/students/payments/view/:id"
            component={ViewPayment}
          />
          <Route exact path="/admin/students/addUser" component={AddUser} />
          <Route
            exact
            path="/admin/students/grade/:id"
            component={StudentsGrade}
          />
          <Route
            exact
            path="/admin/students/section/:id"
            component={StudentsSection}
          />
          <Route
            exact
            path="/admin/students/updatesection/:id"
            component={UpdateSection}
          />
          <Route
            exact
            path="/admin/students/schoolyear"
            component={SchoolYear}
          />
          <Route
            exact
            path="/admin/students/trimester"
            component={AddTrimester}
          />
          <Route
            exact
            path="/admin/students/teachers"
            component={TeachersList}
          />
          <Route exact path="/admin/students/users" component={UsersList} />
          <Route
            exact
            path="/admin/students/addexpense"
            component={AddExpense}
          />
          <Route
            exact
            path="/admin/students/viewexpenses"
            component={ExpensesList}
          />
          <Route
            exact
            path="/admin/students/viewbills"
            component={ViewBillsPerMonth}
          />
          <Route
            exact
            path="/admin/students/specialComponent"
            component={SpecialPage}
          />
          <Route
            exact
            path="/admin/students/addFamilyBills"
            component={addFamilyBills}
          />
          <Route
           exact
           path="/admin/students/viewFamily/:id"
           component={viewFamily}
          />
          <Route
           exact
           path="/admin/students/viewFamilies"
           component={ViewAllFamilies}
          />
          <Route
           exact
           path="/admin/students/addEmployee"
           component={AddEmployee}
          />
          <Route
           exact
           path="/admin/students/employees"
           component={EmployeesList}
          />HourlyEmployeeAttendance
          <Route
           exact
           path="/admin/students/hourlyAttendance"
           component={HourlyEmployeeAttendance}
          />
        </div>

        {/* Start right Section */}
        <div className="right-component col-12 col-md-3 col-lg-2 d-print-none"></div>
      </div>
    );
  }
}

export default Students;
