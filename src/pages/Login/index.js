/* Readable Scalable Secure */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { setUserSession } from "../../Utils/Common/common.js";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { getToken } from "../../Utils/Common/common";
import {
  TOGGLE_ID_INSTRUCTOR,
  TOGGLE_LANG,
  TOGGLE_ROLE,
} from "../../redux/actions";
// Import Languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
import "./style.css";

const Login = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  useEffect(() => {
    //alert('username: admin / password: 123');

    if (getToken() !== null) {
      history.push("/admin");
    } else {
      // for testing websites
      /*
      alert(
        `     
       username: admin90
       password: 123aaaa@A
      `
      );
      */
    }
  }, []);
  // handle button click of login form
  const handleLogin = (e) => {
    //user role
    var role = "";

    e.preventDefault();
    setError(null);
    setLoading(true);
    axios
      .post("/auth/login", {
        email: username.value,
        password: password.value,
      })
      .then((response) => {
        localStorage.clear();

        setLoading(false);
        //console.log(jwt_decode(response.data.jwt));
        //console.log(response.data.access_token);
        //console.log(props.history.push('/dashboard'));
        setUserSession(response.data.jwt, response.data.access_token);

        // mo2akatan
        localStorage.setItem("new", true);
        //set user role in redux
        props.toggleRole("employee");

        //set user role in cookie
        localStorage.setItem("role", response.data.role);
        role = response.data.role;

        //push history for specifix role
        if (role == "instructor") {
          // id teacher
          var idTeacher = response.data.id_instructor;
          if (Number.isInteger(idTeacher)) {
            props.toggleRole("instructor");
            props.toggleInstructorId(idTeacher);
            localStorage.setItem("id", idTeacher);
            history.push(`/teacher`);
          }
        } else history.push("/admin");

        // find if the lang is present in cookie or not if not set the default lang in redux is ENG

        //history.push("/admin");
        if (localStorage.getItem("language") != null) {
          const globalLang = localStorage.getItem("language");
          props.handleLangToggle(globalLang);
        } else {
          // set the default lang in redux and in localstorage is ENG
          localStorage.setItem("language", ENGLISH);
          props.handleLangToggle(ENGLISH);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message === "Invalid token specified");
        if (error === "") setError("Invalid token specified");
        else setError("Something went wrong. Please try again later.");
      });
  };

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          {/* start accounts section 
          <div className="text-center w-100 pt-5">
            <h4>Admin Account : </h4>
            <p>username: admin90 / password: 123aaaa@A</p>
            <h4>Teacher Account : </h4>
            <p>username: user818 / password: 123aaaa@A</p>
          </div>
          end accounts section */}
          <div className="signin">
            <h3 className="text-center">Login</h3>
            <br />
            <form>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="text"
                        {...username}
                        placeholder="username"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="password"
                        {...password}
                        placeholder="password"
                        className="form-control"
                      />
                      {error && (
                        <>
                          <small style={{ color: "red" }}>{error}</small>
                          <br />
                        </>
                      )}
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        className="btn btn-primary btn-block"
                        type="submit"
                        value={loading ? "Loading..." : "Login"}
                        onClick={handleLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/*
                    <form>
                        <input type='text' placeholder='Name' onChange={this.handleUsername} autocomplete='on' />
                        <input type='password' placeholder='password' onChange={this.handlePassword} />
                        <input type='submit' className='btn-primary' value='login' onClick={this.Login} />
                    </form>
                    
                    */}
    </div>
  );
};

// User form input
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

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

    toggleRole: (role) => dispatch({ type: TOGGLE_ROLE, payload: { role } }),

    toggleInstructorId: (idInstructor) =>
      dispatch({ type: TOGGLE_ID_INSTRUCTOR, payload: { idInstructor } }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
