/* Readable Scalable Secure */
import React, { Component } from "react";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "../Add/LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { TOGGLE_LANG } from "../../../../redux/actions";
import swal from "sweetalert";

class EditStudent extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    student: {},
    idURL: null,
    vaccineURL: null,
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  };

  componentDidMount = () => {
    // Page Lang
    const pageLanguage = this.props.language;

    // All Name

    const { error1Add } = this.state.langKeywords[pageLanguage];

    /* start Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    // get language from local storage
    const globalLang = localStorage.getItem("language");
    if (globalLang != null) {
      // when we click update button we should update the update and we need to set language in redux from localstorage
      this.props.toggleLanguages(globalLang);
    }
    /* end Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    const studentID = this.props.match.params.id;
    axios
      .get(
        `/student/${studentID}`
      )
      .then((response) => {
        //const id, firstName, lastName, birthDate, birthPlace, phoneNum, sex, tuteur, idURL, vaccineURL;

        //getted student details
        const student = response.data;

        const id = student.id;
        const firstName = student.First_Name;
        const lastName = student.Last_Name;

        // birthdate
        var birthDate = student.Birthday;

        if (birthDate == "--") {
          birthDate = {
            day: "",
            month: "",
            year: "",
          };
        } else {
          const splitBirthday = birthDate.split("-");
          const day = splitBirthday[0];
          const month = splitBirthday[1];
          const year = splitBirthday[2];

          birthDate = {
            day: splitBirthday[0],
            month: splitBirthday[1],
            year: splitBirthday[2],
          };
        }

        //birthplace
        const birthPlace = student.Birthplace == null ? "" : student.Birthplace;

        //phone number
        const phoneNum = student.Tel == null ? "" : student.Tel;

        //sex
        const sex = student.Sex == null ? "" : student.Sex;
        //tuteur
        const tuteur = student.Teuteur == null ? "" : student.Teuteur;
        //idURL
        const idURL =
          student.ID_URL == null
            ? ""
            : `https://management.escola-libanesa.com/test2/project/storage/app/${student.ID_URL}`;
        //vaccineURL
        const vaccineURL =
          student.ID_URL == null
            ? ""
            : `https://management.escola-libanesa.com/test2/project/storage/app/${student.Vaccine_URL}`;
        // getted birthday
        const birth = response.data.Birthday;

        this.setState({
          student: {
            id,
            firstName,
            lastName,
            birthDate,
            birthPlace,
            phoneNum,
            sex,
            tuteur,
            idURL,
            vaccineURL,
          },
          idURL,
          vaccineURL,
        });
      })
      .catch((error) => {
        swal(error1Add, { icon: "error" });
      });
    // splid birthday
  };

  // Create Blob file from URL
  blobCreationFromURL = (inputURI) => {
    var binaryVal;

    // mime extension extraction
    var inputMIME = inputURI.split(",")[0].split(":")[1].split(";")[0];

    // Extract remaining part of URL and convert it to binary value
    if (inputURI.split(",")[0].indexOf("base64") >= 0)
      binaryVal = atob(inputURI.split(",")[1]);
    // Decoding of base64 encoded string
    else binaryVal = unescape(inputURI.split(",")[1]);

    // Computation of new string in which hexadecimal
    // escape sequences are replaced by the character
    // it represents

    // Store the bytes of the string to a typed array
    var blobArray = [];
    for (var index = 0; index < binaryVal.length; index++) {
      blobArray.push(binaryVal.charCodeAt(index));
    }

    return new Blob([blobArray], {
      type: inputMIME,
    });
  };

  // Submit Form
  onSubmit = (values) => {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const { updateMessage, successUpdate, error1 } =
      this.state.langKeywords[pageLanguage];
    // student id
    const studentID = this.props.match.params.id;

    //date submitted
    var appendedDate;
    var birthDate = values.birthDate;

    appendedDate = `${values.birthDate.day}-${values.birthDate.month}-${values.birthDate.year}`;

    let formData = new FormData();
    formData.append("First_Name", values.firstName);
    formData.append("Last_Name", values.lastName);
    formData.append("Birthday", appendedDate);
    formData.append("Sex", values.sex);
    formData.append("Tel", values.phoneNum);
    formData.append("Birthplace", values.birthPlace);
    formData.append("Teuteur", values.tuteur);
    if (values.idURL != "") formData.append("ID_URL", values.idURL);
    if (values.vaccineURL != "")
      formData.append("Vaccine_URL", values.vaccineURL);
    //formData.append("Vaccine_URL", vaccineURL);

    swal({
      title: updateMessage,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        axios
          .post(
            `/student/${studentID}`,
            formData
          )
          .then((response) => {
            if (response.status == 200) {
              swal(successUpdate, {
                icon: "success",
              }).then((response) => {
                window.location.reload();
              });
            } else {
              swal(error1, {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal(error1, {
              icon: "error",
            });
          });
      }
    });

    /*
    addPublicStudentFile(formData)
      .then((response) => {
        if (response.status == 201) {
          swal("student added successfuly", {
            icon: "success",
          });
          this.props.history.push(
            `/admin/profile/${response.data.id}/addyearfile`
          );
        } else {
          if (response.status == 200)
            swal("student is already exist, please try again ...", {
              icon: "error",
            });
        }
      })
      .catch((error) => {
        swal("Something went wrong. Please try again later.", {
          icon: "error",
        });
      });
    
    */
  };

  // Inscription Form

  form = (props) => {
    //student details
    const student = this.state.student;
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
      remove,
      update,
      sex,
    } = this.state.langKeywords[pageLanguage];

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="first-section col-lg-6 col-12">
            {/* start Student prename */}
            <div className="form-group">
              <label htmlFor="firstName">{prename}</label>
              <Field
                name="firstName"
                type="text"
                className="form-control"
                id="firstName"
                placeholder={student.firstName}
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="firstName" />
              </span>
            </div>
            {/* end Student prename */}

            {/* start Student Name */}
            <div className="form-group">
              <label htmlFor="lastName">{name}</label>
              <Field
                name="lastName"
                type="text"
                className="form-control"
                id="lastName"
                placeholder={student.lastName}
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="lastName" />
              </span>
            </div>
            {/* end Student Name */}

            {/* start Date of birthday  */}
            <div className="form-group birth-date">
              <label htmlFor="firstName">{birthDate}</label>

              {/* Day */}
              <div className="w-25 float-left mr-2">
                <Field
                  name="birthDate.day"
                  id="birthDate.day"
                  className="form-control"
                  component="select"
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
            {/* end Date of birthday  */}

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
                placeholder="ex: xxxxxx-xxxxxx"
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
              style={{
                width: "175px",
                margin: "auto",
                borderRadius: "4px !important",
              }}
            >
              <i className="fa fa-user-plus"></i>
              <span>{update}</span>
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
    const { required } = this.state.langKeywords[pageLanguage];

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
      //   .typeError("accept numbers only")
      //   .required(required),
      // tuteur: Yup.string().required(required)
    });
    return schema;
  };

  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // All Name

    const {
      titleUpdate,
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
      updateProfile,
    } = this.state.langKeywords[pageLanguage];

    return (
      <div className="inscription-student">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <div className="title-of-middle">
              <h2>{updateProfile}</h2>
            </div>
          </div>

          {/* Start Formik */}
          <Formik
            enableReinitialize={true}
            initialValues={{ ...this.state.student, idURL: "", vaccineURL: "" }}
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

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguages: (newLang) =>
      dispatch({ type: TOGGLE_LANG, payload: { lang: newLang } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditStudent);
