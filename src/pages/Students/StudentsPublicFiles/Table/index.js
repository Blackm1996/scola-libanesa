import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTable from "react-table";
import "./style.css";

export default class StudentsTable extends Component {
  state = {
    students: [
      {
        id: 1,
        firstName: "mohammad",
        lastName: "haydar",
        birthday: "12/2/4200",
        birthPlace: "kafarsyr",
        telephone: "76712035",
        sex: "male",
        tuteur: "hassn allaw",
      },
      {
        id: 1,
        firstName: "hussein",
        lastName: "alshami",
        birthday: "12/2/4200",
        birthPlace: "kafarsyr",
        telephone: "76712035",
        sex: "male",
        tuteur: "ali harb",
      },
    ],
  };

  //deleteStudent
  deleteStudent = (id) => {
    
  };
  componentDidMount = () => {

  };

  render() {
    const data = [
      {
        name: "Ayaan",
        age: 26,
      },
      {
        name: "Ahana",
        age: 22,
      },
      {
        name: "Peter",
        age: 40,
      },
      {
        name: "Virat",
        age: 30,
      },
      {
        name: "Rohit",
        age: 32,
      },
      {
        name: "Dhoni",
        age: 37,
      },
    ];
    const columns = [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Age",
        accessor: "age",
      },
    ];
    return (
      <div className="students-table">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">Students</h2>
          </div>
        </div>

        <div>
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={2}
            pageSizeOptions={[2, 4, 6]}
          />
        </div>
        {/* Start add  button section*/}

        {/*
        <div className="col-12 add">
            <button className="btn plus">
                <Link to="/admin/students/add">
                  <i className="fa fa-plus"></i>
                </Link>
            </button>
        </div>
        
        <div style={{ "overflow-x": "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Birthday</th>
                <th>Birth place</th>
                <th>Telephone</th>
                <th>Sex</th>
                <th>Tuteur</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            {this.state.students.length === 0 ? (
              <div>empty</div>
            ) : (
              this.state.students.map((student, index) => (
                
                <tbody key={index}>
                  <tr>
                  <td>{student.id}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.birthday}</td>
                  <td>{student.birthPlace}</td>
                  <td>{student.telephone}</td>
                  <td>{student.sex}</td>
                  <td>{student.tuteur}</td>
                  <td>
                      <Link to={"/admin/students/edit/" + student.id}>
                        <i className="fa fa-edit"></i>
                      </Link>
                  </td>
                  <td>
                    <button className="delete btn" onClick={() => this.deleteStudent(student.id)}>
                     <i className="fa fa-trash" ></i>
                    </button>
                  </td>
                </tr>
                </tbody>
              ))
            )}
          </table>
        </div>

        */}
      </div>
    );
  }
}
