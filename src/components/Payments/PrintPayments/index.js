import React, { Component } from "react";
import printImage from "../../../images/new-escola-logo3.png";
import { withRouter } from "react-router-dom";
import styles from './style.module.css';
import "./style.css";

class PrintTable extends Component {
  state = {
    name: "",
    grade: "",
    telephone: "",
    inscriptionTax: "",
    booksUniform: "",
  };
  componentDidMount = () => {
    
  };
  //print payment
  printPayment = () => {
    
  };
  render() {
    const { name, grade, telephone, inscriptionTax, booksUniform } = this.props.printDetails;
    return (
      <>
        {/* start print section */}
        <div className="print">
          {/* start add bill table for printer */}
          <div className="print-bill">
            {/* start logo */}
            <div className="logo-and-title d-flex flex-column align-items-start col-12 mx-auto">
              <div>
                <img src={printImage} href="escola logo" />
              </div>
            </div>
            <div className={`${styles.title} text-uppercase col-12 text-center mx-auto h3 font-weight-bold`}>
              LISTA INDIVIDUAL DE PAGAMENTO DOS ALUNOS
            </div>
            {/* end logo */}

            {/* start header */}
            <div className="header border-right border-top border-left border-dark col-12 mx-auto">
              <div className="row text-center">
                <div className="col-6 item border-right border-dark border-bottom text-uppercase">
                  NOME-APELIDO
                </div>
                <div className="col-6 item border-dark border-bottom">
                  {name}
                </div>
              </div>
              <div className="row text-center">
                <div className="col-6 item border-right border-dark border-bottom text-uppercase">
                  TURMA :
                </div>
                <div className="col-6 item border-dark border-bottom">
                  {grade}
                </div>
              </div>
              <div className="row text-center">
                <div className="col-6 item border-right border-dark border-bottom text-uppercase">
                  TELEPHONE DO ENCARREGADO:
                </div>
                <div className="col-6 item border-dark border-bottom">
                  {telephone}
                </div>
              </div>
              <div className="row text-center">
                <div className="col-6 item border-right border-dark border-bottom text-uppercase">
                  INSCRIÇÃO
                </div>
                <div className="col-6 item border-dark border-bottom">
                  {inscriptionTax}
                </div>
              </div>
              <div className="row text-center">
                <div className="col-6 item border-right border-dark border-bottom text-uppercase">
                  LIVROS E UNIFORMS
                </div>
                <div className="col-6 item border-dark border-bottom">
                  {booksUniform}
                </div>
              </div>
            </div>
            {/* end start header*/}

            <div className="body border-right border-top border-left border-dark col-12 mx-auto">
              <div className="row titles">
                <div className="col-6 item border-right border-dark border-bottom d-flex justify-content-center align-items-center text-uppercase pt-0 pb-0">
                  MÊSES
                </div>
                <div className="col-2 item border-dark border-bottom border-right text-uppercase text-center">
                  DATE DE <br />
                  PAGAMENTO
                </div>
                <div className="col-2 item border-dark border-bottom border-right text-uppercase text-center">
                  VALORES EM <br />
                  (FCFA)
                </div>
                <div className="col-2 item border-dark border-bottom text-uppercase text-center">
                  ASSIGNATURA
                </div>
              </div>
              <div className="row">
                {[
                  "SETEMBRO",
                  "OUTUBRO",
                  "NOVEMBRO",
                  "DEZEMBRO",
                  "JANEIRO",
                  "FEVEREIRO",
                  "MARÇO",
                  "ABRIL",
                  "MAIO",
                  "JUNHO",
                ].map((month) => {
                  return (
                    <>
                      <div className="col-6 item border-right border-dark border-bottom text-uppercase text-center">
                        {month}
                      </div>
                      <div className="col-2 item border-dark border-bottom border-right text-center"></div>
                      <div className="col-2 item border-dark border-bottom border-right text-center"></div>
                      <div className="col-2 item border-dark border-bottom text-center"></div>
                    </>
                  );
                })}
              </div>
            </div>
            {/* start second table */}
            {/* end second table */}

            {/* start signature section */}
            <div className="signature d-flex col-12 mx-auto justify-content-end align-items-center">
              <div className="col-5 font-weight-bold d-flex justify-content-center">
                La direction
              </div>
            </div>
            {/* end signature section */}
          </div>
          {/* end add bill table for printer */}
        </div>
        {/* end print section */}
        
      </>
    );
  }
}

export default withRouter(PrintTable);
