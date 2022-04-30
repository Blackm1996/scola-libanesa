/* Readable Scalable Secure */
import React, { Component } from "react";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { addPublicStudentFile } from "../../../../Api/StudentsPublicFile";
import swal from "sweetalert";

class inscriptionStudent extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    idURL: null,
    vaccineURL: null,
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  };

  // Submit Form
  onSubmit = (values) => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { successAdd, error1Add, error2Add } =
      this.state.langKeywords[pageLanguage];
    // date after concat day with month with year [ex 1-1-2008]
    var appendedDate = `${values.birthDate.day}-${values.birthDate.month}-${values.birthDate.year}`;

    let formData = new FormData();
    formData.append("First_Name", values.firstName);
    formData.append("Last_Name", values.lastName);
    // birthdate
    formData.append("Birthday", appendedDate); //appendedDate
    formData.append("Sex", values.sex);
    formData.append("Tel", values.phoneNum);
    formData.append("Birthplace", values.birthPlace);
    formData.append("Teuteur", values.tuteur);
    if (values.idURL != "") formData.append("ID_URL", values.idURL);
    if (values.vaccineURL != "")
      formData.append("Vaccine_URL", values.vaccineURL);

    addPublicStudentFile(formData)
      .then((response) => {
        //student added
        if (response.status == 201) {
          swal(successAdd, {
            icon: "success",
          });
          this.props.history.push(
            `/admin/profile/${response.data.id}/inscription`
          );
        } else {
          // student exist
          if (response.status == 200)
            swal(error2Add, {
              icon: "error",
            });
          else
            swal(error1Add, {
              icon: "error",
            });
        }
      })
      .catch((error) => {
        swal(error1Add, {
          icon: "error",
        });
      });
  };

  // Inscription Form

  form = (props) => {
    //days array
    var days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }

    //Years
    var years = [];
    for (let i = 1980; i <= 2030; i++) {
      years.push(i);
    }

    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      //titlePage,
      name,
      prename,
      birthDate,
      sexLabel,
      phoneNumber,
      classLevel,
      placeOfBirth,
      guardian,
      uniformBooks,
      registerFees,
      monthlyPayment,
      beginMonthPay,
      studentId,
      vaccination,
      add,
      months,
      sex,
    } = this.state.langKeywords[pageLanguage];

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="first-section col-lg-6 col-12">
            
            {/* Student prename */}
            <div className="form-group">
              <label htmlFor="firstName">{prename}</label>
              <Field
                name="firstName"
                type="text"
                className="form-control"
                id="firstName"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="firstName" />
              </span>
            </div>

            {/* Student Name */}
            <div className="form-group">
              <label htmlFor="lastName">{name}</label>
              <Field
                name="lastName"
                type="text"
                className="form-control"
                id="lastName"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="lastName" />
              </span>
            </div>

            {/* Date of birthday  */}
            <div className="form-group birth-date">
              <label htmlFor="firstName">{birthDate}</label>

              {/* Day */}
              <div className="w-25 float-left mr-2">
                <Field
                  name="birthDate.day"
                  id="birthDate.day"
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
                  <ErrorMessage name="birthDate.day" />
                </span>
              </div>

              {/* Months */}
              <div className="w-25 float-left mr-2">
                <Field
                  name="birthDate.month"
                  id="birthDate.month"
                  className="form-control"
                  component="select"
                  defaultValue=""
                >
                  <option value=""></option>
                  {this.state.months.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Field>
                <span className="error">
                  <ErrorMessage name="birthDate.month" />
                </span>
              </div>

              {/* Year */}
              <div className="w-25 float-left">
                <Field
                  name="birthDate.year"
                  id="birthDate.year"
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
                  <ErrorMessage name="birthDate.year" />
                </span>
              </div>
            </div>

            {/* Student sex */}
            <div className="form-group">
              <label htmlFor="sex">{sexLabel}</label>
              <Field
                name="sex"
                id="sex"
                className="form-control"
                component="select"
              >
                <option value=""></option>
                {sex.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {" "}
                      {item.name}
                    </option>
                  );
                })}
              </Field>
              <span className="error">
                <ErrorMessage name="sex" />
              </span>
            </div>

            {/* Student phone number */}
            <div className="form-group">
              <label htmlFor="phoneNum">{phoneNumber}</label>
              <Field
                name="phoneNum"
                type="text"
                className="form-control"
                id="phoneNum"
                placeholder="ex: 77777-55555"
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
                pattern="^[0-9-]*[0-9]$"
              />
              <span className="error">
                <ErrorMessage name="phoneNum" />
              </span>
            </div>
          </div>

          <div className="first-section col-lg-6 col-12">
            {/* Place of birthday */}
            <div className="form-group">
              <label htmlFor="birthPlace">{placeOfBirth}</label>
              <Field
                name="birthPlace"
                type="text"
                className="form-control"
                id="birthPlace"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="birthPlace" />
              </span>
            </div>

            {/* Turteur */}
            <div className="form-group">
              <label htmlFor="tuteur">{guardian}</label>
              <Field
                name="tuteur"
                type="text"
                className="form-control"
                id="tuteur"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="tuteur" />
              </span>
            </div>

            {/* Student Id */}
            <div className="form-group">
              <label htmlFor="idURL">{studentId}</label>
              <input
                name="idURL"
                type="file"
                className="form-control-file w-50 float-left"
                id="idURL"
                accept="image/*"
                placeholder={studentId}
                onChange={(event) => {
                  let img = event.target.files[0];
                  props.setFieldValue("idURL", event.currentTarget.files[0]);
                  this.setState({
                    idURL: URL.createObjectURL(img),
                  });
                }}
              />
              <span className="error">
                <ErrorMessage name="idURL" />
              </span>

              <img className="upload-img" src={this.state.idURL} />
            </div>

            {/* Vaccination */}
            <div className="form-group">
              <label htmlFor="vaccineURL">{vaccination}</label>
              <input
                name="vaccineURL"
                type="file"
                className="form-control-file w-50 float-left"
                id="vaccineURL"
                accept="image/*"
                placeholder={vaccination}
                onChange={(event) => {
                  let img = event.target.files[0];
                  props.setFieldValue(
                    "vaccineURL",
                    event.currentTarget.files[0]
                  );
                  this.setState({
                    vaccineURL: URL.createObjectURL(img),
                  });
                }}
              />
              <span className="error">
                <ErrorMessage name="vaccineURL" />
              </span>

              <img className="upload-img" src={this.state.vaccineURL} />
            </div>
          </div>

          {/* Submit Input*/}
          <div className="form-group col-12">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              id="test"
            >
              <i className="fa fa-user-plus "></i>
              <span>{add}</span>
            </button>
          </div>
        </div>
      </form>
    );
  };

  // Schema Of Yup
  schema = () => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { required, number } = this.state.langKeywords[pageLanguage];

    const schema = Yup.object().shape({
      firstName: Yup.string().required(required),
      lastName: Yup.string().required(required),
      // birthPlace: Yup.string().required(required),
      birthDate: Yup.object().shape({
        day: Yup.string().required(required),
        month: Yup.string().required(required),
        year: Yup.string().required(required),
      }),
      // sex: Yup.string().required(required),
      // phoneNum: Yup.number()
      //   .typeError(number)
      //   .required(required),
      // tuteur: Yup.string().required(required),
      // vaccineURL: Yup.mixed().required(required),
      // idURL: Yup.mixed().required(required),
    });
    return schema;
  };

  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // All Name

    const {
      titlePage,
      name,
      classLevel,
      birthDate,
      sex,
      uniformBooks,
      guardian,
      prename,
      vaccination,
      studentId,
      phoneNumber,
      placeOfBirth,
      registerFees,
      monthlyPayment,
      beginMonthPay,
    } = this.state.langKeywords[pageLanguage];
    return (
      <div className="inscription-student">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <div className="title-of-middle">
              <h2>{titlePage}</h2>
            </div>
          </div>

          {/* Start Formik */}
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              birthDate: {
                day: "",
                month: "",
                year: "",
              },
              birthPlace: "",
              sex: "",
              phoneNum: "",
              tuteur: "",
              vaccineURL: "",
              idURL: "",
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
  };
};

export default connect(mapStateToProps)(inscriptionStudent);
