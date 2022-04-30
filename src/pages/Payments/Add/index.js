import React, { Component } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Select from "react-select";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { addPayment, getYears, getStudent } from "../../../Api/Payments";
import swal from "sweetalert";

import "./style.css";

class AddPayment extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    student: {
      id: "",
      First_Name: "",
      Last_Name: "",
      Tuteur: "",
      Monthly_Total: "", //Amount to be paid monthly from this student
    },
    loading: true,
    months: [1, 2, 3],
    inscriptionYears: [],
    selectedYear: this.props.schoolYear,
    selectedMonth: "",
    amount: "", // rest of payment
  };

  //component did mount
  componentDidMount = () => {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const { error1Add } = this.state.langKeywords[pageLanguage];

    const studentID = this.props.match.params.id;

    // selected year
    const selectedYear = this.state.selectedYear;

    //selected month
    const selectedMonth = this.state.selectedMonth;

    //get years select box
    getYears(studentID)
      .then((response) => {
        if (response.status == 200)
          this.setState({
            inscriptionYears: response.data,
            loading: false,
          });
      })
      .catch((error) => {
        swal(error1Add, { icon: "error" });
        //window.location.reload();
      });

    //get student details
    getStudent(studentID, this.props.schoolYear)
      .then((response) => {
        if (response.status == 200)
          this.setState({
            student: response.data,
          });
      })
      .catch((error) => {
        //window.location.reload();
      });

    // set inscripted months
    axios
      .get(
        `/billsMonth/${studentID}/${this.state.selectedYear}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            months: response.data,
            selectedMonth: response.data[0],
          });

          //get the rest amount
          axios
            .get(
              `/billsRest/${studentID}/${selectedYear}/${this.state.selectedMonth}`
            )
            .then((response) => {
              if (response.status == 200) {
                const { Rest: rest } = response.data;
                this.setState({
                  amount: rest,
                });
              }
            })
            .catch((error) => {
              swal(error1Add, {
                icon: "error",
              });
            });
        }
      })
      .catch((error) => {
        swal(error1Add, { icon: "error" });
      });
  };

  //custom stlyes
  customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isDisabled ? "red" : "tomato",
      fontSize: 13,
      color: state.isFocused ? "#fff" : "#958282",
      backgroundColor: state.isFocused ? "tomato" : "transparent",
      cursor: "pointer",
    }),
    singleValue: (provided, state) => {
      const color = state.isDisabled ? "#958282" : "#958282";
      const transition = "opacity 300ms";

      return { ...provided, color, transition };
    },
    control: (base) => ({
      ...base,
      fontSize: 13,
      marginBottom: 7,
    }),
  };

  //onDropdownChange
  onDropdownChange = (e) => {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const { error1Add } = this.state.langKeywords[pageLanguage];

    // id student getted from url
    const studentID = this.props.match.params.id,
      yearSelected = e.value;
    this.setState({
      selectedYear: yearSelected,
    });
    const link = `https://management.escola-libanesa.com/test2/api/student/${studentID}/${yearSelected}`;

    //get student details
    getStudent(studentID, yearSelected)
      .then((response) => {
        if (response.status == 200)
          this.setState({
            student: response.data,
          });
        else swal("there is a error, please refresh page", { icon: "error" });
      })
      .catch((error) => {
        swal(error1Add, { icon: "error" });
        //window.location.reload();
      });

    //get the rest amount
    axios
      .get(
        `/billsRest/${studentID}/${yearSelected}/${this.state.selectedMonth}`
      )
      .then((response) => {
        if (response.status == 200) {
          const { Rest: rest } = response.data;
          this.setState({
            amount: rest,
          });
        }
      })
      .catch((error) => {
        swal(error1Add, { icon: "error" });
      });

    //get months inscripteded in selected year
    axios
      .get(
        `/billsMonth/${studentID}/${yearSelected}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            months: response.data,
            selectedMonth: response.data[0],
          });
        }
      })
      .catch((error) => {
        swal(error1Add, { icon: "error" });
      });
  };

  //handle amount
  handleAmount = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  //select month change
  selectMonthChange = (e) => {
    // Page Lang
    const pageLanguage = this.props.language;
    // Language KEywords
    const { error1Add } = this.state.langKeywords[pageLanguage];
    //month selected
    const selectedMonth = e.target.value;

    //year selected
    const selectedYear = this.state.selectedYear;

    // id student getted from url
    const studentID = this.props.match.params.id;
    this.setState({
      selectedMonth,
    });

    //get the rest amount
    axios
      .get(
        `/billsRest/${studentID}/${selectedYear}/${selectedMonth}`
      )
      .then((response) => {
        if (response.status == 200) {
          const { Rest: rest } = response.data;
          this.setState({
            amount: rest,
          });
        }
      })
      .catch((error) => {
        swal(error1Add, {
          icon: "error",
        });
      });
  };

  //submit
  onSubmit = (values) => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { successAdd, error1Add } = this.state.langKeywords[pageLanguage];

    const studentName = `${this.state.student.First_Name} ${this.state.student.Last_Name}`;
    const studentID = this.props.match.params.id;

    // payment message confirmation
    var billMessage = "";
    switch (pageLanguage) {
      //porto message
      case "PORTO":
        billMessage = `Por favor confirma sua pagamento:
          Aluno : ${studentName}
          Mensalidade : ${values.amount}
          Por meses: ${values.month}
          Ano letivo: ${this.state.selectedYear}
        `;
        break;

      //english message
      case "ENGLISH":
        billMessage = `Please confirm payment:
          Student : ${studentName}
          Amount : ${values.amount}
          For Month: ${values.month}
          School year : ${this.state.selectedYear}
        `;
        break;
      case "FRENCH":
        billMessage = `Veuillez confirmer le paiement:
          Étudiant : ${studentName}
          Montant : ${values.amount}
          Pour Mois: ${values.month}
          Année scolaire : ${this.state.selectedYear}
        `;
        break;
      default:
        break;
    }

    if (this.state.selectedYear != "") {
      var answer = window.confirm(billMessage);
      if (answer) {
        this.setState({
          loading: true,
        });
        addPayment({
          Month: values.month,
          id_student: studentID,
          School_Year: this.state.selectedYear,
          Amount: values.amount,
          paymentType: values.paymentType
        })
          .then((response) => {
            if (response.status == 201) {
              swal(successAdd, {
                icon: "success",
              }).then((response) => {
                //get the rest amount
                axios
                  .get(
                    `/billsRest/${studentID}/${this.state.selectedYear}/${this.state.selectedMonth}`
                  )
                  .then((response) => {
                    if (response.status == 200) {
                      const { Rest: rest } = response.data;
                      this.setState({
                        amount: rest,
                        loading: false,
                        selectedMonth: values.month,
                      });
                    }
                  })
                  .catch((error) => {
                    swal(error1Add, {
                      icon: "error",
                    }).then((response) => {
                      window.location.reload();
                    });
                  });
              });
            } else {
              swal(error1Add, {
                icon: "error",
              });
            }
          })
          .catch((response) =>
            swal(error1Add, {
              icon: "error",
            })
          );
      }
    }
  };
  form = (props) => {
    // student details
    const student = this.state.student;
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      title,
      studentNumber,
      firstName,
      lastName,
      guardian,
      monthlyFee,
      grade,
      section,
      createPayment,
      amount,
      month,
      add,
      rest,
      type,
      enterType,
      cash,
      bank,
    } = this.state.langKeywords[pageLanguage];

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="add-grade col-lg-6 col-12 pb-0">
            <pre className="student-details pt-3 pb-3">
              <div className="pb-2">
                {monthlyFee}: {student.Monthly_Total}
              </div>
              <div className="pb-2">
                {grade}: {student.gradeName}{" "}
              </div>
              <div>
                {section}:{" "}
                {student.sectionName == "null" ? "" : student.sectionName}{" "}
              </div>
            </pre>

            {/* start Payment month */}
            <div className="form-group">
              <fieldset>
                <legend>{createPayment}</legend>
                {/* amount */}
                <label htmlFor="amount">
                  {" "}
                  {amount} ({rest})
                </label>
                <Field
                  name="amount"
                  type="number"
                  className="form-control"
                  id="amount"
                  defaultValue={this.state.amount}
                  min="1"
                  max={this.state.amount}
                  onWheel={(e) => e.target.blur()}
                />
                <span className="error">
                  <ErrorMessage name="amount" />
                </span>
                {/* Month  */}
                <div className="form-group">
                  <label htmlFor="month">{month}</label>
                  <Field
                    disabled={student.Monthly_Total == "" ? true : false}
                    name="month"
                    id="month"
                    className="form-control"
                    component="select"
                    defaultValue={9}
                    value={this.state.selectedMonth}
                    onChange={this.selectMonthChange}
                  >
                    {this.state.months.map((item, index) => {
                      return (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      );
                    })}
                  </Field>
                  <span className="error">
                    {this.state.selectedMonth == "" ? (
                      <ErrorMessage name="month" />
                    ) : null}
                  </span>
                </div>
                {/* start payment type*/}
                <div className="form-group">
                  <label htmlFor="payment">{type}</label>
                  <Field
                    name="paymentType"
                    id="paymentType"
                    className="form-control"
                    component="select"
                  >
                    {["", "cash", "bank"].map((item, index) => {
                      return (
                        <option value={item} key={index} disabled={item === ""}>
                          {item === "cash" && cash}
                          {item === "bank" && bank}
                          {item === "" && `${enterType}`}
                        </option>
                      );
                    })}
                  </Field>
                  <span className="error">
                    <ErrorMessage name="paymentType" />
                  </span>
                </div>
                {/* end payment type*/}
              </fieldset>
            </div>
            {/* end Payment month */}

            {/*start Submit Input*/}
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fa fa-plus"></i>
                <span>{add}</span>
              </button>
            </div>
            {/* end submit input */}
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
    const { largerThanZero, smallerThan, required } =
      this.state.langKeywords[pageLanguage];

    const schema = Yup.object().shape({
      month: Yup.string().required(required),
      amount: Yup.number()
        .min(1, largerThanZero)
        .max(this.state.amount, `${smallerThan} or equal ${this.state.amount}`)
        .required(required),
      paymentType: Yup.mixed().oneOf(["cash", "bank"]).required(required),
    });
    return schema;
  };

  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { title } = this.state.langKeywords[pageLanguage];
    //years option
    var years = [],
      year = "";

    for (var i = 0; i < this.state.inscriptionYears.length; i++) {
      year = this.state.inscriptionYears[i]["School_Year"];
      years.push({ value: year, label: year });
    }

    // default value
    const defaultValue =
      this.state.inscriptionYears.length !== 0
        ? { label: "2021-2022", value: "2021-2022" }
        : {};
    return !this.state.loading ? (
      <div className="add-bill">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{title}</h2>

            {/* Start select search */}
            <div className="select-container w-100">
              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select class"
                  defaultValue={defaultValue}
                  options={years}
                  styles={this.customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "hotpink",
                      primary: "#ff634766",
                    },
                  })}
                  onChange={this.onDropdownChange}
                />
              </div>
            </div>
            {/* end select search */}
          </div>

          {this.state.loading ? (
            <div>...</div>
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={{
                amount: this.state.amount,
                month: this.state.selectedMonth,
                paymentType: "",
              }}
              onSubmit={this.onSubmit}
              render={this.form}
              validationSchema={this.schema()}
            />
          )}
        </div>
      </div>
    ) : (
      <div>...loading</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    schoolYear: state.schoolYear,
  };
};
export default connect(mapStateToProps)(AddPayment);
