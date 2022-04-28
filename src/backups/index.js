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
import StudentCardDetails from "../../../components/StudentCardDetails";
import StudentsMarks from "../../../components/StudentMarks";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import { Box, Tabs, Tab } from "@material-ui/core";
import styles from "./style.module.css";
//import Tabs from '../../../components/Tabs/';
import Page1 from "./TabsPages/TeacherCoursesTable/Page1";
import Page2 from "./TabsPages/ScoresTable/Page2";
import Page3 from "./TabsPages/AddScores";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import swal from "sweetalert";

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
    printEmptyTable: false,
    printMarks: true,
    selectedTab: 0,
    updatePagesProps: false,
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
          bill.name = `${student.First_Name} ${student.Last_Name} `;
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

  //handle tabs change
  handle = (event, newValue) => {
    this.setState({
      selectedTab: newValue,
    });
  };

  // when props changed
  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
      updatePagesProps: nextProps.match.params.id,
      sectionName: "",
      gradeName: "...loading",
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
          bill.name = `${student.Last_Name} ${student.First_Name} `;
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
      printEmptyTable: false,
    });
    return Promise.resolve("print");
  }
  // print empty table
  async printEmptyTable() {
    this.setState({
      printSection: false,
      printBills: false,
      printEmptyTable: true,
    });
    return Promise.resolve("print");
  }

  //print Bills directly
  printBills2 = () => {
    this.setState({
      printSection: false,
      printBills: true,
      printEmptyTable: false,
    });
    return "print";
  };
  async printBills() {
    this.setState({
      printSection: false,
      printBills: true,
      printEmptyTable: false,
    });
    return Promise.resolve("print");
  }
  //delete section
  deleteSection = () => {
    // Page Lang
    const pageLanguage = this.props.language;
    console.log(`page lang`, pageLanguage);
    // Language KEywords
    const { deleteMessage, deleteSectionFailed, success } =
      this.state.langKeywords[pageLanguage];
    swal({
      title: deleteMessage,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `https://management.escola-libanesa.com/test2/api/section/${this.props.match.params.id}`
          )
          .then((response) => {
            if (response.status == 200) {
              swal(success, {
                icon: "success",
              }).then((success) => {
                this.props.history.push("/admin");
              });
            } else {
              swal(deleteSectionFailed, {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal(deleteSectionFailed, {
              icon: "error",
            });
          });
      }
    });
  };
  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const {
      search,
      noRecords,
      print,
      prename,
      name,
      studentId,
      printStudents,
      printBills,
      printStudentsList,
      students,
      teachers,
      scores,
      addScores,
    } = this.state.langKeywords[pageLanguage];

    const columns = [
      { title: `${studentId}`, field: "id" },
      { title: `${prename}`, field: "firstName" },
      { title: `${name}`, field: "lastName" },
    ];

    //grade-section name
    const gradeAndSection = `${this.state.gradeName}-${this.state.sectionName}`;
    const theme = createMuiTheme({
      overrides: {
        MuiTabs: {
          indicator: {
            backgroundColor: "#ee664e",
          },
        },
      },
    });
    return (
      <div className="all-students">
        <div className="container-fluid">
          <div className="text-center col-12 d-print-none">
            <h2 className="title-of-middle">
              <span className="mr-2">{this.state.gradeName}</span>-
              <span className="ml-3">{this.state.sectionName}</span>
            </h2>
          </div>
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

          {/* start print table */}
          <div
            className={` ${
              this.state.printEmptyTable === true ? "d-block" : "d-none"
            }`}
            style={{ width: "1000px", marginLeft: "-175px" }}
          >
            <div className="d-none d-print-block">
              <h2 className="text-center">
                <span className="mr-3">{this.state.gradeName}</span>-
                <span className="ml-3">{this.state.sectionName}</span>
              </h2>
              <table className="table">
                <thead>
                  <tr>
                    <td style={{ width: "50%", fontSize: 25 }}>Nome-Apelido</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.dataAPI.map((student, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{ fontSize: 25 }}
                        >{`${student.firstName}  ${student.lastName}`}</td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* end print table */}

          {/* start print table */}
          <div
            className={` ${
              this.state.printMarks === true ? "d-block" : "d-none"
            }`}
            style={{ width: "1000px", marginLeft: "-175px" }}
          >
            <div className="d-none d-print-block">
              <StudentsMarks />
            </div>
          </div>
          {/* end print table */}

          {/* end Students table*/}

          {/* start tabs  */}
          <div className={` d-print-none tabs ${styles.tabs}`}>
            {/* start trash edit icons sectio*/}
            <div className={styles.trashAndEdit}>
              <span>
                <i className="fa fa-trash" onClick={this.deleteSection}></i>
              </span>
              <Link
                to={`/admin/students/updatesection/${this.props.match.params.id}`}
              >
                <i className="fa fa-edit" onClick={this.updateStudent}></i>
              </Link>
            </div>
            {/* end trash edit icons sectio*/}
            <Box sx={{ marginBottom: 40, paddingRight: 4, paddingLeft: 4 }}>
              <MuiThemeProvider theme={theme}>
                <Tabs
                  value={this.state.selectedTab}
                  onChange={this.handle}
                  TabIndicatorProps={{
                    style: { background: "primary" },
                  }}
                >
                  <Tab label={students} />
                  <Tab label={teachers} />
                  <Tab label={scores} />
                  <Tab label={addScores} />
                </Tabs>
              </MuiThemeProvider>
            </Box>

            {this.state.selectedTab === 0 && (
              <Box
                sx={{ marginRight: 136, marginLeft: 136, position: "relative" }}
              >
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
                      <i className="fa fa-print"></i>{" "}
                      <span>{printStudents}</span>
                    </button>
                  </div>
                ) : null}
                {/* start print button section */}

                {/* start print empty table button */}
                {this.state.dataAPI.length > 0 ? (
                  <div className="form-group col-12">
                    <button
                      className={` ${styles.button} btn btn-primary btn-block mx-auto mt-4 `}
                      onClick={() =>
                        this.printEmptyTable().then((resp) => window.print())
                      }
                    >
                      <i className="fa fa-print"></i>{" "}
                      <span>{printStudentsList}</span>
                    </button>
                  </div>
                ) : null}

                {/* end print empty table button */}
                {this.state.studentsBills.length > 0 ? (
                  <div className="form-group col-12">
                    <button
                      className={` ${styles.button} btn btn-primary btn-block mx-auto mt-4 `}
                      onClick={() =>
                        this.printBills().then((resp) => window.print())
                      }
                    >
                      <i className="fa fa-print"></i> <span>{printBills}</span>
                    </button>
                  </div>
                ) : null}
                {/* end bills button section */}
              </Box>
            )}
            {this.state.selectedTab === 1 && (
              <Page1 updatePagesProps={this.state.updatePagesProps} />
            )}
            {this.state.selectedTab === 2 && (
              <Page2 updatePagesProps={this.state.updatePagesProps} />
            )}
            {this.state.selectedTab === 3 && (
              <Page3 updatePagesProps={this.state.updatePagesProps} />
            )}
          </div>
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
