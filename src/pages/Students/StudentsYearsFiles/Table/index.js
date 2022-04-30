import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export default class StudentsTable extends Component {
  state = {
    yearsFiles: [
      {
        id: 1,
        year: "2018",
        inscriptionTax: 444,
        booksUniformTotal: 15.77,
        monthTotalPay: 966,
        monthStart: "April",
      },
      {
        id: 1,
        year: "2018",
        inscriptionTax: 444,
        booksUniformTotal: 15.77,
        monthTotalPay: 966,
        monthStart: "April",
      },
    ],
  };

  //deleteStudent
  deleteStudent = (id) => {};
  componentDidMount = () => {};

  render() {
    return (
      <div className="years-files">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">File of years</h2>
          </div>
        </div>

        {/* Start add  button section*/}
        <div className="col-12 add">
          <button className="btn plus">
            <Link to="/admin/students/addyearfile">
              <i className="fa fa-plus"></i>
            </Link>
          </button>
        </div>

        <div style={{ "overflow-x": "auto" }}>
          <table>
            <tr>
              <th>Year</th>
              <th>Inscription tax</th>
              <th>Books uniform total</th>
              <th>Monthly total payment</th>
              <th>Month start</th>
              <th></th>
              <th></th>
            </tr>
            {this.state.yearsFiles.length === 0 ? (
              <div>empty</div>
            ) : (
              this.state.yearsFiles.map((file, index) => (
                <tr>
                  <td>{file.year}</td>
                  <td>{file.inscriptionTax}</td>
                  <td>{file.booksUniformTotal}</td>
                  <td>{file.monthTotalPay}</td>
                  <td>{file.monthStart}</td>
                  <td>
                    <Link
                      className="edit"
                      to={"/admin/students/studentsyearsfiles/edit/" + file.id}
                    >
                      <i className="fa fa-edit"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="delete btn"
                      onClick={() => this.deleteStudent(file.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </table>
        </div>
      </div>
    );
  }
}
