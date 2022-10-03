import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import TeacherMenu from "../../components/LeftComponent/TeacherMenu";
import Details from "./common/components/Details";
import "./style.css";

class StudentProfile extends Component {
  componentDidMount = ()=>{
    console.log("stud prof",this.props);
  };
  render() {
    // student id passed by url
    return (
      <div className="students row">
        {/* Start left component */}
        <div className="left-component pl-0 col-12 col-md-3 col-lg-2">
          <TeacherMenu />

          {/* start the ancient left side bar
          <ul>
            {links.map((link) => (
              <li>
                <Link to={link.to}>
                  <i className={link.fontAwesome}></i>
                  {link.linkName}
                </Link>
              </li>
            ))}
          </ul>
          end the ancient left side bar*/}
        
        </div>

        {/* Start main section */}
        <div className="middle-component col-12 col-md-9 col-lg-10">
          <Details studentID = { this.props.match.params.id } />
          {/*
          <Route exact path="/admin" component={AllStudentsTable} />
          <Route exact path="/admin/profile/:id" component={Details} />
          <Route
            exact
            path="/admin/profile/:id/addbill"
            component={AddPayment}
          />
          
          <Route exact path="/admin/profile/:id/details" component={Details} />
          <Route
            exact
            path="/admin/profile/:id/editfileyear"
            component={EditFileYear}
          />
          <Route
            exact
            path="/admin/profile/:id/viewbill"
            component={ViewPayment}
          />
          <Route exact path="/admin/profile/:id/edit" component={EditStudent} />
          <Route  exact path="/admin/profile/:id/inscription" component={AddStudentYearFile} />
          <Route  exact path="/admin/profile/:id/viewinscription" component={ViewFileYear} />
        */}
        </div>
      </div>
    );
  }
}

export default withRouter(StudentProfile);
