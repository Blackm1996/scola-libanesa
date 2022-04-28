import React, { Component } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import axios from "axios";
import swal from "sweetalert";
import "./style.css";

class AddUser extends Component {
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
  };

  onSubmit = (values) => {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const { userAddedSuccess, error1Add, error2Add } =
      this.state.langKeywords[pageLanguage];
    axios
      .post("/user", {
        userName: values.userName,
        password: values.password,
        role: values.userRole,
      })
      .then((response) => {
        if (response.status == 200) {
          swal(userAddedSuccess, {
            icon: "success",
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400)
            swal(error2Add, {
              icon: "error",
            });
        } else
          swal(error1Add, {
            icon: "error",
          });
      });
  };
  // formik form
  form = (props) => {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const {
      userName,
      password,
      passwordWarning,
      passwordConfirm,
      role,
      admin,
      employee,
      manager,
      add,
    } = this.state.langKeywords[pageLanguage];
    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="mx-auto col-lg-6 col-12">
            {/* start User Name */}
            <div className="form-group username">
              <label htmlFor="userName">{userName} : </label>
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
            {/* end User Name */}

            {/* start Password */}
            <div className="form-group password">
              <label htmlFor="password">
                {password} :
                <strong className="password-message">{passwordWarning}</strong>
              </label>
              <Field
                name="password"
                type="text"
                className="form-control"
                id="password"
                placeholder=""
                autoComplete="off"
              />
              <span className="error star-error">
                <ErrorMessage name="password" />
              </span>
            </div>
            {/* end password */}

            {/* start Password confirmation*/}
            <div className="form-group">
              <label htmlFor="password">{passwordConfirm} : </label>
              <Field
                name="passwordConfirmation"
                type="text"
                className="form-control"
                id="passwordConfirmation"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="passwordConfirmation" />
              </span>
            </div>
            {/* end password confirmation */}

            {/* start role section [admin, employee, manager] */}
            <div className="form-group user-role">
              <label htmlForm="userRole">{role} : </label>
              <div className="w-25 float-left mr-2">
                <Field
                  name="userRole"
                  id="userRole"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  {this.props.role == "admin" && (
                    <option value="manager">manager</option>
                  )}
                  {(this.props.role == "admin" ||
                    this.props.role == "manager") && (
                    <option value="employee">employee</option>
                  )}
                  {/*}
                  {[{role: employee, value: "employee"}, {role: admin, value: "admin"}, {role: manager, value: "manager"}].map((item, index) => {
                    return (
                      <option key={index} value={`${ item.value }`}>
                        {item.role}
                      </option>
                    );
                  })}
                  */}
                </Field>
                <span className="error">
                  <ErrorMessage name="userRole" />
                </span>
              </div>
            </div>
            {/* end role section [admin, employee, manager] */}
            {/* Submit Input*/}

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fa fa-plus"></i>
                <span> {add} </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  // Validator
  schema = () => {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const { incorrect, required, passwordMustMatch } =
      this.state.langKeywords[pageLanguage];
    const schema = Yup.object().shape({
      userName: Yup.string().required(required),
      password: Yup.string()
        .required(required)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          //  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          incorrect
        ),

      passwordConfirmation: Yup.string()
        .required(required)
        .oneOf([Yup.ref("password"), null], passwordMustMatch),
    });
    return schema;
  };

  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const { addUser } = this.state.langKeywords[pageLanguage];
    return (
      <div className="add-user">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{addUser}</h2>
          </div>
          {/* Start Formik */}
          <Formik
            initialValues={{
              userName: "",
              password: "",
              passwordConfirmation: "",
              userRole: "employee",
            }}
            onSubmit={this.onSubmit}
            render={this.form}
            validationSchema={this.schema()}
          />
          {/* End Formik */}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
    role: state.role,
  };
};
export default connect(mapStateToProps)(AddUser);
