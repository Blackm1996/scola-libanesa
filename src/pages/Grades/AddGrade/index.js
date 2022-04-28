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
import { addGrade } from "../../../Api/Grades";
import swal from "sweetalert";
import "./style.css";

class AddGrade extends Component {
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
  };

  onSubmit = (values) => {

    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      success, 
      error1,  // There was a problem, please try again
      error2   // 'Grade already exist
    } = this.state.langKeywords[pageLanguage];

    //values on json format
    const grade = {
      Name: values.gradeName, 
      Default_Inscription_tax: values.defInscriptionTax,
      Default_Monthly_pay: values.defMonthlyPay,
      Default_Books_Uniform_total: values.defUniformCost,
      defBooksCost: values.defBooksCost,
      books: values.books,
      courses: values.courses,
    };
    
    axios
      //http://127.0.0.1:8000/api/grade
      .post("/grade", grade)
      .then((response) => {
        console.log('response', response.status);
        if (response.status == 201) {
          
          swal(success, {
          icon: "success",
          })
          .then (() => window.location.reload());
        } else {
            swal({ error1 }, {
              icon: "error"
            });
        }
        })
      .catch((error) => {
        swal({ error1 }, {
          icon: "error",
        });
      });
    
    //send post

    /*
    addGrade(json)
      .then(() => {
        swal("Grade added successfuly", {
          icon: "success",
        });
        //this.props.history.push("/users");
      })
      .catch((error) => {
        swal("error", {
          icon: "error",
        });
      });
    */
  };
  form = (props) => {
    //console.log(props);
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords

    const {
      addGrade,
      books,
      gradeName,
      defInscriptionTax,
      defMonthlyPay,
      defUniformCost,
      defBookCost,
      bookName,
      courses,
      cours,
      name,
      score,
      add,
      error
    } = this.state.langKeywords[pageLanguage];

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="add-grade col-lg-6 col-12">

            {/* Grade Name */}
            <div className="form-group">
              <label htmlFor="gradeName">{gradeName}</label>
              <Field
                name="gradeName"
                type="text"
                className="form-control"
                id="gradeName"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="gradeName" />
              </span>
            </div>
            
            {/* default Inscription Tax */}
            <div className="form-group">
              <label htmlFor="defInscriptionTax">{defInscriptionTax}</label>
              <Field
                name="defInscriptionTax"
                type="number"
                className="form-control"
                id="nameStudent"
                placeholder = ""
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
              />
              <span className="error">
                <ErrorMessage name="defInscriptionTax" />
              </span>
            </div>

            {/* default Monthly payment */}
            <div className="form-group">
              <label htmlFor="defMonthlyPay">{ defMonthlyPay }</label>
              <Field
                name="defMonthlyPay"
                type="number"
                className="form-control"
                id="defMonthlyPay"
                placeholder= ""
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
              />
              <span className="error">
                <ErrorMessage name="defMonthlyPay" />
              </span>
            </div>

            {/* default Uniform Cost / books costs */}
            <div className="form-group">
              <label htmlFor="defUniformCost">
                {defUniformCost} / books costs
              </label>
              <Field
                name="defUniformCost"
                type="number"
                className="form-control"
                id="defUniformCost"
                placeholder = ""
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
              />
              <span className="error">
                <ErrorMessage name="defUniformCost" />
              </span>
            </div>

            {/* Books */}
            <div className="form-group">
              <fieldset>
                <legend>{ books }</legend>
                <FieldArray
                  name="books"
                  render={(arrayHelper) => (
                    <div className="add-books">
                      {props.values.books.map((item, index) => (
                        <div className="book-item row" key={index}>
                          {/* Book item*/}
                          <div className="form-group col-9">
                            <Field
                              id={`books.${index}.name`}
                              name={`books.${index}.name`}
                              className="form-control"
                              placeholder= {bookName}
                              autoComplete="off"
                            />
                            <span className="error">
                              <ErrorMessage
                                className="error"
                                name={`books.${index}.name`}
                              />
                            </span>
                          </div>

                          {/* remove button*/}
                          <div className="col-3">
                            <button
                              type="button"
                              className="btn btn-primary minus"
                              onClick={() => arrayHelper.remove(index)}
                            >
                              <i className="fa fa-minus fa-xs"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary plus"
                        onClick={() => arrayHelper.push({ name: "" })}
                      >
                        <span>+</span>
                      </button>
                    </div>
                  )}
                />
              </fieldset>
            </div>

            {/* Courses */}
            <div className="form-group">
                <fieldset>
                <legend>{ courses }</legend>
                <FieldArray
                  name="courses"
                  render={(arrayHelper) => (
                    <div className="add-courses">
                      {props.values.courses.map((item, index) => (
                        <div key={index}>
                          <label htmlFor={`courses.${index}.name`}>
                            {cours} {index + 1} :
                          </label>
                          {/* Course name*/}
                          <div className="form-group">
                            <Field
                              id={`courses.${index}.name`}
                              name={`courses.${index}.name`}
                              className="form-control"
                              placeholder={ name }
                              autoComplete="off"
                            />
                            <span className="error">
                              <ErrorMessage
                                className="error"
                                name={`courses.${index}.name`}
                              />
                            </span>
                          </div>
                          {/* Course score*/}
                          <div className="form-group">
                            <Field
                              id={`courses.${index}.score`}
                              name={`courses.${index}.score`}
                              type="number"
                              className="form-control"
                              placeholder={score}
                              autoComplete="off"
                              onWheel={(e) => e.target.blur()}
                            />
                            <span className="error">
                              <ErrorMessage
                                className="error"
                                name={`courses.${index}.score`}
                              />
                            </span>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary minus"
                            onClick={() => arrayHelper.remove(index)}
                          >
                            <i className="fa fa-minus fa-xs"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary plus"
                        onClick={() =>
                          arrayHelper.push({ name: "", score: "" })
                        }
                      >
                        {" "}
                        +{" "}
                      </button>
                    </div>
                  )}
                />
              </fieldset>
            </div>
            {/* Submit Input*/}

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fa fa-plus"></i>
                <span>{ add }</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  // Validator
  schema = () => {
    //Show required *
     // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      required,
      number
    } = this.state.langKeywords[pageLanguage];
    
    const schema = Yup.object().shape({
      gradeName: Yup.string().required(required),
      defInscriptionTax: Yup.number()
        .typeError(number)
        .required(required),
      defMonthlyPay: Yup.number()
        .typeError(number)
        .required(required),
      defUniformCost: Yup.number()
        .typeError(number)
        .required(required),
      books: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .typeError("accept Characters only")
            .required(required),
        })
      ),
      courses: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .typeError("accept Characters only")
            .required(required),
          score: Yup.number()
            .typeError(number)
            .required(required),
        })
      ),
    });
    return schema;
  };

  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords

    const { addGrade } = this.state.langKeywords[pageLanguage];
    return (
      <div className="add-grade">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{addGrade}</h2>
          </div>
          {/* Start Formik */}
          <Formik
            initialValues={{
              gradeName: "",
              defInscriptionTax: "",
              defMonthlyPay: "",
              defUniformCost: "",
              books: [
                {
                  name: "",
                },
              ],
              courses: [
                {
                  name: "",
                  score: "",
                },
              ],
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
export default connect(mapStateToProps)(AddGrade);
