import React, { Component, useEffect } from "react";
import "./style.css";
import logoImg from "../../images/school-logo2.png";
import signature from "../../images/Sign.png";
import signatureImg from "../../images/Stamp.png";
import { useRowState } from "react-table";

const StudentDetails = ({ details }) => {
  const { id, First_Name, Last_Name, School_Year, gradeName, sectionName } =
    details;
  return (
    <div
      style={{ height: 180 }}
      className="d-flex border-top border-bottom border-dark"
    >
      <div
        className="d-flex border-right border-dark"
        style={{ width: "31.8%" }}
      >
        <div
          className={`schoolImg d-flex align-items-center justify-content-center`}
          style={{ flexGrow: 1 }}
        >
          <img
            src={logoImg}
            alt="elissa school logo"
            style={{ width: "90px", height: "90px", marginTop: "-7px" }}
          />
        </div>
        <div
          className="d-flex flex-column justify-content-center"
          style={{ flexGrow: 1 }}
        >
          <div className="text-left w-100">Escola</div>
          <div className="text-left w-100">Libanesa</div>
          <div className="text-left w-100">International</div>
        </div>
      </div>
      <div style={{ width: "70%" }}>
        <div
          style={{ height: "70%" }}
          className="d-flex border-bottom border-dark"
        >
          <div className="pt-2 w-50 border-right border-dark">
            <div>
              Nome/Apelido :
              <br />
              Nom et Prénom :
            </div>
            <div className="pt-2">{`${First_Name} ${Last_Name}`}</div>
          </div>
          <div className="pt-2 d-flex flex-column w-50">
            <div
              className="border-bottom border-dark text-left pl-2"
              style={{ flexGrow: 5 }}
            >
              Ano Letivo <br /> Année Scolaire
              <span className="pl-3">{School_Year}</span>
            </div>
            <div className="text-left pl-2" style={{ flexGrow: 1 }}>
              ID: {id}
            </div>
          </div>
        </div>
        <div className="d-flex" style={{ height: "30%" }}>
          <div className="border-right border-dark w-50 text-left pl-2">
            Classe:{" "}
            <span className="pl-2">{`${gradeName} - ${sectionName}`}</span>
          </div>
          <div className="w-50"></div>
        </div>
      </div>
    </div>
  );
};

