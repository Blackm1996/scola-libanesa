/* Readable Scalable Secure */
import React, { Component, useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { ENGLISH, FRENCH, PORTO } from "../../../../../../../../../languages";
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import { TOGGLE_LANG } from "../../../../../../../../../redux/actions";
import { connect } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

const initialValues = {
  id: 1,
  First_Name: "mohamad",
  Last_Name: "mohyeddine",
  Tel: "955589998",
  Address: "zrarieh",
  Nationality: "Lebanese",
  Type: "full_time",
  base_salary: 500000,
  debt_pay_perMonth: 0,
  position: "prof",
  is_Working: 1,
  isInstructor: true,
  Major: "Computer Science",
  userName: "DevTeam",
  role: "instructor",
  Birthday: {
    day: "1",
    month: "1",
    year: "1999",
  },
  start_position: {
    day: "1",
    month: "1",
    year: "1999",
  },
  end_position: {
    day: "1",
    month: "1",
    year: "1999",
  },
};
const EditStudent = (props) => {
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const pageLanguage = props?.language;
  const params = useParams();
  const { id } = { ...params };

  useEffect(() => {
    //id && axios.get(`employeeAll/{id}`)
    //3adlo 3a nasa2 state
  }, [id]);

  // Inscription Form
  const form = (props) => {
    const { months } = { ...langKeywords[pageLanguage] };

    var days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }

    //YearsemployeeAll/{id}
    var years = [];
    let ye = new Date().getFullYear();
    for (let i = 0; i <= 25; i++) {
      years.push(ye - i);
    }

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="first-section col-lg-6 col-12">
            <div className="form-group">
              {" "}
              <label htmlFor="firstName">First name</label>
              <Field
                name="First_Name"
                type="text"
                className="form-control"
                id="firstName"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="First_Name" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="LastName">Last name</label>
              <Field
                name="Last_Name"
                type="text"
                className="form-control"
                id="lastName"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="Last_Name" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="tel">Tel</label>
              <Field
                name="Tel"
                type="text"
                className="form-control"
                id="tel"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="Tel" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="address">Address</label>
              <Field
                name="Address"
                type="text"
                className="form-control"
                id="address"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="Address" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="nationnality">Nationality</label>
              <Field
                name="Nationality"
                type="text"
                className="form-control"
                id="nationnality"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="Nationality" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="type">Type</label>
              <Field
                name="Type"
                type="text"
                className="form-control"
                id="type"
                placeholder=""
                autoComplete="off"
                component="select"
              >
                <option value="full_time">Full time</option>
                <option value="hourly">Hourly</option>
              </Field>
              <span className="error">
                <ErrorMessage name="Type" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="baseSalary">Base Salary</label>
              <Field
                name="base_salary"
                type="text"
                className="form-control"
                id="baseSalary"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="base_salary" />
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <Field
                name="role"
                id="role"
                className="form-control"
                component="select"
              >
                <option value="instructor">Instructor</option>
              </Field>
              <span className="error">
                <ErrorMessage name="monthStart" />
              </span>
            </div>
            <div className="form-group birth-date">
              <label htmlFor="firstName">birth Date</label>
              <div className="w-25 float-left mr-2">
                <Field
                  name="Birthday.day"
                  id="Birthday.day"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {days.map((item, index) => {
                    return (
                      <option key={index} value={`${index + 1}`}>
                        {item}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="Birthday.day" />
                </span>
              </div>
              <div className="w-25 float-left mr-2">
                <Field
                  name="Birthday.month"
                  id="Birthday.month"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {months.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="Birthday.month" />
                </span>
              </div>
              <div className="w-25 float-left">
                <Field
                  name="Birthday.year"
                  id="Birthday.year"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {years.map((item, index) => {
                    return (
                      <option key={index} value={`${item}`}>
                        {item}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="Birthday.year" />
                </span>
              </div>
            </div>
          </div>
          <div className="first-section col-lg-6 col-12">
            <div className="form-group">
              {" "}
              <label htmlFor="debtPayPerMonth">Debt pay per month</label>
              <Field
                name="debt_pay_perMonth"
                type="number"
                className="form-control"
                id="debtPayPerMonth"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="debt_pay_perMonth" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="position">Position</label>
              <Field
                name="position"
                type="text"
                className="form-control"
                id="position"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="position" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="working">Working</label>
              <Field
                name="is_Working"
                type="text"
                component="select"
                className="form-control"
                id="working"
                placeholder=""
                autoComplete="off"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Field>
              <span className="error">
                <ErrorMessage name="is_Working" />
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="isInstructor">is Instructor</label>
              <Field
                name="isInstructor"
                id="isInstructor"
                className="form-control"
                component="select"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Field>
              <span className="error">
                <ErrorMessage name="isInstructor" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="major">Major</label>
              <Field
                name="Major"
                type="text"
                className="form-control"
                id="major"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="Major" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="userName">userName</label>
              <Field
                name="userName"
                type="text"
                className="form-control"
                id="userName"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="userName" />
              </span>
            </div>
            <div className="form-group">
              {" "}
              <label htmlFor="baseSalary">Base Salary</label>
              <Field
                name="base_salary"
                type="number"
                className="form-control"
                id="baseSalary"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="base_salary" />
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="start_position">start Position</label>
              <div className="w-25 float-left mr-2">
                <Field
                  name="start_position.day"
                  id="start_position.day"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {days.map((item, index) => {
                    return (
                      <option key={index} value={`${index + 1}`}>
                        {item}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="start_position.day" />
                </span>
              </div>
              <div className="w-25 float-left mr-2">
                <Field
                  name="start_position.month"
                  id="start_position.month"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {months.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="start_position.month" />
                </span>
              </div>
              <div className="w-25 float-left">
                <Field
                  name="start_position.year"
                  id="start_position.year"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {years.map((item, index) => {
                    return (
                      <option key={index} value={`${item}`}>
                        {item}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="start_position.year" />
                </span>
              </div>
            </div>
            <div className="form-group birth-date">
              <label htmlFor="end_position">End Position</label>
              <div className="w-25 float-left mr-2">
                <Field
                  name="end_position.day"
                  id="end_position.day"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {days.map((item, index) => {
                    return (
                      <option key={index} value={`${index + 1}`}>
                        {item}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="end_position.day" />
                </span>
              </div>
              <div className="w-25 float-left mr-2">
                <Field
                  name="end_position.month"
                  id="end_position.month"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {months.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="end_position.month" />
                </span>
              </div>
              <div className="w-25 float-left">
                <Field
                  name="end_position.year"
                  id="end_position.year"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {years.map((item, index) => {
                    return (
                      <option key={index} value={`${item}`}>
                        {item}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="end_position.year" />
                </span>
              </div>
            </div>
          </div>
          <div className="form-group col-12">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              id="test"
            >
              <i className="fa fa-user-plus "></i>
              <span>update</span>
            </button>
          </div>
        </div>
      </form>
    );
  };

  const onSubmit = (values) => {
    console.log("values", values);
  };

  return (
    <div className="inscription-student">
      <div className="container-fluid">
        <div className="col-12 text-center">
          <div className="title-of-middle">
            <h2>update</h2>
          </div>
        </div>

        {/* Start Formik */}
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={onSubmit}
          //validationSchema={schema}
        >
          {form}
        </Formik>
        {/* End Formik */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
    schoolYear: state.schoolYear,
    role: state.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguages: (newLang) =>
      dispatch({ type: TOGGLE_LANG, payload: { lang: newLang } }),
  };
};

// export default connect(mapStateToProps, mapDispatchToProps)(EditStudent);
export default connect(mapStateToProps)(EditStudent);
