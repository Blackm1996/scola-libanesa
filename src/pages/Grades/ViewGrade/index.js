import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import swal from "sweetalert";
import axios from "axios";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";

function GradeTaxesDetails({ gradeTaxes, gradeName, language }) {
  const [pageLanguage, setPageLanguage] = useState(language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const { inscriptionTax, booksUniformTotal, monthTotalPay, deleteMessage } =
    langKeywords[pageLanguage];

  //use Effect
  useEffect(() => {
    setPageLanguage(language);
  }, [language]);

  var { id } = useParams();
  const history = useHistory();

  //delete grade
  const deleteGrade = (id) => {
    swal({
      title: deleteMessage,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`/grade/${id}`)
          .then((response) => {
             if ( response.status == 204 ) {
               swal( 'success' , {
                  icon: "success",
                })
                .then(response => {
                  history.push('/admin');
                });
             } else {
               swal( 'error' , {
                icon: "error",
              });
             }
          })
          .catch((error) => {
            swal('There is an error, please try again..' , {
              icon: "error",
            });
          });
      }
    });
  };
  return (
    <div className="view-grade">
      <div className="container-fluid">
        {/* start title section */}
        <div className="text-center col-12">
          <h2 className="title-of-middle">{gradeName}</h2>
        </div>
        {/* end title section */}
        {/* start details section*/}
        <div className={`${styles.gradetaxes} mx-auto`}>
          <div>
            {inscriptionTax}: {gradeTaxes.Default_Inscription_tax}
          </div>
          <div>
            {booksUniformTotal} : {gradeTaxes.Default_Books_Uniform_total}
          </div>
          <div>
            {monthTotalPay} : {gradeTaxes.Default_Monthly_pay}
          </div>
          <div className={styles.editDeleteGrade}>
            <DeleteTwoToneIcon onClick={() => deleteGrade(id)} />

            <EditTwoToneIcon
              onClick={() => history.push(`/admin/grades/edit/${id}`)}
            />
          </div>
        </div>
        {/* end details section*/}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(GradeTaxesDetails);
