import React, { Component } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys.js";
// import connect from react-redux
import { connect } from "react-redux";

class UpdateGradeTaxes extends Component {
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    inscriptionDetails: {
      inscriptionTax: "",
      booksUniformTotal: "",
      monthTotalPay: "",
    },
  };

  componentDidMount = () => {
    //console.log("id from url", this.props.match.params);
    axios
      .get(
        `/grade/${this.props.match.params.id}`
      )
      .then((response) => {
        const inscription = response.data;
        this.setState({
          inscriptionDetails: {
            inscriptionTax: inscription.Default_Inscription_tax,
            booksUniformTotal: inscription.Default_Books_Uniform_total,
            monthTotalPay: inscription.Default_Monthly_pay,
            name: inscription.Name,
          },
        });
      });
  };

  form = (props) => {
    const pageLanguage = this.props.language;

    // Language KEywords

    const {
      defInscriptionTax,
      defMonthlyPay,
      defUniformCost,
      defBookCost,
      update,
    } = this.state.langKeywords[pageLanguage];
    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="add-grade col-lg-6 col-12">
            {/* default Inscription Tax */}
            <div className="form-group">
              <label htmlFor="defInscriptionTax">{defInscriptionTax}</label>
              <Field
                name="inscriptionTax"
                type="number"
                className="form-control"
                id="inscriptionTax"
                placeholder=""
              />
              <span className="error">
                <ErrorMessage name="inscriptionTax" />
              </span>
            </div>

            {/* default Monthly payment */}
            <div className="form-group">
              <label htmlFor="monthTotalPay">{defMonthlyPay}</label>
              <Field
                name="monthTotalPay"
                type="number"
                className="form-control"
                id="monthTotalPay"
                placeholder=""
              />
              <span className="error">
                <ErrorMessage name="monthTotalPay" />
              </span>
            </div>

            {/* default Uniform Cost / books costs */}
            <div className="form-group">
              <label htmlFor="booksUniformTotal">
                {defUniformCost} / {defBookCost}
              </label>
              <Field
                name="booksUniformTotal"
                type="number"
                className="form-control"
                id="booksUniformTotal"
                placeholder=""
              />
              <span className="error">
                <ErrorMessage name="booksUniformTotal" />
              </span>
            </div>

            {/* Submit Input*/}
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fa fa-plus"></i>
                <span>{update}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  onSubmit = (values) => {
    const pageLanguage = this.props.language;
    const { success, updateMessage, error1 } =
      this.state.langKeywords[pageLanguage];

    const gradeID = this.props.gradeID;
    //values on json format
    const grade = {
      Name: this.state.inscriptionDetails.name,
      Default_Inscription_tax: values.inscriptionTax,
      Default_Monthly_pay: values.monthTotalPay,
      Default_Books_Uniform_total: values.booksUniformTotal,
    };
    swal({
      title: updateMessage,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate)
        axios
          //http://127.0.0.1:8000/api/grade
          .put(
            `/grade/${this.props.match.params.id}`,
            grade
          )
          .then((response) => {
            if (response.status == 200) {
              swal(success, {
                icon: "success",
              }).then((willUpdate) => {
                if (willUpdate)
                  this.setState({
                    inscriptionDetails: {
                      inscriptionTax: values.inscriptionTax,
                      monthTotalPay: values.monthTotalPay,
                      booksUniformTotal: values.booksUniformTotal,
                    },
                  });
              });
            }
          })
          .catch((error) => {
            swal(error1, {
              icon: "error",
            });
          });
    });
  };

  // Schema Of Yup
  schema = () => {
    const pageLanguage = this.props.language;
    // Language KEywords
    const { required } = this.state.langKeywords[pageLanguage];

    const schema = Yup.object().shape({
      inscriptionTax: Yup.number().required(required),
      booksUniformTotal: Yup.number().required(required),
      monthTotalPay: Yup.number().required(required),
    });
    return schema;
  };

  render() {
    //inscription details
    const inscription = this.state.inscriptionDetails;
    const pageLanguage = this.props.language;
    const { updateTaxes } = this.state.langKeywords[pageLanguage];
    return (
      <div className="update-taxes">
        <div className="col-12 text-center">
          <h2 className="title-of-middle">{updateTaxes}</h2>
        </div>

        {/* Start Formik */}
        <Formik
          enableReinitialize={true}
          initialValues={{
            inscriptionTax: inscription.inscriptionTax,
            booksUniformTotal: inscription.booksUniformTotal,
            monthTotalPay: inscription.monthTotalPay,
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
export default connect(mapStateToProps)(UpdateGradeTaxes);
