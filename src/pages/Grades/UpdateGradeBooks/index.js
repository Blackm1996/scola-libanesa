import React, { Component } from "react";
import "./style.css";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getBooks } from "../../../Api/Books";
import Select, { NonceProvider } from "react-select";
import swal from "sweetalert";
import { updateBooks } from "../../../Api/Books";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys.js";
// import connect from react-redux
import { connect } from "react-redux";

class UpdateGradeBooks extends Component {
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    loading: true,
    gradesOptions: [],
    idGrade: 74,
    deletedBooks: [],
    addedBooks: [],
    books: [],
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

  // component did mount
  componentDidMount = () => {
    const gradeId = this.props.match.params.id;
    // Get books
    getBooks(gradeId)
      .then((response) => {
        this.setState({
          books: response.data,
          loading: false,
        });
        //this.props.history.push("/users");
      })
      .catch((error) => {
        //alert("حدث خطأ غير معروف");
      });
  };

  //onsubmit method
  onSubmit = (values) => {
    // submitted form
    const pageLanguage = this.props.language;
    // Language KEywords
    const { updateMessage, error1, success } =
      this.state.langKeywords[pageLanguage];
    const deletedBooks = this.state.deletedBooks;
    const addedBooks = values.books.map(({ name }) => ({ Name: name }));
    swal({
      title: updateMessage,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        axios
          .put(
            `/book/${this.props.match.params.id}`,
            {
              addedBooks,
              deletedBooks,
            }
          )
          .then((response) => {
            if (response.status == 200) {
              swal(success, {
                icon: "success",
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
  };

  //delete book
  deleteBook = (id) => {
    const pageLanguage = this.props.language;
    // Language KEywords
    const { deleteMessage } = this.state.langKeywords[pageLanguage];
    var answer = window.confirm(deleteMessage);
    if (answer) {
      var oldBooks = this.state.books;
      var deletedBooks = this.state.deletedBooks;
      var filteredBooks = oldBooks.filter(function (book, index, arr) {
        return book.id !== id;
      });
      deletedBooks.push(id);
      this.setState({
        deletedBooks: [...deletedBooks],
        books: [...filteredBooks],
      });
    }
  };

  form = (props) => {
    const pageLanguage = this.props.language;
    // Language KEywords
    const { newBook, updateBooks, deleteMessage } = this.state.langKeywords[pageLanguage];

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="add-grade col-lg-6 col-12">
            {/* Books */}
            <div className="form-group">
              {this.state.books.map((book, index) => (
                <div className="book-name" key={index}>
                  {/* Input section*/}
                  <div className="float-left col-10 pr-0 pl-0">
                    <Field
                      disabled
                      id={`${book.id}`}
                      name={`${book.Name}`}
                      className="form-control"
                      placeholder={`${book.Name}`}
                    />
                  </div>
                  <div className="float-left col-2 pl-9">
                    <button
                      type="button"
                      id={book.id}
                      className="btn btn-primary minus"
                      onClick={() => this.deleteBook(book.id)}
                    >
                      <i className="fa fa-minus fa-xs"></i>
                    </button>
                  </div>
                </div>
              ))}

              <FieldArray
                name="books"
                render={(arrayHelper) => (
                  <div className="add-books">
                    {props.values.books.map((item, index) => (
                      <div className="added-book" key={index}>
                        {/* 
                          <label htmlFor={`books.${index}.name`}>
                            Book name
                          </label>
                          */}

                        {/* Input section*/}
                        <div className="float-left col-10 pr-0 pl-0">
                          <Field
                            id={`books.${index}.name`}
                            name={`books.${index}.name`}
                            className="form-control"
                            placeholder="new book"
                          />
                          <span className="error" style={{ top: "18%" }}>
                            <ErrorMessage
                              className="error"
                              name={`books.${index}.name`}
                            />
                          </span>
                        </div>
                        <div className="float-left col-2 pl-9">
                          <button
                            type="button"
                            name={item.name}
                            id={item.id}
                            className="btn btn-primary minus"
                            onClick={() => {
                              let answer = window.confirm(
                                deleteMessage
                              );
                              if (answer) arrayHelper.remove(index);
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
                        onClick={() => arrayHelper.push({ name: "" })}
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
                <span>{updateBooks}</span>
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
      books: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .typeError("accept Characters only")
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
    const { updateBooks } = this.state.langKeywords[pageLanguage];
    return this.state.loading ? (
      <div className="loading">loading ...</div>
    ) : (
      <div className="update-books">
        <h2 className="title-of-middle">{updateBooks}</h2>

        {/* Start Formik */}
        <Formik
          enableReinitialize={true}
          initialValues={{
            //books: [...this.state.books],
            books: [],
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
export default connect(mapStateToProps)(UpdateGradeBooks);
