import React, { Component } from "react";
import Navbar from "../../../components/Navbar";
import Students from "../../Students";
import Grades from "../../Grades";
import StudentProfile from "../../StudentProfile";
import Payments from "../../Payments";
import { Route, Switch, Redirect } from "react-router-dom";
// import connect from react-redux
import { connect } from "react-redux";
import { TOGGLE_LANG, TOGGLE_ROLE } from "../../../redux/actions";
import Login from "../../Login";

class AdminDashboard extends Component {
  componentDidMount = () => {
    /* start Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    // get language from local storage
    const globalLang = localStorage.getItem("language");
    if (globalLang != null) {
      // when we click update button we should update the update and we need to set language in redux from localstorage
      this.props.toggleLanguages(globalLang);
    }
    /* end Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    /* start resolve problem when we reload the page and user role should reset in redux */
    const role = localStorage.getItem("role");
    if (role != null) {
      // when we click update button we should update the update and we need to set role in redux from localstorage
      this.props.setRole(role);
    }
    /* end resolve problem when we reload the page and user role should reset in redux */
  };

  render() {
    //navbar links
    const links = [
      { linkName: "Students", to: "/admin/students" },
      { linkName: "grades", to: "/admin/grades" },
      { linkName: "payments", to: "/admin/payments" },
    ];
    //user role
    const role = this.props.role;

    var element;
    if (
      ["admin", "employee", "manager"].includes(role) &&
      localStorage.getItem("new") == "true"
    ) {
      element = (
        <>
          {/* end languages bar */}
          {/* Start navbar section */}
          <Navbar links={links} />
          {/* end left section */}
          {/* Start main section */}
          {/* <Route exact path="/admin" component={Students} /> */}
          {/*<Route  path="/admin" component={Students} /> This will made error */}
          <Route exact path="/admin" component={Students} />
          <Route path="/admin/students" component={Students} />{" "}
          {/* If we add exact will make problem */}
          <Route path="/admin/grades" component={Grades} />
          <Route path="/admin/payments" component={Payments} />
          <Route path="/admin/profile/:id" component={StudentProfile} />
        </>
      );
    } else {
      element = <Login />;
    }

    return <div className="admin">{element}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    role: state.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguages: (newLang) =>
      dispatch({ type: TOGGLE_LANG, payload: { lang: newLang } }),
    setRole: (role) => dispatch({ type: TOGGLE_ROLE, payload: { role } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