const Body = (props) => {
  const { langName, coefficient, scores } = props.langScores;
  return (
    <div
      className="body d-flex border-bottom border-dark"
      style={{ height: "35px", fontSize: 19 }}
    >
      <div
        className="border-right border-dark text-left pd-4 pl-3 d-flex"
        style={{ width: "34%" }}
      >
        {langName}
      </div>
      <div className="d-flex" style={{ width: "66%" }}>
        <div className="border-right border-dark" style={{ width: 40 }}>
          {coefficient}
        </div>
        {scores.map((score, index) => (
          <div
            className="border-right border-dark"
            style={{ width: "90px", flexGrow: 1 }}
          >
            {score}
          </div>
        ))}
      </div>
    </div>
  );
};
const EmptyRow = () => {
  return (
    <div
      className="body d-flex border-bottom border-dark"
      style={{ height: /*"25px"*/ 35 }}
    >
      <div
        className="border-right border-dark text-left pd-4 pl-3 d-flex"
        style={{ width: "34%" }}
      ></div>
      <div className="d-flex" style={{ width: "66%" }}>
        <div className="border-right border-dark" style={{ width: 40 }}></div>

        <div
          className="border-right border-dark"
          style={{ width: "90px", flexGrow: 1 }}
        ></div>
        <div
          className="border-right border-dark"
          style={{ width: "90px", flexGrow: 1 }}
        ></div>
        <div
          className="border-right border-dark"
          style={{ width: "90px", flexGrow: 1 }}
        ></div>
        <div
          className="border-right border-dark"
          style={{ width: "90px", flexGrow: 1 }}
        ></div>
        <div
          className="border-right border-dark"
          style={{ width: "90px", flexGrow: 1 }}
        ></div>
        <div
          className="border-right border-dark"
          style={{ width: "90px", flexGrow: 1 }}
        ></div>
      </div>
    </div>
  );
};
const Total = ({ total }) => {
  const { coefficient, scores } = total;
  return (
    <div
      className="body d-flex border-bottom border-dark"
      style={{ height: 35, fontSize: 19 }}
    >
      <div
        className="border-right border-dark text-left pd-4 pl-3 d-flex"
        style={{ width: "34%" }}
      >
        Total
      </div>
      <div className="d-flex" style={{ width: "66%" }}>
        <div className="border-right border-dark" style={{ width: 40 }}>
          {coefficient}
        </div>
        {scores.map((score, index) => (
          <div
            className="border-right border-dark"
            style={{ width: "90px", flexGrow: 1 }}
          >
            {score !== 0 && score}
          </div>
        ))}
      </div>
    </div>
  );
};
const Moyenne = ({ moyenne, totalMoyenne }) => {
  const { coefficient, scores } = moyenne;
  return (
    <div>
      <div className="d-flex border-bottom border-dark">
        <div className="d-flex" style={{ width: "92%", fontSize: 19 }}>
          <div
            className="border-right border-dark text-left pl-3 "
            style={{ width: "34%" }}
          >
            Media Geral <br />
            Moyen Général
          </div>
          <div className="d-flex" style={{ width: "66%" }}>
            <div
              className="border-right d-flex justify-content-center align-items-center border-dark"
              style={{ width: 40 }}
            >
              {coefficient}
            </div>
            {scores.map((score, index) => (
              <div
                className="border-right border-dark d-flex justify-content-center align-items-center "
                style={{ width: "90px", flexGrow: 1 }}
              >
                {parseInt(score) !== 0 && score}
              </div>
            ))}
          </div>
        </div>
        <div
          className=" border-dark border-top  d-flex justify-content-center align-items-center"
          style={{ width: "8%", marginTop: "-1px" }}
        >
          {totalMoyenne}
        </div>
      </div>
    </div>
  );
};
const Observation = ({totalMoyenne}) => {
  var sucFR="";
  var sucPr="";
  if(totalMoyenne>=10)
  {
    sucFR="Passe en classe supérieure.";
    sucPr="Aprovado pelo nível a seguir.";
  }
  return (
    <div>
      <div className="d-flex border-bottom border-dark">
        <div
          className="d-flex"
          style={{ width: "92%", height: "100px", fontSize: 19 }}
        >
          <div
            className="border-right border-dark text-left pl-3 d-flex align-items-center"
            style={{ width: "34%" }}
          >
            Observação <br />
            Observation
          </div>
          <div className="d-flex" style={{ width: "66%" }}>
            <div
              className="border-right border-dark"
              style={{ width: 40 }}
            ></div>

            {/*<div
              className="border-right border-dark"
              style={{ width: "179px" }}
            ></div>
            <div
              className="border-right border-dark"
              style={{ flexGrow: 1 }}
            ></div>*/}

            <div
            className="border-right border-dark text-left pl-3 d-flex align-items-center font-weight-bolder font-italic " 
            style={{ flexGrow: 1, fontSize:26 }}>
              {sucFR}<br/>
              {sucPr}
            </div>
          </div>
        </div>
        <div className="border-left border-dark" style={{ width: 77 }}></div>
      </div>
    </div>
  );
};

