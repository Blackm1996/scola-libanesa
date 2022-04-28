import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
//import { Container, Button, Row, Col, Spinner } from "reactstrap";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import axios from "axios";
//import { users } from "./usersAPI";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";

class AllStudentsTable extends React.Component {
  //state
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    sectionOptions: { A: "A", B: "B", C: "C", D: "D" },
    classOptions: {
      class1: "class1",
      class2: "class2",
      class3: "class3",
      class4: "class4",
      class5: "class5",
      class6: "class6",
    },
    users: [],
  };

  // component did mount
  componentDidMount = () => {
    axios
      .get("/api/student")
      .then((response) => {
        this.setState({
          users: response.data,
        });
      });
  };
  //filter by Id
  filterById = (filterVal, data) => {
    if (filterVal) {
      return data.filter((student) =>
        student.id.toString().startsWith("" + filterVal.toString())
      );
    }
    return data;
  };

  //filter by first name
  filterByFirstName = (filterVal, data) => {
    if (filterVal) {
      return data.filter((student) =>
        student.First_Name.toLowerCase().startsWith(
          "" + filterVal.toLowerCase()
        )
      );
    }
    return data;
  };

  //filter by last name
  filterByLastname = (filterVal, data) => {
    if (filterVal) {
      return data.filter((student) =>
        student.Last_Name.toLowerCase().startsWith("" + filterVal.toLowerCase())
      );
    }
    return data;
  };

  //render
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { titlePage, firstName, lastName } =
      this.state.langKeywords[pageLanguage];
    console.log("first Name", lastName);
    const classOptions = this.state.classOptions;
    const sectionOptions = this.state.sectionOptions;

    var firstNameFilter = "";
    var lastNameFilter = "";
    var classFilter = "";
    var sectionFilter = "";

    const columns = [
      {
        dataField: "id",
        text: "ID",
        sort: true,
        filter: textFilter({
          onFilter: this.filterById,
        }),
      },
      {
        dataField: "Last_Name",
        text: `${firstName}`,
        sort: true,
        filter: textFilter(),
        filter: textFilter({
          onFilter: this.filterByLastname,
        }),
      },
      {
        dataField: "First_Name",
        text: `${lastName}`,
        sort: true,
        filter: textFilter({
          onFilter: this.filterByFirstName,
        }),
      },
    ];
    const tableRowEvents = {
      onClick: (e, row, rowIndex) => {
        this.props.history.push("/admin/profile/" + row.id);
      },
    };

    //default sorted
    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    return (
      <div className="all-students">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{titlePage}</h2>
          </div>
          {/* start Students table*/}
          <div className="students-table">
            <BootstrapTable
              bootstrap4
              keyField="id"
              data={this.state.users}
              columns={columns}
              filter={filterFactory()}
              pagination={paginationFactory()}
              rowEvents={tableRowEvents}
              defaultSorted={defaultSorted}
            />
          </div>
          {/* end Students table*/}
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

export default connect(mapStateToProps)(AllStudentsTable);
