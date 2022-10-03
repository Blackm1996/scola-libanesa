import React from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { withRouter } from "react-router-dom";
import jsPDF from "jspdf";
import { connect } from "react-redux";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import autoTable from "jspdf-autotable";
import "./style.css";
//view grade taxes
import ViewGrade from "../../Grades/ViewGrade";
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, Tabs, Tab } from "@mui/material";
import styles from "./style.module.css";
import CoursesScoresTable from "./Components/CoursesScoresTable";

class StudentsGrade extends React.Component {
  //state
  state = {
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    gradeName: "...loading",
    dataAPI: [],
    data: [], // data and dataAPI are same but data is used for search and dataAPI is fixed
    loading: true,
    selectedTab: 0,
    gradeDetails: [
      {
        Default_Inscription_tax: "...loading",
        Default_Monthly_pay: "...loading",
        Default_Books_Uniform_total: "...loading",
      },
      {
        courses: [],
      },
    ], // grade taxes and courses and its scores
  };

  // component did mount
  componentDidMount = () => {
    axios
      .get(`/section/${this.props.match.params.id}/${this.props.year}`)
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
          gradeName: response.data.gradeName,
          dataAPI: students,
          data: students,
          loading: false,
        });
      });

    //get grade taxes and grade courses and scores
    axios
      .get(`/gradeStats/${this.props.match.params.id}`)
      .then((response) => {
        this.setState({
          gradeDetails: response.data,
        });
      })
      .catch((error) => console.log("error"));
  };

  // when props changed
  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
    });
    axios
      .get(`/section/${nextProps.match.params.id}/${nextProps.year}`)
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
          gradeName: response.data.gradeName,
          dataAPI: students,
          data: students,
          loading: false,
        });
      });
    //get grade taxes and grade courses and scores
    this.setState({
      gradeName: "...loading",
      gradeDetails: [
        {
          Default_Inscription_tax: "...loading",
          Default_Monthly_pay: "...loading",
          Default_Books_Uniform_total: "...loading",
        },
        {
          courses: [],
        },
      ],
    });
    axios
      .get(`/gradeStats/${nextProps.match.params.id}`)
      .then((response) => {
        this.setState({
          gradeDetails: response.data,
        });
      })
      .catch((error) => console.log("error"));
  }

  // on Row click
  onRowClick = (event, rowData) => {
    //this.props.history.push("/admin/profile/" + rowData.id);
    window.open("/admin/profile/" + rowData.id,'_blank');
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
  //print grade as pdf
  printAsPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    let wantedTableWidth = 500;
    let pageWidth = doc.internal.pageSize.width;
    let margin = (pageWidth - wantedTableWidth) / 2;
    // add title
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { grade } = this.state.langKeywords[pageLanguage];
    const text = `${grade}: ${this.state.gradeName}`;
    const xOffset =
      doc.internal.pageSize.width / 2 -
      (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / 2;
    doc.text(text, xOffset, 40);

    doc.autoTable({
      html: "#table1",
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

  // print grade directly
  printGrade = () => {
    window.print();
  };

  //handle tabs change
  handle = (event, newValue) => {
    this.setState({
      selectedTab: newValue,
    });
  };

  printList = ()=>{
    axios
    .get(`/gradeBirthDayList/${this.props.match.params.id}`)
    .then((response)=>{
      let binaryString = window.atob(response.data);

      let binaryLen = binaryString.length;
      
      let bytes = new Uint8Array(binaryLen);
      
      for (let i = 0; i < binaryLen; i++) {
          let ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
      }
      
      let blob = new Blob([bytes], {type: "application/pdf"});
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    });
  }
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
      students,
      coursesAndScores,
    } = this.state.langKeywords[pageLanguage];

    const columns = [
      { title: `${studentId}`, field: "id" },
      { title: `${prename}`, field: "firstName" },
      { title: `${name}`, field: "lastName" },
    ];
    const theme = createTheme({
      overrides: {
        MuiTabs: {
          indicator: {
            backgroundColor: "#ee664e",
          },
        },
      },
    });
    const thema=createTheme();
    return (
      <div className="all-students">
        <div className="container-fluid">
          {/* start grade details section */}
          <ViewGrade
            gradeTaxes={this.state.gradeDetails[0]}
            gradeName={this.state.gradeName}
          />
          {/* end grade details section */}
          
          {/* start print table */}
          <div id="table-of-section" style={{ display: "block" }}>
            <h1 className="text-center d-none d-print-block mb-4">
              {this.state.gradeName}
            </h1>
            <div className="d-none d-print-block">
              <table className="table">
                <tbody>
                  {this.state.dataAPI.map((student, index) => {
                    return (
                      <tr key={index}>
                        <td>{`${student.firstName}  ${student.lastName} `}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* end print table */}

          {/* start tabs  */}
          <div className={` d-print-none tabs ${styles.tabs}`}>
            <Box sx={{ marginBottom: 8, paddingRight: 4, paddingLeft: 4 }}>
              <ThemeProvider theme={theme}>
                <Tabs
                  value={this.state.selectedTab}
                  onChange={this.handle}
                  TabIndicatorProps={{
                    style: { background: "primary" },
                  }}
                >
                  <Tab label={students} />
                  <Tab label={coursesAndScores} />
                </Tabs>
              </ThemeProvider>
            </Box>
            {/* start tab1 students table */}
            {this.state.selectedTab === 0 && (
              <Box
                sx={{ marginRight: 10, marginLeft: 10, position: "relative" }}
              >
                {/* start table students and print button */}
                {this.state.loading ? (
                  <div>loading...</div>
                ) : (
                  <ThemeProvider theme={thema}>
                    <MaterialTable
                      title={this.state.gradeName}
                      columns={columns}
                      options={{
                        debounceInterval: 700,
                        padding: "dense",
                        pageSize: 20,
                        pageSizeOptions: [20, 30, 50],
                      }}
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
                    {/* start print grade button */}
                    {this.state.dataAPI.length > 0 ? (
                      <div className="form-group col-12">
                        <button
                          className="btn btn-primary btn-block print mx-auto mt-4"
                          onClick={this.printGrade}
                        >
                          <i className="fa fa-print"></i> <span>{print}</span>
                        </button>
                      </div>
                    ) : null}
                    {/* end print grade button */}
                  </ThemeProvider>
                )}
                <button onClick={this.printList}>students Birthday</button>
              </Box>
            )}

            {this.state.selectedTab === 1 &&
              (this.state.gradeDetails[1].courses.length === 0 ? (
                <div>No courses</div>
              ) : (
                <CoursesScoresTable coursesObj={this.state.gradeDetails[1]} />
              ))}

            {/* end tab1 students table */}
          </div>
          {/* end */}
          
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    year: state.schoolYear,
  };
};

export default connect(mapStateToProps)(withRouter(StudentsGrade));