class StudentMarks extends Component {
  state = {};
  render() {
    return (
      <div style={{ paddingTop: 90 }}>
        <div className="marks-print clearfix overflow-hidden">
          <div className="first-section mx-auto border-right border-left border-dark">
            {/* start student details section */}
            <StudentDetails details={this.props.obj.studentDetails} />
            {/* end student details section */}
            {/* Start student marks table*/}
            <div className="marks-table" style={{ width: "92%" }}>
              {/* Start table header */}
              <div
                className="d-flex  border-bottom border-dark"
                style={{ height: "108px" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center border-right border-dark"
                  style={{
                    width: "34%",
                  }}
                >
                  DISCIPLINES <br />
                  DISCIPLINA
                </div>
                <div
                  className="d-flex align-items-strech border-right border-dark"
                  style={{ width: "66%" }}
                >
                  <div
                    className="border-right border-dark d-flex justify-content-center align-items-center"
                    style={{ width: 40 }}
                  >
                    <div style={{ transform: "rotate(-90deg)" }}>
                      Notes
                    </div>
                  </div>
                  <div
                    className="d-flex flex-column border-right border-dark"
                    style={{ flexGrow: 1 }}
                  >
                    <div
                      className="border-bottom border-dark d-flex align-items-center justify-content-center"
                      style={{ flexBasis: "80%" }}
                    >
                      Trimestre 1
                    </div>
                    <div className="d-flex" style={{ flexBasis: "26%" }}>
                      <div
                        className="border-right border-dark"
                        style={{ flexGrow: 1 }}
                      >
                        1⁰P
                      </div>
                      <div style={{ flexGrow: 1 }}>2⁰P</div>
                    </div>
                  </div>
                  <div
                    className="d-flex flex-column border-right border-dark"
                    style={{ flexGrow: 1 }}
                  >
                    <div
                      className="border-bottom border-dark d-flex align-items-center justify-content-center"
                      style={{ flexBasis: "80%" }}
                    >
                      Trimestre 2
                    </div>
                    <div className="d-flex" style={{ flexBasis: "26%" }}>
                      <div
                        className="border-right border-dark"
                        style={{ flexGrow: 1 }}
                      >
                        1⁰P
                      </div>
                      <div style={{ flexGrow: 1 }}>2⁰P</div>
                    </div>
                  </div>
                  <div className="d-flex flex-column" style={{ flexGrow: 1 }}>
                    <div
                      className="border-bottom border-dark d-flex align-items-center justify-content-center"
                      style={{ flexBasis: "80%" }}
                    >
                      Trimestre 3
                    </div>
                    <div className="d-flex" style={{ flexBasis: "26%" }}>
                      <div
                        className="border-right border-dark"
                        style={{ flexGrow: 1 }}
                      >
                        1⁰P
                      </div>
                      <div style={{ flexGrow: 1 }}> 2⁰P</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end table header */}

              {/* start table body */}
              {this.props.obj.langScores.map((item, index) => (
                <Body langScores={item} />
              ))}
              {Array.apply(null, {
                length: 20 - this.props.obj.langScores.length,
              }).map((e, i) => (
                <EmptyRow />
              ))}
              

              <Total total={this.props.obj.total} />
            </div>
            {/* end student marks table*/}

            <Moyenne
              moyenne={this.props.obj.moyenne}
              totalMoyenne={this.props.obj.Totalmoyen}
            />
            <Observation totalMoyenne={this.props.obj.Totalmoyen} />
            <div
              className="d-flex border-bottom border-dark"
              style={{ height: 137 }}
            >
              <div
                className="border-right border-dark"
                style={{ width: "54.3%" }}
              ></div>
              <div className="d-flex" style={{ width: "calc(100% - 54.3%)" }}>
                <div style={{ flexGrow: 1 }}>
                  <img
                    src={signature}
                    alt="elissa school logo"
                    style={{
                      width: 154,
                      height: 141,
                      position: "absolute",
                      marginTop: 31,
                      marginLeft: 60,
                    }}
                  />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <img
                    src={signatureImg}
                    alt="elissa school logo"
                    style={{
                      width: "177px",
                      height: "177px",
                      marginTop: "-42px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end Marks section */}
      </div>
    );
  }
}

export default StudentMarks;
