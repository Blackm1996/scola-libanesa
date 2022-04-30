/* Readable Scalable Seure */
import React, { Component, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
// Import Logout Page
import Logout from "../../pages/Logout";
//Import Language Component
import LangComponent from "./LangComponent";
// Import Style
import "./style.css";
// test select lang
import logoImg from "../../images/school-logo2.png";
//import logoImg from "../../images/logo-school.png";
//import logoImg from "../../images/logo-school3.png";
import LanguageMenu from "../../components/TeacherAppBar/LanguageMenu";

const NavLinks = (props) => {
  const links = props.links;

  /*
  //Links values
  const links = [
    { linkName: "Add Student", to: "/dashboard/addstudent" },
    { linkName: "Add Grade", to: "/dashboard/addgrade" },
  ];
  */

  const [activeLinks, setActive] = useState([]);

  //use effect
  useEffect(() => {
    links.map((link, index) =>
      index === 0 ? (activeLinks[index] = "active") : (activeLinks[index] = " ")
    );
  }, []);

  // On Click Func
  const onClickLink = (e) => {
    e.stopPropagation();
    let newActiveLinks = [];
    for (let i = 0; i < activeLinks.length; i++) {
      e.target.id == i
        ? (newActiveLinks[i] = "active")
        : (newActiveLinks[i] = " ");
    }
    setActive([...newActiveLinks]);
  };
  return (
    <div className="middle-section">
      <ul className="navbar-nav">
        {links.map((link, index) => (
          <li key={index} className={`nav-item ${activeLinks[index]}`}>
            <Link
              to={links[index].to}
              id={index}
              className={`nav-item`}
              onClick={onClickLink}
            >
              {links[index].linkName}
            </Link>
            <span></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

class Navbar extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
  };
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      home,
      students,
      addProfile,
      allStudent,
      grades,
      addGrade,
      logOut,
      newID,
      users,
      newUser,
      addSection,
      notPayed,
      newTeacher,
      expenses,
      addExpense,
      viewExpenses,
      viewBills,
      addTrimester,
      settingsOfYear,
      controlePanel,
      allUsers,
      allTeachers,
    } = this.state.langKeywords[pageLanguage];

    return (
      <>
        {/* Start Bootstrap navbar */}
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="left-section col-2">
            <div className="image">
              <Link to="/admin">
                <img src={logoImg} alt="elissa school logo" />
              </Link>
            </div>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Middle section*/}
            {/* <NavLinks links={props.links} />  */}

            {/* start testing sub navbar*/}
            <div className="middle-section">
              <div className="navbar-2">
                <Link className="active" to="/admin">
                  {home}
                </Link>
                <div className="subnav">
                  <button className="subnavbtn">
                    {students} <i className="fa fa-caret-down"></i>
                  </button>
                  <div className="subnav-content">
                    <Link to="/admin">
                      <i className="fa fa-eye"></i> {allStudent}
                    </Link>
                    <Link to="/admin/students/add">
                      <i className="fa fa-user-plus"></i> {newID}
                    </Link>

                    <Link to="/admin/students/notpayed">
                      <i className="fa fa-dollar"></i> {notPayed}
                    </Link>
                  </div>
                </div>
                <div className="subnav">
                  <button className="subnavbtn">
                    {grades} <i className="fa fa-caret-down"></i>
                  </button>
                  <div className="subnav-content">
                    {/* hide add className if user isn`t admin */}
                    {this.props.role == "admin" && (
                      <Link to="/admin/grades/add">
                        <i className="fa fa-plus"></i>
                        {addGrade}
                      </Link>
                    )}
                    <Link to="/admin/students/distribution">
                      <i className="fa fa-users"></i> {"  "}
                      {addSection}
                    </Link>
                  </div>
                </div>
                {/* start users section */}
                {(this.props.role == "admin" ||
                  this.props.role == "manager") && (
                  <div className="subnav">
                    <button className="subnavbtn">
                      {users} <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="subnav-content">
                      <Link to="/admin/students/adduser">
                        <i className="fa fa-user-plus"></i> {newUser}
                      </Link>
                      <Link to="/admin/students/addteacher">
                        <i className="fa fa-user-plus"></i> {newTeacher}
                      </Link>
                      <Link to="/admin/students/teachers">
                        <i className="fa fa-users"></i> {allTeachers}
                      </Link>
                      <Link to="/admin/students/users">
                        <i className="fa fa-users"></i> {allUsers}
                      </Link>
                    </div>
                  </div>
                )}
                {/* end users section */}
                {/* start expenses section */}

                {(this.props.role == "admin" ||
                  this.props.role == "manager") && (
                    <div className="subnav">
                  <button className="subnavbtn">
                    {expenses} <i className="fa fa-caret-down"></i>
                  </button>
                  <div className="subnav-content">
                    <Link to="/admin/students/addexpense">
                      <i className="fa fa-dollar"></i> {addExpense}
                    </Link>
                    <Link to="/admin/students/viewexpenses">
                      <i className="fa fa-eye"></i> {viewExpenses}
                    </Link>
                    <Link to="/admin/students/viewbills">
                      <i className="fa fa-eye"></i> {viewBills}
                    </Link>
                  </div>
                </div>
                  )}
                

                {/* end expenses section */}
                {/* start controle panel section */}
                {this.props.role == "admin" && (
                  <div className="subnav">
                    <button
                      className="subnavbtn"
                      // onClick={() =>
                      //   this.props.history.push(`/admin/students/schoolyear`)
                      // }
                    >
                      {controlePanel}
                    </button>
                    <div className="subnav-content justify-content-end">
                      <div
                        style={{
                          width: "fit-content",
                          marginRight: "116px",
                          overflow: "hidden",
                        }}
                      >
                        <Link to="/admin/students/trimester">
                          <i className="fa fa-plus"></i> {addTrimester}
                        </Link>
                        <Link to="/admin/students/schoolyear">
                          <i className="fa fa-cog"></i> {settingsOfYear}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* end control panel section */}
              </div>
            </div>
            {/* end testing sub navbar*/}

            {/* Start Right section*/}

            <div className="right-section d-flex">
              <div>
                <LanguageMenu />
              </div>
              <Logout logOut={logOut} />
            </div>
          </div>
        </nav>

        {/* End Bootstrap navbar */}
        {/* 
            <nav className='nav-bar'>
                <h1>
                    <a href="#"> Notre Echool</a>
                </h1>
                <Logout />
            </nav>       
            
            */}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
    role: state.role,
  };
};
export default connect(mapStateToProps)(withRouter(Navbar));
