import React, { Component } from "react";
import "./style.css";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getCourses } from "../../../Api/Courses";
import swal from "sweetalert";
import { updateCourses } from "../../../Api/Courses";
import axios from "axios";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys.js";
// import connect from react-redux
import { connect } from "react-redux";

class UpdateGradeCourses extends Component {
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    loading: true,
    idGrade: 2,
    deletedCourses: [],
    addedCourses: [],
    courses: [],
  };

  // component did mount
  componentDidMount = () => {
    const gradeId = this.props.match.params.id;

    this.setState({
      loading: false,
    });
    // Get courses
    getCourses(gradeId)
      .then((response) => {
        this.setState({
          courses: response.data,
        });
      })
      .catch((error) => {});
  };

  //onDropdownChane
  onDropdownChange = (value) => {};

  //onsubmit method
  onSubmit = (values) => {
    const pageLanguage = this.props.language;
    // Language KEywords
    const { updateMessage, error1, success } =
      this.state.langKeywords[pageLanguage];
    swal({
      title: updateMessage,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        //send put
        axios
          .put(
            `/course/${this.props.match.params.id}`,
            {
              deletedCourses: this.state.deletedCourses,
              addedCourses: values.courses,
            }
          )
          .then((response) => {
            if (response.status == 200)
              swal(success, {
                icon: "success",
              });
          })
          .catch((error) => {
            swal(error1, {
              icon: "error",
            });
          });
      }
    });
  };

  //delete course
  deleteCourse = (id) => {
    const pageLanguage = this.props.language;
    // Language KEywords
    const { deleteMessage } = this.state.langKeywords[pageLanguage];
    var answer = window.confirm(deleteMessage);
    if (answer) {
      var oldCourses = this.state.courses;
      var deletedCourses = this.state.deletedCourses;
      var filteredCourses = oldCourses.filter(function (course, index, arr) {
        return course.id !== id;
      });
      deletedCourses.push(id);
      this.setState({
        deletedCourses: [...deletedCourses],
        courses: [...filteredCourses],
      });
    }
  };

  form = (props) => {
    const pageLanguage = this.props.language;

    // Language KEywords

    const { newCourse, score, updateCourses, deleteMessage } =
      this.state.langKeywords[pageLanguage];
    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="add-grade col-lg-6 col-12">
            {/* Books */}
            <div className="form-group">
              {this.state.courses.map((course, index) => (
                <div className="course-item" key={index}>
                  {/* Input section*/}
                  <div className="float-left col-10 pr-0 pl-0">
                    <Field
                      disabled
                      id={`${course.id}`}
                      name={`${course.Name}`}
                      className="form-control"
                      placeholder={`${course.Name}`}
                    />
                    <Field
                      disabled
                      id={`${course.id}`}
                      type="number"
                      name={`${course.score}`}
                      className="form-control"
                      placeholder={`${course.score}`}
                    />
                  </div>
                  <div className="float-left col-2 pl-9">
                    <button
                      type="button"
                      id={course.id}
                      className="btn btn-primary minus"
                      onClick={() => this.deleteCourse(course.id)}
                    >
                      <i className="fa fa-minus fa-xs"></i>
                    </button>
                  </div>
                </div>
              ))}

              <FieldArray
                name="courses"
                render={(arrayHelper) => (
                  <div className="add-courses-section">
                    {props.values.courses.map((item, index) => (
                      <div className="course-item" key={index}>
                        {/* 
                          <label htmlFor={`courses.${index}.name`}>
                            Book name
                          </label>
                          */}

                        {/* Input section*/}
                        <div className="float-left col-10 pr-0 pl-0">
                          {/* course name field*/}
                          <div className="course-name">
                            <Field
                              id={`courses.${index}.Name`}
                              name={`courses.${index}.Name`}
                              className="form-control"
                              placeholder={newCourse}
                            />
                            <span className="error">
                              <ErrorMessage
                                className="error"
                                name={`courses.${index}.Name`}
                              />
                            </span>
                          </div>

                          {/* course score field*/}
                          <div className="course-score">
                            <Field
                              id={`courses.${index}.score`}
                              name={`courses.${index}.score`}
                              type="number"
                              className="form-control"
                              placeholder={score}
                            />
                            <span className="error">
                              <ErrorMessage
                                className="error"
                                name={`courses.${index}.score`}
                              />
                            </span>
                          </div>
                        </div>
                        <div className="float-left col-2 pl-9">
                          <button
                            type="button"
                            name={item.Name}
                            id={item.id}
                            className="btn btn-primary minus"
                            onClick={() => {
                              window.confirm(deleteMessage);
                              arrayHelper.remove(index);
                              //if(array) { alert('deleted');}
                              //else { alert('not deleted..');}
                            }}
                          >
                            <i className="fa fa-minus fa-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-primary plus"
                        onClick={() =>
                          arrayHelper.push({ Name: "", score: "" })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Submit Input*/}
            <div className="form-group submit-btn-container">
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fa fa-edit"></i>
                <span>{updateCourses}</span>
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
    const pageLanguage = this.props.language;
    // Language KEywords
    const { required } = this.state.langKeywords[pageLanguage];

    const schema = Yup.object().shape({
      courses: Yup.array().of(
        Yup.object().shape({
          Name: Yup.string()
            .typeError("accept Characters only")
            .required(required),
          score: Yup.number()
            .typeError("accept numbers only")
            .required(required),
        })
      ),
    });
    return schema;
  };

  //render
  render() {
    const pageLanguage = this.props.language;
    // Language KEywords
    const { updateCourses } = this.state.langKeywords[pageLanguage];
    return this.state.loading ? (
      <div className="loading">loading ...</div>
    ) : (
      <div className="update-courses">
        <h2 className="title-of-middle">{updateCourses}</h2>

        {/* Start Formik */}
        <Formik
          enableReinitialize={true}
          initialValues={{
            //courses: [...this.state.courses],
            courses: [],
          }}
          onSubmit={this.onSubmit}
          render={this.form}
          validationSchema={this.schema()}
        />
        {/* End Formik */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(UpdateGradeCourses);
