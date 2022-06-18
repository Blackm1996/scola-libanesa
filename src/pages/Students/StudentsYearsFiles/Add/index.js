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
import { addStudentYearFile } from "../../../../Api/StudentsYearsFiles";
import swal from "sweetalert";

class AddStudentYearFile extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    // grade drop down list
    DDL1: [
      /*
      {
        id: 1,
        name: "grade1",
        sections: [
          { id: 1, name: "section1" },
          { id: 2, name: "section2" },
          { id: 3, name: "section3" },
        ],
      },
      {
        id: 2,
        name: "grade2",
        sections: [
          { id: 4, name: "section4" },
          { id: 5, name: "section5" },
          { id: 6, name: "section6" },
        ],
      },
      {
        id: 3,
        name: "grade3",
        sections: [
          { id: 7, name: "section7" },
          { id: 8, name: "section8" },
          { id: 9, name: "section9" },
        ],
      },
      {
        id: 4,
        name: "grade4",
        sections: [
          { id: 10, name: "section10" },
          { id: 11, name: "section12" },
          { id: 12, name: "section13" },
        ],
      },
      */
    ],
    //section drop down list
    sections: [],
    //
    gradeSelected: "",
    gradeErrorMessage: "",
    sectionSelected: "",
    months: [9, 10, 11, 12, 1, 2, 3, 4, 5, 6],
    loadingPage: true,
    inscriptionDetails: {
      inscriptionTax: "",
      booksUniformTotal: "",
      monthTotalPay: "",
    },
    discount: 0,
    newMonthTotal: "",
  };

  // component did mount
  componentDidMount() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { error1 } = this.state.langKeywords[pageLanguage];
    this.props.schoolYear &&
      axios
        .get(`/studentFileYear/${this.props.schoolYear}`)
        .then((response) => {
          if (response.status == 200) {
            this.setState({
              DDL1: [
                { id: "", name: "", sections: [] },
                ...response.data.grades,
              ],
              loadingPage: false,
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
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.schoolYear !== this.props.schoolYear) {
      // Page Lang
      const pageLanguage = this.props.language;

      // Language KEywords
      const { error1 } = this.state.langKeywords[pageLanguage];
      this.props.schoolYear &&
        axios
          .get(`/studentFileYear/${this.props.schoolYear}`)
          .then((response) => {
            if (response.status == 200) {
              this.setState({
                DDL1: [
                  { id: "", name: "", sections: [] },
                  ...response.data.grades,
                ],
                loadingPage: false,
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
  }
  // select DDl1
  selectGradeChange(e) {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { error1 } = this.state.langKeywords[pageLanguage];
    this.setState({
      gradeSelected: e.target.value,
    });

    this.setState({
      sections: [
        ...this.state.DDL1.find((x) => x.id == e.target.value).sections,
      ],
    });

    axios
      .get(`/grade/${e.target.value}`)
      .then((response) => {
        if (response.status == 200) {
          const inscription = response.data;
          // discount value
          const discount = this.state.discount;
          // default month total
          const monthTotalPay = inscription.Default_Monthly_pay;

          this.setState({
            inscriptionDetails: {
              inscriptionTax: inscription.Default_Inscription_tax,
              booksUniformTotal: inscription.Default_Books_Uniform_total,
              monthTotalPay: inscription.Default_Monthly_pay,
            },
            newMonthTotal: monthTotalPay - monthTotalPay * (discount / 100),
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

  // when we select ddl2
  selectSectionChange(e) {
    this.setState({
      sectionSelected: e.target.value,
    });
  }

  // on blur even
  onBlur = () => {
    // show required warning on select grade when it is empty
    if (this.state.gradeSelected == "") {
      this.setState({
        gradeErrorMessage: "Required",
      });
    }
  };

  changeMonthTotal = (e) => {
    // default month total
    const monthTotalPay = e.target.value;

    this.setState({
      newMonthTotal: monthTotalPay,
      discount: 0,
    });
  };

  //discountChnage
  discountChange = (e) => {
    // disocunt amount
    const discount = e.target.value;
    //const default month total
    const defMonthTotal = this.state.inscriptionDetails.monthTotalPay;

    //new month tax
    let newMonthTotal = this.state.newMonthTotal;

    this.setState({
      discount,
    });

    if (defMonthTotal != "" && discount >= 0 && discount <= 15) {
      newMonthTotal = defMonthTotal - defMonthTotal * (discount / 100);
      this.setState({
        newMonthTotal,
      });
    }
    if (discount < 0 || discount > 15)
      this.setState({
        newMonthTotal: defMonthTotal,
        discount: 0,
      });
  };

  // Submit Form
  onSubmit = (values) => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { success, error2, error1 } = this.state.langKeywords[pageLanguage];

    const studentID = this.props.match.params.id;
    var grade = this.state.gradeSelected.trim(),
      section = this.state.sectionSelected.trim();

    // month total pay
    var monthTotalPay = this.state.newMonthTotal;

    //discount amount
    var discount = this.state.discount;

    if (
      grade !== "" &&
      discount >= 0 &&
      discount <= 15 &&
      monthTotalPay != ""
    ) {
      //file year for sending
      const fileYear = {
        "Books/Uniform_total": values.booksUniformTotal,
        Inscription_Tax: values.inscriptionTax,
        Month_Start: values.monthStart,
        //Monthly_Total: values.monthTotalPay,
        Monthly_Total: monthTotalPay,
        Discount: this.state.discount,
        School_Year: this.props.registrationSchoolYear,
        id_classroom: this.state.sectionSelected,
        id_grade: this.state.gradeSelected,
        id_student: studentID,
      };

      // add inscription
      addStudentYearFile(fileYear)
        .then((response) => {
          if (response.status == 201) {
            swal(success, {
              icon: "success",
            });
            this.props.history.push(
              `/admin/profile/${this.props.match.params.id}/viewinscription`
            );
          } else {
            if (response.status == 200)
              swal(error2, {
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
  };

  // Inscription Form
  form = (props) => {
    //years array
    

    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      grade,
      section,
      year,
      inscriptionTax,
      booksUniformTotal,
      monthTotalPay,
      startOfPayment,
      add,
      discount,
    } = this.state.langKeywords[pageLanguage];
    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="mx-auto col-lg-6 col-12">
            
            {/* Inscription tax  */}
            <div className="form-group">
              <label htmlFor="inscriptionTax">{inscriptionTax}</label>
              <Field
                name="inscriptionTax"
                type="number"
                className="form-control"
                id="inscriptionTax"
                placeholder=""
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
                disabled={this.props.role !== "admin" && true}
              />
              <span className="error">
                <ErrorMessage name="inscriptionTax" />
              </span>
            </div>

            {/* Books uniform total  */}
            <div className="form-group">
              <label htmlFor="booksUniformTotal">{booksUniformTotal}</label>
              <Field
                name="booksUniformTotal"
                type="number"
                className="form-control"
                id="booksUniformTotal"
                placeholder=""
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
                disabled={this.props.role !== "admin" && true}
              />
              <span className="error">
                <ErrorMessage name="booksUniformTotal" />
              </span>
            </div>

            {/* Month Total payment  */}
            <div className="form-group">
              <label htmlFor="monthTotalPay">{monthTotalPay}</label>
              <Field
                name="monthTotalPay"
                type="number"
                className="form-control"
                id="monthTotalPay"
                autoComplete="off"
                value={this.state.newMonthTotal}
                onChange={this.changeMonthTotal}
                onWheel={(e) => e.target.blur()}
                disabled={this.props.role !== "admin" && true}
              />
              <span className="error">
                <ErrorMessage name="monthTotalPay" />
              </span>
            </div>

            {/* discount of payment  */}
            <div className="form-group">
              <label htmlFor="discount">{discount}</label>
              <input
                name="discount"
                type="number"
                className="form-control"
                id="discount"
                autoComplete="off"
                value={this.state.discount}
                onChange={this.discountChange}
                onWheel={(e) => e.target.blur()}
              />
              <span className="error">
                <ErrorMessage name="discount" />
              </span>
            </div>

            {/* start Date of beginning monthly payment  */}
            <div className="form-group">
              <label htmlFor="monthStart">{startOfPayment}</label>
              <Field
                name="monthStart"
                id="monthStart"
                className="form-control"
                component="select"
              >
                {this.state.months.map((item, index) => {
                  return (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  );
                })}
              </Field>
              <span className="error">
                <ErrorMessage name="monthStart" />
              </span>
            </div>
            {/* end Date of beginning monthly payment  */}

            {/* Submit Input*/}
            <div className="form-group col-12">
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fa fa-plus"></i>
                <span>{add}</span>
              </button>
            </div>
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
      year: Yup.string().required(required),
      inscriptionTax: Yup.number()
        .typeError("accept numbers only")
        .required(required),
      booksUniformTotal: Yup.number()
        .typeError("accept numbers only")
        .required(required),
      monthTotalPay: Yup.number()
        .typeError("accept numbers only")
        .required(required),
      monthStart: Yup.string().required(required),
      discount: Yup.number()
        .typeError("accept numbers only")
        .min(0, "bigger than or equal 0")
        .max(15, "smaller than or equal 15")
        .required(required),
    });
    return schema;
  };

  render() {
    const pageLanguage = this.props.language;
    const { inscriptionTitle, grade, section, add, optional } =
      this.state.langKeywords[pageLanguage];

    // inscription details
    const inscription = this.state.inscriptionDetails;

    return this.state.loadingPage === true ? (
      <div className="loading">loading ... </div>
    ) : (
      <div className="inscription-year">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <div className="title-of-middle">
              <h2>{inscriptionTitle}</h2>
              <h3>{this.props.registrationSchoolYear}</h3>
            </div>
          </div>

          {/* start add grade and section */}

          {/* end add grade and section */}
          <div className="mx-auto col-lg-6 col-12 pl-2">
            {/* start grade section */}
            <div className="form-group grade">
              <label htmlFor="grade">{grade}</label>
              <select
                id="grade"
                value={this.state.selectddl}
                onBlur={this.onBlur}
                onChange={this.selectGradeChange.bind(this)}
                className="form-control"
              >
                {this.state.DDL1.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {this.state.gradeSelected.trim() === "" ? (
                <span className="error">{this.state.gradeErrorMessage}</span>
              ) : null}
            </div>
            {/* end grade section */}

            {/* start section */}
            <div className="form-group section">
              <label htmlFor="section">
                {section}
                <span className="optional"> ({optional})</span>
              </label>
              <select
                id="section"
                onChange={this.selectSectionChange.bind(this)}
                className="form-control"
              >
                <option selected></option>

                {this.state.sections.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* end section */}
          </div>

          {/* Start Formik */}
          <Formik
            enableReinitialize={true}
            initialValues={{
              inscriptionTax: inscription.inscriptionTax,
              booksUniformTotal: inscription.booksUniformTotal,
              monthTotalPay: inscription.monthTotalPay,
              monthStart: "9",
              discount: 0,
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
    schoolYear: state.schoolYear,
    registrationSchoolYear: state.registrationSchoolYear,
    role: state.role,
  };
};

export default connect(mapStateToProps)(AddStudentYearFile);
