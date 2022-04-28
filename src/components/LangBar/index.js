import React, { Component } from "react";
//import { getUser, removeUserSession } from '../../Utils/Common/common.js';
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../Navbar/index.js";
import LeftComponent from "../LeftComponent";
import MiddleComponent from "../MiddleComponent";
import RightComponent from "../RightComponent";
import { TOGGLE_LANG } from "../../redux/actions";
// Import Languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
import "./style.css";

// Language Component
const LangName = (props) => {
  const langName = props.langName;
  if (langName === PORTO) {
    return (
      <a onClick={() => props.handleLangToggle(langName)}> {props.langName} </a>
    );
  }
  return (
    <a onClick={() => props.handleLangToggle(langName)}> {props.langName} |</a>
  );
};

class LangBar extends Component {
  // handle Languages Toggle
  handleLangToggle = (newLang) => {
    this.props.toggleLanguages(newLang);
    
    // set language in local storage
    localStorage.setItem("language", newLang);
  };
  render() {
    return (
        <div className="dashboard d-print-none"> {/* d-print-none for hiding this when we print */}
          {/* Welcome {user.name}!<br /><br /> */}
          {/* <input type="button" onClick={handleLogout} value="Logout" /> */}
          <ul className="langs">
            <li>
              <LangName
                langName={ENGLISH}
                handleLangToggle={this.handleLangToggle}
              />
            </li>
            <li>
              <LangName
                langName={FRENCH}
                handleLangToggle={this.handleLangToggle}
              />
            </li>
            <li>
              <LangName
                langName={PORTO}
                handleLangToggle={this.handleLangToggle}
              />
            </li>
          </ul>
        </div>
    );
  }
}
const mapStateToProps = (state) => {
  //console.log(state);
  return {
    language: state,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguages: (newLang) =>
      dispatch({ type: TOGGLE_LANG, payload: { lang: newLang } }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LangBar);
