import React from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import "./style.css";
import jsPDF from "jspdf";
import { connect } from "react-redux";
import autoTable from "jspdf-autotable";
import PrintPayments from "../../../components/Payments/PrintPayments";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import Tabs from "../../../components/Tabs";
import styles from "./style.module.css";

class StudentsSection extends React.Component {
  //state
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    sectionName: "",
    gradeName: "",
    dataAPI: [],
    data: [], // data and dataAPI are same but data is used for search and dataAPI is fixed
    loading: true,
    studentsBills: [],
    printBills: false,
    printSection: false,
  };

  // component did mount
  componentDidMount = () => {
    axios
      .get(
        `https://management.escola-libanesa.com/test2/api/sectionStudents/${this.props.match.params.id}/2021-2022`
      )
      .then((response) => {
        let students = response.data.students;
        students = students.map((student) => {
          return {
            id: student.id,
            firstName: student.First_Name,
            lastName: student.Last_Name,
            telephone: student.Tel === null ? "" : student.Tel,
          };
        });
        this.setState({
          sectionName: response.data.sectionName,
          gradeName: response.data.gradeName,
          dataAPI: students,
          data: students,
          loading: false,
        });
      });

    // students bills
    axios
      .get(
        `https://management.escola-libanesa.com/test2/api/sectionBills/${this.props.match.params.id}/2021-2022`
      )
      .then((response) => {
        var studentsBills = [];

        response.data.map((student) => {
          let bill = {};
          bill.name = `${student.First_Name} ${student.Last_Name}`;
          bill.grade = student.grade === null ? "" : student.grade;
          bill.telephone = student.Tel === null ? "" : student.Tel;
          bill.inscriptionTax = student.Inscription_Tax;
          bill.booksUniform = student["Books/Uniform_total"];
          studentsBills.push(bill);
        });
        this.setState({
          studentsBills: [...studentsBills],
        });
      });
  };

  // when props changed
  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
    });
    axios
      .get(
        `https://management.escola-libanesa.com/test2/api/sectionStudents/${nextProps.match.params.id}/2021-2022`
      )
      .then((response) => {
        let students = response.data.students;

        students = students.map((student) => {
          return {
            id: student.id,
            firstName: student.First_Name,
            lastName: student.Last_Name,
          };
        });
        this.setState({
          dataAPI: students,
          data: students,
          loading: false,
          sectionName: response.data.sectionName,
          gradeName: response.data.gradeName,
        });
      });
    // students bills
    axios
      .get(
        `https://management.escola-libanesa.com/test2/api/sectionBills/${nextProps.match.params.id}/2021-2022`
      )
      .then((response) => {
        var studentsBills = [];

        response.data.map((student) => {
          let bill = {};
          bill.name = `${student.First_Name} ${student.Last_Name}`;
          bill.grade = student.grade === null ? "" : student.grade;
          bill.telephone = student.Tel === null ? "" : student.Tel;
          bill.inscriptionTax = student.Inscription_Tax;
          bill.booksUniform = student["Books/Uniform_total"];
          studentsBills.push(bill);
        });
        this.setState({
          studentsBills: [...studentsBills],
        });
      });
  }

  // on Row click
  onRowClick = (event, rowData) => {
    this.props.history.push("/admin/profile/" + rowData.id);
  };

  //on search change
  onSearchChange = (query) => {
    let students = this.state.dataAPI.filter((student) => {
      let { id, firstName, lastName } = student;
      firstName = firstName.toLowerCase();
      lastName = lastName.toLowerCase();
      if (
        id.toString().startsWith(query) ||
        firstName.startsWith(query.toLowerCase()) ||
        lastName.startsWith(query.toLowerCase())
      ) {
        return student;
      }
    });
    this.setState({
      data: students,
    });
  };

  //print section as pdf
  printAsPDF = () => {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { section } = this.state.langKeywords[pageLanguage];
    const doc = new jsPDF("p", "pt", "a4");

    let wantedTableWidth = 500;
    let pageWidth = doc.internal.pageSize.width;
    let margin = (pageWidth - wantedTableWidth) / 2;
    // add title
    const text = `${section}: ${this.state.sectionName}`;
    const xOffset =
      doc.internal.pageSize.width / 2 -
      (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / 2;
    doc.text(text, xOffset, 40);

    doc.autoTable({
      html: "#table-of-section",
      margin: { top: 80, left: margin, right: margin },
      tableWidth: 500,
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.75,
      theme: "grid",
      bodyStyles: {
        fontSize: 13,
        cellPadding: 10,
      },
    });
    doc.save("table.pdf");
  };

  // print section directly
  async printSection() {
    this.setState({
      printSection: true,
      printBills: false,
    });
    return Promise.resolve("print");
  }

  //print Bills directly
  printBills2 = () => {
    this.setState({
      printSection: false,
      printBills: true,
    });
    return "print";
  };
  async printBills() {
    this.setState({
      printSection: false,
      printBills: true,
    });
    return Promise.resolve("print");
  }
  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { search, noRecords, print, prename, name, studentId, printStudents, printBills } =
      this.state.langKeywords[pageLanguage];

    const columns = [
      { title: `${studentId}`, field: "id" },
      { title: `${prename}`, field: "lastName" },
      { title: `${name}`, field: "firstName" },
    ];

    //grade-section name
    const gradeAndSection = `${this.state.gradeName}-${this.state.sectionName}`;

    return (
      <div className="all-students">
        <div className="container-fluid">
          {/* start print bills  */}
          <div
            className={` ${
              this.state.printBills === true ? "d-print-block" : "d-print-none"
            }`}
          >
            {this.state.studentsBills.map((bill) => {
              return <PrintPayments printDetails={bill} />;
            })}
          </div>
          {/* end print bills */}

          {/* start print table */}
          <div
            id="table-of-section"
            className={` ${
              this.state.printSection === true ? "d-block" : "d-none"
            }`}
          >
            {" "}
            {/* none only for testing */}
            {/* 
            <h1 className="text-center d-none d-print-block mb-4">
              <span>{this.state.gradeName}</span> -{" "}
              <span>{this.state.sectionName}</span>
            </h1>
            */}
            <div className="d-none d-print-block">
              <table className="table">
                <thead>
                  <tr>
                    <td>Nome-Apelido</td>
                    <td>Turma-Seção</td>
                    <td>Telefone</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.dataAPI.map((student, index) => {
                    return (
                      <tr key={index}>
                        <td>{`${student.firstName}  ${student.lastName} `}</td>
                        <td>{gradeAndSection}</td>
                        <td>{student.telephone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* end print table */}

          {/* start Students table*/}
          {this.state.loading ? (
            <div className="loading">...loading</div>
          ) : (
            <div className="students-table col-10 mx-auto d-print-none">
              {" "}
              {/* d-print-none hide this element on print */}
              <MaterialTable
                title={`${this.state.gradeName} - ${this.state.sectionName}`}
                columns={columns}
                options={{ debounceInterval: 700, padding: "dense" }}
                data={this.state.data}
                onRowClick={this.onRowClick}
                onSearchChange={this.onSearchChange}
                localization={{
                  toolbar: { searchPlaceholder: `${search}` },
                  body: {
                    emptyDataSourceMessage: `${noRecords}`,
                  },
                }}
              />
              {/* start print button section */}
              {this.state.dataAPI.length > 0 ? (
                <div className="form-group col-12">
                  <button
                    className={` ${styles.button} btn btn-primary btn-block mx-auto mt-4 `}
                    onClick={() =>
                      this.printSection().then((resp) => window.print())
                    }
                  >
                    <i className="fa fa-print"></i> <span>{ printStudents }</span>
                  </button>
                </div>
              ) : null}
              {/* start print button section */}
              {this.state.studentsBills.length > 0 ? (
                <div className="form-group col-12">
                  <button
                    className={` ${styles.button} btn btn-primary btn-block mx-auto mt-4 `}
                    onClick={() =>
                      this.printBills().then((resp) => window.print())
                    }
                  >
                    <i className="fa fa-print"></i> <span>{ printBills }</span>
                  </button>
                </div>
              ) : null}
              {/* end bills button section */}
              {/* start trash edit icons sectio*/}
              <div className="trash-and-edit">
                <Link
                  to={`/admin/students/updatesection/${this.props.match.params.id}`}
                >
                  <i className="fa fa-edit" onClick={this.updateStudent}></i>
                </Link>
              </div>
              {/* end trash edit icons sectio*/}
              {/* end print button section */}
            </div>
          )}

          {/* end Students table*/}

          {/* start tabs */}
           <Tabs />
          {/* end tabs */}
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

export default connect(mapStateToProps)(withRouter(StudentsSection));
