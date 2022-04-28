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
import axios from "axios";

class inscriptionStudent extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    classesName: ["", "Grade a", "Grade b", "Grade c", "Grade d"],
    idStudImage: null,
    vaccinationImg: null,
  };

  // Submit Form
  onSubmit = (values) => {
    console.log("hello from submit");
    //console.log(values);
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("prename", values.prename);
    formData.append("birthDate", values.birthDate);
    formData.append("sex", values.sex);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("className", values.class);
    formData.append("placeOfBirth", values.placeOfBirth);
    formData.append("uniformBooks", values.uniformBooks);
    formData.append("registerFees", values.registerFees);
    formData.append("monthlyPayment", values.monthlyPayment);
    formData.append("beginMonthPay", values.beginMonthPay);
    formData.append("studentId", values.studentId);
    formData.append("vaccination", values.vaccination);
    axios({
      method: "post",
      //"http://test-appschool.ml/test-upload/response.php"
      //
      url: "http://appschool.ml/test-upload/response.php",
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    })
      .then(function (response) {
        //handle success
        console.log(response.data);
      })
      .catch(function (response) {
        //handle error
        console.log(response.data);
      });
  };

  // Inscription Form

  form = (props) => {
    // Page Lang

    const pageLanguage = this.props.language;

    // Language KEywords

    const {
      //titlePage,
      name,
      prename,
      birthDate,
      sex,
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
    } = this.state.langKeywords[pageLanguage];

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="first-section col-lg-6 col-12">
            {/* Student Name */}

            <div className="form-group">
              <label htmlFor="nameStudent">{name}</label>
              <Field
                name="name"
                type="text"
                className="form-control"
                id="nameStudent"
                placeholder={name}
              />
              <span className="error">
                <ErrorMessage name="name" />
              </span>
            </div>

            {/* Student prename */}

            <div className="form-group">
              <label htmlFor="prenameStudent">{prename}</label>
              <Field
                name="prename"
                type="text"
                className="form-control"
                id="prenameStudent"
                placeholder={prename}
              />
              <span className="error">
                <ErrorMessage name="prename" />
              </span>
            </div>

            {/* Student birthday */}
            <div className="form-group">
              <label htmlFor="studentBirth">{birthDate}</label>
              <Field
                name="birthDate"
                type="date"
                className="form-control"
                id="studentBirth"
                placeholder={birthDate}
              />
              <span className="error">
                <ErrorMessage name="birthDate" />
              </span>
            </div>

            {/* Student sex */}
            <div className="form-group">
              <label htmlFor="studentSex">{sex}</label>
              <Field
                name="sex"
                id="studentSex"
                className="form-control"
                component="select"
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
              <span className="error">
                <ErrorMessage name="sex" />
              </span>
            </div>

            {/* Student phone number */}
            <div className="form-group">
              <label htmlFor="studentPhone">{phoneNumber}</label>
              <Field
                name="phoneNumber"
                type="number"
                className="form-control"
                id="studentPhone"
                placeholder={phoneNumber}
              />
              <span className="error">
                <ErrorMessage name="phoneNumber" />
              </span>
            </div>
            {/* class */}

            <div className="form-group">
              <label htmlFor="classLevel">{classLevel}</label>
              <Field
                name="class"
                id="classLevel"
                className="form-control"
                component="select"
              >
                {this.state.classesName.map((className, index) => (
                  <option key={index} value={className}>
                    {className}
                  </option>
                ))}
              </Field>
              <span className="error">
                <ErrorMessage name="class" />
              </span>
            </div>

            {/* Vaccination */}
            <div className="form-group">
              <label htmlFor="studentVacc">{vaccination}</label>
              <input
                name="vaccination"
                type="file"
                className="form-control-file"
                id="studentVacc"
                accept="image/*"
                placeholder={vaccination}
                onChange={(event) => {
                  let img = event.target.files[0];
                  props.setFieldValue(
                    "vaccination",
                    event.currentTarget.files[0]
                  );
                  this.setState({
                    vaccinationImg: URL.createObjectURL(img),
                  });
                }}
              />
              <span className="error">
                <ErrorMessage name="vaccination" />
              </span>

              <img className="upload-img" src={this.state.vaccinationImg} />
            </div>
          </div>
          <div className="first-section col-lg-6 col-12">
            {/* Place of birthday */}

            <div className="form-group">
              <label htmlFor="birthPlace">{placeOfBirth}</label>
              <Field
                name="placeOfBirth"
                type="text"
                className="form-control"
                id="birthPlace"
                placeholder={placeOfBirth}
              />
              <span className="error">
                <ErrorMessage name="placeOfBirth" />
              </span>
            </div>
            
            {/* Guardian name */}
            <div className="form-group">
              <label htmlFor="stuGuardian">{guardian}</label>
              <Field
                name="guardian"
                type="text"
                className="form-control"
                id="stuGuardian"
                placeholder={guardian}
              />
              <span className="error">
                <ErrorMessage name="guardian" />
              </span>
            </div>
            {/* Uniform books */}

            <div className="form-group">
              <label htmlFor="stUniformBooks">{uniformBooks}</label>
              <Field
                name="uniformBooks"
                type="number"
                className="form-control"
                id="stUniformBooks"
                placeholder={uniformBooks}
              />
              <span className="error">
                <ErrorMessage name="uniformBooks" />
              </span>
            </div>
            {/* Register fees  */}

            <div className="form-group">
              <label htmlFor="stuRegisterFees">{registerFees}</label>
              <Field
                name="registerFees"
                type="number"
                className="form-control"
                id="stuRegisterFees"
                placeholder={registerFees}
              />
              <span className="error">
                <ErrorMessage name="registerFees" />
              </span>
            </div>

            {/* Monthly Payment  */}

            <div className="form-group">
              <label htmlFor="stuMonthlyPayment">{monthlyPayment}</label>
              <Field
                name="monthlyPayment"
                type="number"
                className="form-control"
                id="stMonthlyPayment"
                placeholder={monthlyPayment}
              />
              <span className="error">
                <ErrorMessage name="monthlyPayment" />
              </span>
            </div>

            {/* Date of beginning monthly payment  */}

            <div className="form-group">
              <label htmlFor="beginMonthPay">{beginMonthPay}</label>
              <Field
                name="beginMonthPay"
                id="beginMonthPay"
                className="form-control"
                component="select"
              >
                {[
                  "",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ].map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </Field>
              <span className="error">
                <ErrorMessage name="beginMonthPay" />
              </span>
            </div>

            {/* Student Id */}

            <div className="form-group">
              <label htmlFor="studentId">{studentId}</label>
              <input
                name="studentId"
                type="file"
                className="form-control-file"
                id="studentId"
                accept="image/*"
                placeholder={studentId}
                onChange={(event) => {
                  let img = event.target.files[0];
                  props.setFieldValue(
                    "studentId",
                    event.currentTarget.files[0]
                  );
                  this.setState({
                    idStudImage: URL.createObjectURL(img),
                  });
                }}
              />
              <span className="error">
                <ErrorMessage name="studentId" />
              </span>

              <img className="upload-img" src={this.state.idStudImage} />
            </div>

            {/* Submit Input*/}

            <div className="form-group">
              <input
                  type="submit"
                  className="btn btn-primary btn-block"
                  value="Enregsiter"
                />
            </div>
            
          </div>
        </div>
      </form>
    );
  };

  // Schema Of Yup
  schema = () => {
    //Show required *

    const required = "* required";
    const schema = Yup.object().shape({
      name: Yup.string().required(required),
      prename: Yup.string().required(required),
      birthDate: Yup.string().required(required),
      sex: Yup.string().required(required),
      phoneNumber: Yup.number()
        .typeError("accept numbers only")
        .required(required),
      class: Yup.string().required(required),
      placeOfBirth: Yup.string().required(required),
      guardian: Yup.string().required(required),
      uniformBooks: Yup.number().required(required),
      registerFees: Yup.number().required(required),
      monthlyPayment: Yup.number().required(required),
      beginMonthPay: Yup.number().required(required),
      studentId: Yup.mixed().required(required),
      vaccination: Yup.mixed().required(required),
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
            <div className="inscription-title">
              <h2>{titlePage}</h2>
            </div>
          </div>
          {/* Start Formik */}
          <Formik
            initialValues={{
              name: "",
              prename: "",
              birthDate: "",
              sex: "",
              phoneNumber: "",
              class: "",
              placeOfBirth: "",
              guardian: "",
              uniformBooks: "",
              registerFees: "",
              monthlyPayment: "",
              beginMonthPay: "",
              studentId: "",
              vaccination: "",
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
<div className="form-group">
  <label for="exampleInputEmail1">Email address</label>
  <input
    type="email"
    className="form-control"
    id="exampleInputEmail1"
    aria-describedby="emailHelp"
    placeholder="Enter email"
  />
</div>;
