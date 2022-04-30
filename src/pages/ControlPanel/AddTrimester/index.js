import React, { Component } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
// import connect from react-redux
import { connect } from "react-redux";
import swal from "sweetalert";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import { addTrim } from "../../../Api/Trimesters";

class AddTrimester extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
  };
  onSubmit = (values) => {
    // Page Lang
    const pageLanguage = this.props.language;

    // All Name
    const { success, error } = this.state.langKeywords[pageLanguage];
    // send post
    addTrim(values)
      .then((response) => {
        if (response.status === 200)
          swal(success, {
            icon: "success",
          });
      })
      .catch((err) => {
        swal(error, {
          icon: "error",
        });
      });
  };

  form = (props) => {
    // Page Lang
    const pageLanguage = this.props.language;

    // All Name
    const {
      numberOfTrimesters,
      required,
      trimesters,
      scoreName,
      coefficent,
      add,
    } = this.state.langKeywords[pageLanguage];
    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="add-grade col-lg-11 col-12">
            {/* Grade Name*/}
            <div style={{ width: 400 }}>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label">
                  {numberOfTrimesters} :
                </label>
                <div class="col-sm-3">
                  <Field
                    name="trimCount"
                    type="number"
                    className="form-control text-center"
                    id="gradeName"
                    placeholder=""
                    autoComplete="off"
                  />
                  <span
                    className="error"
                    style={{ right: "-71px", top: "17%" }}
                  >
                    <ErrorMessage name="trimCount" />
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <fieldset>
                <legend>{trimesters}</legend>
                <div className="col-12 d-flex justify-content-end">
                  <div
                    className="font-weight-bold"
                    style={{
                      width: "100px",
                      paddingBottom: "20px",
                      letterSpacing: "1px",
                    }}
                  ></div>
                </div>
                <FieldArray
                  name="trimesters"
                  render={(arrayHelper) => (
                    <div className="add-courses">
                      {props.values.trimesters.map((item, index) => (
                        <div key={index} className="d-flex">
                          <div style={{ width: 30 }}>
                            <i
                              className="fa fa-minus fa-xs"
                              style={{
                                paddingTop: 11,
                                fontSize: 17,
                                color: "var(--main-color-1)",
                                cursor: "pointer",
                              }}
                              onClick={() => arrayHelper.remove(index)}
                            ></i>
                            {/* </button> */}
                          </div>
                          {/* Start Trimester name*/}
                          <div className="w-50">
                            <div className="form-group row">
                              <label
                                htmlFor={`trimesters.${index}.name`}
                                className="col-sm-3 col-form-label"
                              >
                                {scoreName}
                              </label>
                              <div class="col-sm-8">
                                <Field
                                  id={`trimesters.${index}.name`}
                                  name={`trimesters.${index}.name`}
                                  className="form-control"
                                  placeholder={`${scoreName}`}
                                  autoComplete="off"
                                />
                                <span
                                  className="error"
                                  style={{ right: "21px" }}
                                >
                                  <ErrorMessage
                                    className="error"
                                    name={`trimesters.${index}.name`}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* End Trimester name*/}

                          {/* Course score*/}
                          <div className="w-50">
                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label">
                                {coefficent}
                              </label>
                              <div class="col-sm-6">
                                <Field
                                  id={`trimesters.${index}.coefficient`}
                                  name={`trimesters.${index}.coefficient`}
                                  type="number"
                                  className="form-control"
                                  placeholder={`${coefficent}`}
                                  autoComplete="off"
                                  onWheel={(e) => e.target.blur()}
                                />
                                <span
                                  className="error"
                                  style={{ right: "21px" }}
                                >
                                  <ErrorMessage
                                    className="error"
                                    name={`trimesters.${index}.coefficient`}
                                  />
                                </span>
                              </div>
                              <div class="col-sm-3">%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary plus"
                        onClick={() =>
                          arrayHelper.push({ name: "", coefficient: "" })
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
                <span>{add}</span>
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
    const { required } = this.state.langKeywords[pageLanguage];
    const schema = Yup.object().shape({
      trimCount: Yup.number()
        .min(1, "larger than 0")
        .typeError("number")
        .required(required),
      trimesters: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .typeError("accept Characters only")
            .required(required),
          coefficient: Yup.number().typeError("number").required(required),
        })
      ),
    });
    return schema;
  };

  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // All Name
    const { pageTitle } = this.state.langKeywords[pageLanguage];
    return (
      <div className="add-grade">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{pageTitle}</h2>
          </div>
          {/* Start Formik */}
          <Formik
            initialValues={{
              trimCount: 1,
              trimesters: [
                {
                  coefficient: "",
                  name: "",
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
export default connect(mapStateToProps)(AddTrimester);
