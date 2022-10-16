/* Readable Scalable Secure */
import React, { Component } from "react";
import Select from "react-select";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "../Add/LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getYears } from "../../../../Api/Payments";
import swal from "sweetalert";

class ViewInscription2 extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    // grade drop down list
    DDL1: [],
    //section drop down list
    sections: [],
    selectddl: "grade3",
    gradeSelected: this.props.schoolYear, //id
    gradeErrorMessage: "",
    sectionSelected: "",
    yearSelected: this.props.schoolYear,
    months: [9, 10, 11, 12, 1, 2, 3, 4, 5, 6],
    loadingPage: true,
    inscriptionYears: [],
    inscriptionDetails: {
      idStudent: this.props.match.params.id,
      inscriptionTax: "",
      booksUniformTotal: "",
      monthTotalPay: "",
      monthStart: "",
      gradeId: "",
      sectionId: "",
      
    },
    attending: -1,
    discount: 0,
    newMonthTotal: "",
  };

  // component did mount
  componentDidMount() {
    const studentID = this.props.match.params.id;

    /* start get years select box */
    getYears(studentID)
      .then((response) => {
        if (response.status === 200)
          this.setState({
            inscriptionYears: response.data,
            loading: false,
          });

        // if (response.status == 200)
        //   this.setState({
        //     inscriptionYears: response.data,
        //     loading: false,
        //   });
      })
      .catch((error) => {
        //window.location.reload();
      });
    /* end get years select box */

    this.props.schoolYear &&
      axios
        .get(
          `/studentFileYear/${this.props.schoolYear}` // global select year
        )
        .then((response) => {
          this.setState({
            DDL1: [{ id: "", name: "", sections: [] }, ...response.data.grades],
            loadingPage: false,
          });
          // get inscription tax
          axios
            .get(`/studentFileYear/${studentID}/${this.props.schoolYear}`) // global select year
            .then((response) => {
              //get student inscription details
              const inscription = response.data;
              console.log(inscription);
              this.setState({
                inscriptionDetails: {
                  ...this.state.inscriptionDetails,
                  inscriptionTax: inscription.Inscription_Tax,
                  booksUniformTotal: inscription["Books_Uniform_total"],
                  monthTotalPay: inscription.Monthly_Total,
                  monthStart: inscription.Month_Start,
                  gradeId: inscription.gradeId,
                  sectionId:
                    inscription.sectionId == null ? "" : inscription.sectionId,
                  discount: inscription.Discount,
                },
                attending: inscription.attending,
                gradeSelected: inscription.gradeId,
                discount: inscription.Discount,
                newMonthTotal: inscription.Monthly_Total,
              });
              this.setState({
                sections: this.state.DDL1.find(
                  (item) => item.id === inscription.gradeId
                ).sections,
              });
            });
        });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.schoolYear !== this.props.schoolYear) {
      const studentID = this.props.match.params.id;

      /* start get years select box */
      getYears(studentID)
        .then((response) => {
          if (response.status === 200)
            this.setState({
              inscriptionYears: response.data,
              loading: false,
            });

          // if (response.status == 200)
          //   this.setState({
          //     inscriptionYears: response.data,
          //     loading: false,
          //   });
        })
        .catch((error) => {
          //window.location.reload();
        });
      /* end get years select box */

      this.props.schoolYear &&
        axios
          .get(
            `/studentFileYear/${this.props.schoolYear}` // global select year
          )
          .then((response) => {
            this.setState({
              DDL1: [
                { id: "", name: "", sections: [] },
                ...response.data.grades,
              ],
              loadingPage: false,
            });
            // get inscription tax
            axios
              .get(`/studentFileYear/${studentID}/${this.props.schoolYear}`) // global select year
              .then((response) => {
                //get student inscription details
                const inscription = response.data;
                console.log(inscription);
                this.setState({
                  inscriptionDetails: {
                    ...this.state.inscriptionDetails,
                    inscriptionTax: inscription.Inscription_Tax,
                    booksUniformTotal: inscription["Books_Uniform_total"],
                    monthTotalPay: inscription.Monthly_Total,
                    monthStart: inscription.Month_Start,
                    
                    gradeId: inscription.gradeId,
                    sectionId:
                      inscription.sectionId == null
                        ? ""
                        : inscription.sectionId,
                    discount: inscription.Discount,
                  },
                  attending: inscription.attending,
                  gradeSelected: inscription.gradeId,
                  discount: inscription.Discount,
                  newMonthTotal: inscription.Monthly_Total,
                });
                this.setState({
                  sections: this.state.DDL1.find(
                    (item) => item.id === inscription.gradeId
                  ).sections,
                });
              });
          });
    }
  }
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

  // on dropdown change
  onDropdownChange = (e) => {
    this.setState({
      yearSelected: e.value,
    });

    // get inscription tax
    const studentID = this.state.inscriptionDetails.idStudent;
    axios.get(`/studentFileYear/${studentID}/${e.value}`).then((response) => {
      //get student inscription details
      const inscription = response.data;
      this.setState({
        inscriptionDetails: {
          ...this.state.inscriptionDetails,
          inscriptionTax: inscription.Inscription_Tax,
          booksUniformTotal: inscription["Books_Uniform_total"],
          monthTotalPay: inscription.Monthly_Total,
          monthStart: inscription.Month_Start,
          
          gradeId: inscription.gradeId,
          sectionId: inscription.sectionId == null ? "" : inscription.sectionId,
          discount: inscription.Discount,
        },
        attending: inscription.attending,
        gradeSelected: inscription.gradeId,
        discount: inscription.Discount,
        newMonthTotal: inscription.Monthly_Total,
      });
    });
  };
  // select DDl1
  selectGradeChange(e) {
    this.setState({ gradeSelected: e.target.value });
    this.setState({
      sections: this.state.DDL1.find((item) => item.id === e.target.value)
        .sections,
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
    if (this.state.gradeSelected === "") {
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

    if (defMonthTotal !== "" && discount >= 0 && discount <= 15) {
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

  //delete inscription
  deleteInscription = () => {
    //year selected
    const yearSelected = this.state.yearSelected;
    const studentID = this.props.match.params.id;

    //delete confirmation
    swal({
      title: "Are you sure for deleting this file",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`/studentFileYear/${studentID}/${yearSelected}`)
          .then((response) => {
            if (response.status === 200) {
              const items = this.state.inscriptionYears.filter(
                (item) => item.School_Year !== yearSelected
              );
              this.setState({ inscriptionYears: items });
              swal("succes", {
                icon: "success",
              });
            } else {
              swal("error", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("error", {
              icon: "error",
            });
          });
      }
    });
  };
  // Submit Form
  onSubmit = (values) => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { success, error: errorMsg } = this.state.langKeywords[pageLanguage];

    const studentID = this.props.match.params.id;
    var grade = this.state.gradeSelected;
    // month total pay
    var monthTotalPay = this.state.newMonthTotal;

    //discount amount
    var discount = this.state.discount;

    if (
      grade !== "" &&
      discount >= 0 &&
      discount <= 15 &&
      monthTotalPay !== ""
    ) {
      //file year for sending

      const fileYear = {
        id_student: studentID,
        id_grade: this.state.gradeSelected,
        School_Year: values.year,
        Inscription_Tax: values.inscriptionTax,
        Books_Uniform_total: values.booksUniformTotal,
        Monthly_Total: monthTotalPay,
        Month_Start: values.monthStart,
        id_classroom: this.state.sectionSelected,
        Discount: this.state.discount,
      };

      // start confirmation update
      swal({
        title: "Are you sure for updating this file",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          axios
            .put(
              `/studentFileYear/4/${this.props.schoolYear}`, // 4 constant
              fileYear
            )
            .then((response) => {
              if (response.status === 200) {
                swal(success, {
                  icon: "success",
                }).then((response) => {
                  this.setState({
                    inscriptionDetails: {
                      idStudent: this.props.match.params.id,
                      inscriptionTax: "",
                      booksUniformTotal: "",
                      monthTotalPay: "",
                      monthStart: "",
                      gradeId: "",
                      sectionId: "",
                    },
                    discount: 0,
                    newMonthTotal: "",
                  });
                });
              } else {
                //
              }
            })
            .catch((error) => {
              swal(errorMsg, {
                icon: "error",
              });
            });
        }
      });
    }
  };

  // Inscription Form
  form = (props) => {
    //years array
    var years = [];
    years.push("");
    for (let i = 2014; i <= 2050; i++) {
      let year = `${i}-${i + 1}`;
      years.push(year);
    }

    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      inscriptionTax,
      booksUniformTotal,
      monthTotalPay,
      discount,
      startOfPayment,
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
                disabled={true}
              />
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
                disabled={true}
              />
            </div>

            {/* Month Total payment  */}
            <div className="form-group">
              <label htmlFor="monthTotalPay">{monthTotalPay}</label>
              <Field
                name="monthTotalPay"
                type="number"
                className="form-control"
                id="monthTotalPay"
                value={this.state.newMonthTotal}
                autoComplete="off"
                disabled={true}
              />
            </div>

            {/* discount of payment  */}
            <div className="form-group">
              <label htmlFor="discount">{discount}</label>
              <input
                name="discount"
                type="number"
                className="form-control"
                id="discount"
                value={this.state.discount}
                placeholder={this.state.discount}
                autoComplete="off"
                disabled={true}
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
                disabled={true}
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
      inscriptionTax: Yup.number().required(required),
      booksUniformTotal: Yup.number().required(required),
      monthTotalPay: Yup.number().required(required),
      monthStart: Yup.string().required(required),
      discount: Yup.number().required(required).min(0).max(15),
    });
    return schema;
  };
  kikckout_resume = () =>{
    swal({
      title: this.state.attending === 1 ?"Are you sure you want to kick this student out?":"Are you sure you want to bring this student back?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if(willDelete)
      {
        const data={
          id_student: this.props.match.params.id,
          attendance:this.state.attending=== 1 ? 0:1,
        };
        console.log(data);
        axios
        .post('/attendanceChange',data)
        .then((response) => {
          if (response.status === 200) {
            this.setState({attending : this.state.attending === 1 ? 0:1});
            swal(this.state.attending === 1? "Student Rejoined class":"Student kicked out of class", {
              icon: "success",
            });
          }
        })
        .catch((error) => {
          swal("ERROR", {
            icon: "error",
          });
        });
      }
    });
    
  };
  render() {
    
    //inscription
    const inscription = this.state.inscriptionDetails;

    // page language
    const pageLanguage = this.props.language;
    const { grade, section, inscriptionTitle } =
      this.state.langKeywords[pageLanguage];

    // years of select
    //years option
    var years = [],
      year = "";

    for (var i = 0; i < this.state.inscriptionYears.length; i++) {
      year = this.state.inscriptionYears[i]["School_Year"];
      years.push({ value: year, label: year });
    }

    return this.state.loadingPage === true ? (
      <div className="loading">loading ... </div>
    ) : (
      <div className="edit-inscription">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{inscriptionTitle}</h2>

            {/* Start select search */}
            <div className="select-container w-100">
              <div className="select">
                <Select
                  disabled={true}
                  style={{ fontSize: 0 }}
                  placeholder="Select class"
                  defaultValue={{
                    label: `${this.props.schoolYear}`,
                    value: `${this.props.schoolYear}`,
                  }}
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
                        
          {/* start add grade and section */}
          {this.state.attending>=0 && <div className="form-group text-center mx-auto col-lg-6 col-12 pl-2 m-b-20">
          <div className={this.state.attending===1?"p-2 bg-success text-white":
                                "p-2 bg-danger text-white"}>
                                  {this.state.attending===1? "Attending":"OUT"}
          </div>
          </div>}
          {/* end add grade and section */}
          <div className="mx-auto col-lg-6 col-12 pl-2">
          
            {/* start grade section */}
            <div className="form-group">
              <label htmlFor="grade">{grade}</label>
              <select
                id="grade"
                value={this.state.gradeSelected}
                onBlur={this.onBlur}
                onChange={this.selectGradeChange.bind(this)}
                className="form-control"
                disabled={true}
              >
                {this.state.DDL1.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {this.state.gradeSelected === "" ? (
                <span className="error">{this.state.gradeErrorMessage}</span>
              ) : null}
            </div>
            {/* end grade section */}

            {/* start section */}
            <div className="form-group">
              <label htmlFor="section">{section}</label>
              <select
                id="section"
                onChange={this.selectSectionChange.bind(this)}
                className="form-control"
                disabled={true}
                value={this.state.inscriptionDetails.sectionId}
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
              year: this.state.yearSelected,
              inscriptionTax: inscription.inscriptionTax,
              booksUniformTotal: inscription.booksUniformTotal,
              monthTotalPay: inscription.monthTotalPay,
              monthStart: inscription.monthStart,
              discount: inscription.discount,
            }}
            onSubmit={this.onSubmit}
            render={this.form}
            validationSchema={this.schema()}
          />
          {/* End Formik */}
          
          
        </div>
        {this.state.attending>=0 && <div className="mx-auto col-lg-6 col-12 pl-2">
            <button style={this.state.attending===1? {backgroundColor:'#F93154',color:'#FBFBFB'}:{backgroundColor:'#00B74A',color:'#FBFBFB'}}
                  onClick={this.kikckout_resume}>{this.state.attending===1? 'Kick out':'Attend Again'} </button>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    schoolYear: state.schoolYear,
    registrationSchoolYear: state.registrationSchoolYear,
  };
};

export default connect(mapStateToProps)(ViewInscription2);
